<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function index()
    {
        return response()->json(Page::orderBy('created_at', 'desc')->get());
    }

    public function show($slug)
    {
        $page = Page::where('slug', $slug)->where('is_published', true)->firstOrFail();
        return response()->json($page);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'            => 'required|string',
            'content'          => 'nullable|string',
            'meta_description' => 'nullable|string',
            'is_published'     => 'boolean',
        ]);
        $validated['slug'] = Str::slug($validated['title']);
        if (isset($validated['content'])) {
            $validated['content'] = clean($validated['content']);
        }
        $page = Page::create($validated);
        return response()->json($page, 201);
    }

    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title'            => 'string',
            'content'          => 'nullable|string',
            'meta_description' => 'nullable|string',
            'is_published'     => 'boolean',
        ]);
        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }
        if (isset($validated['content'])) {
            $validated['content'] = clean($validated['content']);
        }
        $page->update($validated);
        return response()->json($page);
    }

    public function destroy(Page $page)
    {
        $page->delete();
        return response()->json(null, 204);
    }
}
