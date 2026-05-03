<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Navigation;
use App\Models\NavigationItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NavigationController extends Controller
{
    public function index()
    {
        return response()->json(
            Navigation::with(['items.children'])->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
        ]);
        $validated['slug'] = Str::slug($validated['name']);
        $nav = Navigation::create($validated);
        return response()->json($nav->load('items.children'), 201);
    }

    public function update(Request $request, Navigation $navigation)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'items' => 'nullable|array',
        ]);

        $navigation->update(['name' => $validated['name']]);

        if ($request->has('items')) {
            $navigation->allItems()->delete();
            foreach ($request->items as $idx => $item) {
                $parent = NavigationItem::create([
                    'navigation_id' => $navigation->id,
                    'label' => $item['label'],
                    'url' => $item['url'],
                    'parent_id' => null,
                    'sort_order' => $idx,
                ]);
                foreach ($item['children'] ?? [] as $cidx => $child) {
                    NavigationItem::create([
                        'navigation_id' => $navigation->id,
                        'label' => $child['label'],
                        'url' => $child['url'],
                        'parent_id' => $parent->id,
                        'sort_order' => $cidx,
                    ]);
                }
            }
        }

        return response()->json($navigation->load('items.children'));
    }

    public function destroy(Navigation $navigation)
    {
        $navigation->delete();
        return response()->json(null, 204);
    }
}
