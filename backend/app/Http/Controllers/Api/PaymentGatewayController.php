<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;

class PaymentGatewayController extends Controller
{
    public function index()
    {
        return response()->json(PaymentGateway::all());
    }

    public function active()
    {
        return response()->json(
            PaymentGateway::where('is_active', true)
                ->select(['id', 'provider', 'public_key', 'is_active'])
                ->get()
        );
    }

    public function update(Request $request, PaymentGateway $gateway)
    {
        $validated = $request->validate([
            'public_key' => 'nullable|string',
            'secret_key' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $gateway->update($validated);

        return response()->json($gateway);
    }
}
