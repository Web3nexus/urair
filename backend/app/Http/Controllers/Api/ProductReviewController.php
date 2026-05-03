<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;

class ProductReviewController extends Controller
{
    // Public: get approved reviews for a product
    public function index(Product $product)
    {
        return response()->json(
            $product->approvedReviews()->with('user:id,name')->get()
        );
    }

    // Public: submit a review
    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'author_name'  => 'required|string|max:100',
            'author_email' => 'nullable|email',
            'rating'       => 'required|integer|min:1|max:5',
            'title'        => 'nullable|string|max:150',
            'body'         => 'required|string|max:2000',
        ]);

        $validated['author_name'] = strip_tags($validated['author_name']);
        $validated['title']       = $validated['title'] ? strip_tags($validated['title']) : null;
        $validated['body']        = clean($validated['body']); // Allow safe HTML or clean it
        
        $validated['product_id'] = $product->id;
        $validated['user_id']    = $request->user()?->id;
        $validated['status']     = 'pending';

        $review = ProductReview::create($validated);

        return response()->json($review, 201);
    }

    // Admin: list ALL reviews (any status) for a product or across all products
    public function adminIndex(Request $request)
    {
        $query = ProductReview::with(['product:id,name,slug', 'user:id,name'])
            ->latest();

        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->get());
    }

    // Admin: approve / reject / delete
    public function update(Request $request, ProductReview $review)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $review->update($validated);
        return response()->json($review);
    }

    public function destroy(ProductReview $review)
    {
        $review->delete();
        return response()->json(null, 204);
    }
}
