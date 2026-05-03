<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use App\Mail\DynamicMailable;
use App\Mail\OrderStatusUpdated;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(Order::with(['user', 'items.product'])->latest()->get());
    }

    public function myOrders(Request $request)
    {
        return response()->json($request->user()->orders()->with('items.product')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items'              => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1|max:100',
            'shipping_address'   => 'required|string|max:500',
            'payment_method'     => 'required|string|in:paystack,flutterwave,manual',
            'payment_reference'  => 'nullable|string|max:255', // Gateway-generated reference (e.g. Paystack ref)
        ]);

        $calculatedTotal = 0;
        $orderItemsData = [];

        try {
            $order = DB::transaction(function () use ($validated, $request, &$calculatedTotal, &$orderItemsData) {
                // Pre-validate stock with lock to prevent race conditions
                foreach ($validated['items'] as $item) {
                    $product = Product::where('id', $item['product_id'])->lockForUpdate()->firstOrFail();
                    
                    if ($product->stock < $item['quantity']) {
                        throw new \Exception("Insufficient stock for product: {$product->name}");
                    }
                    
                    $calculatedTotal += $product->price * $item['quantity'];
                    $orderItemsData[] = [
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price,
                        'product_name' => $product->name
                    ];
                }

                $order = Order::create([
                    'user_id'           => $request->user()->id,
                    'total_price'       => $calculatedTotal,
                    'shipping_address'  => $validated['shipping_address'],
                    'payment_method'    => $validated['payment_method'],
                    'payment_reference' => $validated['payment_reference'] ?? null,
                    'status'            => 'pending',
                    'payment_status'    => 'pending',
                ]);

                foreach ($orderItemsData as $itemData) {
                    $order->items()->create([
                        'product_id' => $itemData['product_id'],
                        'quantity' => $itemData['quantity'],
                        'price' => $itemData['price'],
                    ]);
                    
                    // Decrement stock securely within transaction
                    Product::where('id', $itemData['product_id'])->decrement('stock', $itemData['quantity']);
                }

                return $order;
            });

            // Send confirmation email using dynamic template
            try {
                Mail::to($request->user()->email)->send(new DynamicMailable('order_confirmed', [
                    'name' => $request->user()->name,
                    'order_id' => $order->id,
                    'total' => number_format($order->total_price, 2),
                ], [
                    'url' => env('FRONTEND_URL', 'http://localhost:5173') . '/account/orders/' . $order->id,
                    'text' => 'View Order Details'
                ]));
            } catch (\Exception $e) {
                \Log::error('Failed to send order confirmation email: ' . $e->getMessage());
            }

            return response()->json($order->load('items'), 201);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show(Order $order)
    {
        return response()->json($order->load(['user', 'items.product']));
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'string|in:pending,received,packed,sent_for_delivery,delivered,cancelled,refunded',
            'tracking_number' => 'nullable|string',
            'rider_id' => 'nullable|exists:users,id',
        ]);

        $oldStatus = $order->status;
        $order->update($validated);

        if ($oldStatus !== $order->status) {
            try {
                Mail::to($order->user->email)->send(new DynamicMailable('order_status', [
                    'name' => $order->user->name,
                    'order_id' => $order->id,
                    'status' => ucfirst(str_replace('_', ' ', $order->status)),
                ], [
                    'url' => env('FRONTEND_URL', 'http://localhost:5173') . '/account/orders/' . $order->id,
                    'text' => 'View Order'
                ]));
            } catch (\Exception $e) {
                \Log::error('Failed to send order status update email: ' . $e->getMessage());
            }
        }

        return response()->json($order->load(['user', 'rider', 'items.product']));
    }

    public function verifyPayment(Request $request, Order $order)
    {
        // IDOR Protection: Ensure user owns this order
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized access to order'], 403);
        }

        // Note: This endpoint should ideally be replaced by secure webhooks.
        // It is currently kept for legacy/polling purposes, but trusting frontend payment_status is risky.
        
        $validated = $request->validate([
            'payment_status' => 'required|string|in:paid,failed',
            'transaction_reference' => 'nullable|string',
        ]);

        $order->update([
            'payment_status' => $validated['payment_status'],
            // Optionally store transaction_reference if you added it to the DB schema
        ]);

        // If paid, you might also want to update the overall order status
        if ($validated['payment_status'] === 'paid') {
            $order->update(['status' => 'processing']);
        }

        return response()->json(['message' => 'Payment status updated', 'order' => $order]);
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json(null, 204);
    }
}
