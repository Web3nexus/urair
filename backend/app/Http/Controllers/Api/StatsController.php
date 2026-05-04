<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function index()
    {
        // Core Overview Metrics
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('total_price');
        $activeOrders = Order::whereIn('status', ['pending', 'received', 'packed', 'sent_for_delivery'])->count();
        $totalCustomers = User::where('role', 'customer')->count();
        $openTickets = \App\Models\Ticket::where('status', 'open')->count();

        // Staff & Logistics Metrics
        $activeRiders = User::where('role', 'delivery_rider')->count();
        $outForDelivery = Order::where('status', 'sent_for_delivery')->count();
        $activeStaffs = User::whereIn('role', ['finance', 'stock_agent'])->count();

        // Conversion Rate (Orders / Unique Customers)
        $totalUniqueBuyers = Order::distinct('user_id')->count();
        $conversionRate = $totalCustomers > 0 ? ($totalUniqueBuyers / $totalCustomers) * 100 : 0;

        // Sales Category Index
        $categorySales = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', '!=', 'cancelled')
            ->select('categories.name', DB::raw('SUM(order_items.quantity * order_items.price) as revenue'))
            ->groupBy('categories.id', 'categories.name')
            ->get();

        // Sales data for chart (Revenue Growth) - Last 6 months with labels
        $salesData = collect(range(5, 0))->map(function($i) {
            $date = now()->subMonths($i);
            $monthLabel = $date->format('M');
            $monthYear = $date->format('Y-m');
            
            $revenue = Order::where('status', '!=', 'cancelled')
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->sum('total_price');
                
            return [
                'name' => $monthLabel,
                'revenue' => (float)$revenue,
                'period' => $monthYear
            ];
        });

        // Calculate Revenue Growth (Month over Month)
        $currentMonthRevenue = Order::where('status', '!=', 'cancelled')
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->sum('total_price');
        $lastMonthRevenue = Order::where('status', '!=', 'cancelled')
            ->whereYear('created_at', now()->subMonth()->year)
            ->whereMonth('created_at', now()->subMonth()->month)
            ->sum('total_price');
        $revenueGrowth = $lastMonthRevenue > 0 ? (($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 : 100;

        // Top Selling Products
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', '!=', 'cancelled')
            ->select('products.id', 'products.name', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get();

        $currencySymbol = \App\Models\Setting::where('key', 'currencySymbol')->value('value') ?: '₦';

        return response()->json([
            'overview' => [
                ['label' => 'Total Revenue', 'value' => $currencySymbol . number_format($totalRevenue, 2), 'trend' => ($revenueGrowth >= 0 ? '+' : '') . number_format($revenueGrowth, 1) . '%', 'icon' => 'DollarSign'],
                ['label' => 'Active Orders', 'value' => (string)$activeOrders, 'trend' => 'Orders', 'icon' => 'ShoppingCart'],
                ['label' => 'Total Customers', 'value' => (string)$totalCustomers, 'trend' => 'Users', 'icon' => 'Users'],
                ['label' => 'Conversion Rate', 'value' => number_format($conversionRate, 1) . '%', 'trend' => 'Traffic', 'icon' => 'TrendingUp'],
            ],
            'logistics' => [
                ['label' => 'Active Riders', 'value' => (string)$activeRiders, 'icon' => 'Truck'],
                ['label' => 'Out for Delivery', 'value' => (string)$outForDelivery, 'icon' => 'Package'],
                ['label' => 'Active Staffs', 'value' => (string)$activeStaffs, 'icon' => 'Briefcase'],
                ['label' => 'Open Tickets', 'value' => (string)$openTickets, 'icon' => 'AlertCircle'],
            ],
            'sales_chart' => $salesData,
            'category_index' => $categorySales,
            'top_products' => $topProducts,
            'recent_orders' => Order::with('user')->orderBy('created_at', 'desc')->take(8)->get(),
            'inventory_overview' => Product::orderBy('stock', 'asc')->take(10)->get()->map(fn($p) => [
                'id'     => $p->id,
                'name'   => $p->name,
                'stock'  => $p->stock,
                'status' => $p->stock === 0 ? 'Out of Stock' : ($p->stock < 10 ? 'Critical' : 'Low Stock'),
            ]),
        ]);
    }
}
