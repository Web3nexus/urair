<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscription;
use Illuminate\Http\Request;

class NewsletterSubscriptionController extends Controller
{
    public function index()
    {
        return response()->json(NewsletterSubscription::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:newsletter_subscriptions,email',
        ]);

        $subscription = NewsletterSubscription::create($validated);

        return response()->json([
            'message' => 'Thank you for subscribing!',
            'subscription' => $subscription
        ], 201);
    }

    public function destroy(NewsletterSubscription $subscription)
    {
        $subscription->delete();
        return response()->json(null, 204);
    }
}
