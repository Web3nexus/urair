<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HomepageSection;
use Illuminate\Http\Request;

class HomepageController extends Controller
{
    public function index()
    {
        $sections = HomepageSection::with(['items.product'])
            ->orderBy('sort_order')
            ->get();

        $sections->map(function($section) {
            if ($section->type === 'product_grid' && isset($section->content['selection_mode']) && $section->content['selection_mode'] === 'category') {
                $categoryId = $section->content['category_id'] ?? null;
                if ($categoryId) {
                    $products = \App\Models\Product::where('category_id', $categoryId)
                        ->orWhereHas('category', function($q) use ($categoryId) {
                            $q->where('parent_id', $categoryId);
                        })
                        ->limit(8)->get();
                    
                    $section->items = $products->map(function($product) {
                        return [
                            'id' => 'cat-' . $product->id,
                            'product' => $product,
                            'product_id' => $product->id
                        ];
                    });
                }
            }
            return $section;
        });

        return response()->json($sections);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'title' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'content' => 'nullable|array',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'items' => 'nullable|array',
        ]);

        $section = HomepageSection::create($validated);

        if ($request->has('items')) {
            foreach ($request->items as $idx => $item) {
                $section->items()->create(array_merge($item, ['sort_order' => $idx]));
            }
        }

        return response()->json($section->load('items.product'), 201);
    }

    public function update(Request $request, HomepageSection $section)
    {
        $validated = $request->validate([
            'type' => 'string',
            'title' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'content' => 'nullable|array',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'items' => 'nullable|array',
        ]);

        $section->update($validated);

        if ($request->has('items')) {
            $section->items()->delete();
            foreach ($request->items as $idx => $item) {
                $section->items()->create(array_merge($item, ['sort_order' => $idx]));
            }
        }

        return response()->json($section->load('items.product'));
    }

    public function destroy(HomepageSection $section)
    {
        $section->delete();
        return response()->json(null, 204);
    }
}
