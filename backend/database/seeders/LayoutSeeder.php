<?php

namespace Database\Seeders;

use App\Models\FooterLink;
use App\Models\FooterSection;
use App\Models\NavigationItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class LayoutSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing layout data
        Schema::disableForeignKeyConstraints();
        NavigationItem::query()->delete();
        FooterLink::query()->delete();
        FooterSection::query()->delete();
        Schema::enableForeignKeyConstraints();

        // Navigation Items
        $navItems = [
            ['name' => 'HOME', 'path' => '/', 'sort_order' => 1, 'is_active' => true],
            ['name' => 'COLLECTIONS', 'path' => '/shop', 'sort_order' => 2, 'is_active' => true],
            ['name' => 'CURATIONS', 'path' => '/curations', 'sort_order' => 3, 'is_active' => true],
            ['name' => 'STORY', 'path' => '/story', 'sort_order' => 4, 'is_active' => true],
        ];

        foreach ($navItems as $item) {
            NavigationItem::create($item);
        }

        // Footer Sections
        $footerData = [
            [
                'title' => 'Ecosystem',
                'sort_order' => 1,
                'is_active' => true,
                'links' => [
                    ['name' => 'About URAIR', 'path' => '/story', 'sort_order' => 1],
                    ['name' => 'Tech Specs', 'path' => '/p/specs', 'sort_order' => 2],
                    ['name' => 'Innovation Lab', 'path' => '/p/innovation', 'sort_order' => 3],
                    ['name' => 'Press Room', 'path' => '/p/press', 'sort_order' => 4],
                ]
            ],
            [
                'title' => 'Support',
                'sort_order' => 2,
                'is_active' => true,
                'links' => [
                    ['name' => 'Direct Support', 'path' => '/p/support', 'sort_order' => 1],
                    ['name' => 'Logistics Tracking', 'path' => '/p/delivery', 'sort_order' => 2],
                    ['name' => 'Service Agreement', 'path' => '/p/terms', 'sort_order' => 3],
                    ['name' => 'Privacy Protocol', 'path' => '/p/privacy', 'sort_order' => 4],
                ]
            ],
            [
                'title' => 'Vault',
                'sort_order' => 3,
                'is_active' => true,
                'links' => [
                    ['name' => 'My Account', 'path' => '/account', 'sort_order' => 1],
                    ['name' => 'Manage Acquisitions', 'path' => '/p/deliveries', 'sort_order' => 2],
                    ['name' => 'Order History', 'path' => '/account/orders', 'sort_order' => 3],
                    ['name' => 'Security', 'path' => '/p/security', 'sort_order' => 4],
                ]
            ]
        ];

        foreach ($footerData as $sectionData) {
            $links = $sectionData['links'];
            unset($sectionData['links']);
            
            $section = FooterSection::create($sectionData);
            
            foreach ($links as $linkData) {
                $linkData['footer_section_id'] = $section->id;
                $linkData['is_active'] = true;
                FooterLink::create($linkData);
            }
        }
    }
}
