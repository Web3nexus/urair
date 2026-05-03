<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function index()
    {
        return response()->json(Coupon::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|unique:coupons',
            'type' => 'required|in:fixed,percent',
            'value' => 'required|numeric',
            'min_spend' => 'nullable|numeric',
            'expires_at' => 'nullable|date',
            'usage_limit' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $coupon = Coupon::create($validated);
        return response()->json($coupon);
    }

    public function update(Request $request, Coupon $coupon)
    {
        $validated = $request->validate([
            'code' => 'required|unique:coupons,code,' . $coupon->id,
            'type' => 'required|in:fixed,percent',
            'value' => 'required|numeric',
            'min_spend' => 'nullable|numeric',
            'expires_at' => 'nullable|date',
            'usage_limit' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $coupon->update($validated);
        return response()->json($coupon);
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();
        return response()->json(['message' => 'Coupon deleted']);
    }

    public function validateCoupon(Request $request)
    {
        $request->validate(['code' => 'required']);
        $coupon = Coupon::where('code', $request->code)
            ->where('is_active', true)
            ->first();

        if (!$coupon) {
            return response()->json(['message' => 'Invalid or inactive coupon code.'], 422);
        }

        if ($coupon->expires_at && $coupon->expires_at->isPast()) {
            return response()->json(['message' => 'This coupon has expired.'], 422);
        }

        if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
            return response()->json(['message' => 'This coupon has reached its usage limit.'], 422);
        }

        return response()->json($coupon);
    }
}
