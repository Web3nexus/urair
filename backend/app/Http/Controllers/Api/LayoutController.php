<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FooterSection;
use App\Models\FooterLink;
use App\Models\NavigationItem;
use Illuminate\Http\Request;

class LayoutController extends Controller
{
    public function index()
    {
        return response()->json([
            'navigation' => NavigationItem::where('is_active', true)->orderBy('sort_order')->get(),
            'footer' => FooterSection::where('is_active', true)->with('links')->orderBy('sort_order')->get(),
        ]);
    }

    public function updateNavigation(Request $request)
    {
        $links = $request->all();
        NavigationItem::truncate();
        foreach ($links as $idx => $link) {
            NavigationItem::create([
                'name' => $link['name'],
                'path' => $link['path'],
                'sort_order' => $idx,
                'is_active' => true
            ]);
        }
        return response()->json(['message' => 'Navigation updated']);
    }

    public function updateFooter(Request $request)
    {
        $sections = $request->all();
        FooterSection::query()->delete(); // Will cascade delete links
        foreach ($sections as $sIdx => $sectionData) {
            $section = FooterSection::create([
                'title' => $sectionData['title'],
                'sort_order' => $sIdx,
                'is_active' => true
            ]);

            foreach ($sectionData['links'] as $lIdx => $linkData) {
                FooterLink::create([
                    'footer_section_id' => $section->id,
                    'name' => $linkData['name'],
                    'path' => $linkData['path'],
                    'sort_order' => $lIdx,
                    'is_active' => true
                ]);
            }
        }
        return response()->json(['message' => 'Footer updated']);
    }
}
