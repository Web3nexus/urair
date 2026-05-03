<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Curation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CurationController extends Controller
{
    public function index()
    {
        return response()->json(Curation::with('products')->get());
    }

    public function show(Curation $curation)
    {
        return response()->json($curation->load('products'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string',
            'description' => 'nullable|string',
            'image'       => 'nullable|string',
        ]);
        $validated['slug'] = Str::slug($validated['name']);
        $curation = Curation::create($validated);

        if ($request->has('product_ids')) {
            foreach ($request->product_ids as $idx => $pid) {
                $curation->products()->attach($pid, ['sort_order' => $idx]);
            }
        }

        return response()->json($curation->load('products'), 201);
    }

    public function update(Request $request, Curation $curation)
    {
        $validated = $request->validate([
            'name'        => 'string',
            'description' => 'nullable|string',
            'image'       => 'nullable|string',
        ]);
        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        $curation->update($validated);

        if ($request->has('product_ids')) {
            $curation->products()->detach();
            foreach ($request->product_ids as $idx => $pid) {
                $curation->products()->attach($pid, ['sort_order' => $idx]);
            }
        }

        return response()->json($curation->load('products'));
    }

    public function destroy(Curation $curation)
    {
        $curation->delete();
        return response()->json(null, 204);
    }
}
