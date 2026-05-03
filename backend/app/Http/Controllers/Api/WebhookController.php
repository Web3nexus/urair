<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\PaymentGateway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderStatusUpdated;

class WebhookController extends Controller
{
    /**
     * Handle Paystack webhook events.
     *
     * SECURITY: Verifies the x-paystack-signature header using HMAC-SHA512
     * before trusting any payload. Orders are only marked paid after this check.
     */
    public function paystack(Request $request)
    {
        // 1. Retrieve the Paystack secret key from the database (never the frontend)
        $gateway = PaymentGateway::where('provider', 'paystack')->first();

        if (!$gateway || !$gateway->secret_key) {
            Log::error('[Webhook:Paystack] Secret key not configured.');
            return response()->json(['message' => 'Gateway not configured'], 500);
        }

        // 2. Verify the webhook signature using HMAC-SHA512
        $signature = $request->header('x-paystack-signature');
        $rawPayload = $request->getContent();
        $expectedSignature = hash_hmac('sha512', $rawPayload, $gateway->secret_key);

        if (!hash_equals($expectedSignature, $signature ?? '')) {
            Log::warning('[Webhook:Paystack] Invalid signature detected. Possible spoofing attempt.', [
                'ip' => $request->ip(),
            ]);
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        // 3. Parse event
        $event = $request->json()->all();
        $eventType = $event['event'] ?? null;

        Log::info('[Webhook:Paystack] Received event', ['event' => $eventType]);

        // 4. Handle the charge.success event
        if ($eventType === 'charge.success') {
            $reference = $event['data']['reference'] ?? null;

            if (!$reference) {
                return response()->json(['message' => 'Missing reference'], 400);
            }

            // 5. Find the order by payment reference
            $order = Order::where('payment_reference', $reference)->first();

            if (!$order) {
                Log::warning('[Webhook:Paystack] Order not found for reference: ' . $reference);
                return response()->json(['message' => 'Order not found'], 404);
            }

            // 6. Idempotency check — do not double-process already paid orders
            if ($order->payment_status === 'paid') {
                Log::info('[Webhook:Paystack] Order already marked paid, skipping.', ['order_id' => $order->id]);
                return response()->json(['message' => 'Already processed']);
            }

            // 7. Mark order as paid
            $order->update([
                'payment_status' => 'paid',
                'status' => 'processing',
            ]);

            Log::info('[Webhook:Paystack] Order marked as paid.', ['order_id' => $order->id]);

            // 8. Send confirmation email
            try {
                Mail::to($order->user->email)->send(new OrderStatusUpdated($order->load(['user', 'items.product'])));
            } catch (\Exception $e) {
                Log::error('[Webhook:Paystack] Email failed: ' . $e->getMessage());
            }
        }

        return response()->json(['message' => 'Webhook processed'], 200);
    }

    /**
     * Handle Flutterwave webhook events.
     *
     * SECURITY: Verifies the verif-hash header against the secret hash
     * stored securely on the server, never exposed to the frontend.
     */
    public function flutterwave(Request $request)
    {
        // 1. Retrieve the Flutterwave gateway config
        $gateway = PaymentGateway::where('provider', 'flutterwave')->first();

        if (!$gateway || !$gateway->secret_key) {
            Log::error('[Webhook:Flutterwave] Secret key not configured.');
            return response()->json(['message' => 'Gateway not configured'], 500);
        }

        // 2. Verify webhook signature (Flutterwave uses a static "secret hash" header)
        $receivedHash = $request->header('verif-hash');

        if (!$receivedHash || !hash_equals($gateway->secret_key, $receivedHash)) {
            Log::warning('[Webhook:Flutterwave] Invalid verif-hash detected. Possible spoofing attempt.', [
                'ip' => $request->ip(),
            ]);
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        // 3. Parse event
        $payload = $request->json()->all();
        $status  = $payload['data']['status'] ?? null;
        $txRef   = $payload['data']['tx_ref'] ?? null;

        Log::info('[Webhook:Flutterwave] Received event', ['status' => $status, 'tx_ref' => $txRef]);

        if ($status === 'successful' && $txRef) {
            // 4. Find the order by payment reference
            $order = Order::where('payment_reference', $txRef)->first();

            if (!$order) {
                Log::warning('[Webhook:Flutterwave] Order not found for tx_ref: ' . $txRef);
                return response()->json(['message' => 'Order not found'], 404);
            }

            // 5. Idempotency check — do not double-process already paid orders
            if ($order->payment_status === 'paid') {
                Log::info('[Webhook:Flutterwave] Order already marked paid, skipping.', ['order_id' => $order->id]);
                return response()->json(['message' => 'Already processed']);
            }

            // 6. Mark order as paid
            $order->update([
                'payment_status' => 'paid',
                'status' => 'processing',
            ]);

            Log::info('[Webhook:Flutterwave] Order marked as paid.', ['order_id' => $order->id]);

            // 7. Send confirmation email
            try {
                Mail::to($order->user->email)->send(new OrderStatusUpdated($order->load(['user', 'items.product'])));
            } catch (\Exception $e) {
                Log::error('[Webhook:Flutterwave] Email failed: ' . $e->getMessage());
            }
        }

        return response()->json(['message' => 'Webhook processed'], 200);
    }
}
