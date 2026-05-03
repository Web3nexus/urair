<?php

namespace Database\Seeders;

use App\Models\HomepageSection;
use App\Models\HomepageSectionItem;
use App\Models\Product;
use Illuminate\Database\Seeder;

class HomepageSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing sections
        HomepageSection::query()->delete();

        // 1. Hero Section
        $hero = HomepageSection::create([
            'type' => 'hero',
            'title' => 'The Future of High-Performance Gear',
            'subtitle' => 'Elevate your professional ecosystem with URAIR\'s curated selection of elite tech products, ergonomic essentials, and off-grid power solutions.',
            'content' => [
                'image' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000',
                'stats' => [
                    ['value' => '150+', 'label' => 'Elite Tech Partners'],
                    ['value' => '5,000+', 'label' => 'Units Deployed'],
                    ['value' => '99.9%', 'label' => 'Reliability Rating']
                ]
            ],
            'sort_order' => 1
        ]);

        // 1.5 Brand Carousel
        $brands = HomepageSection::create([
            'type' => 'brand_carousel',
            'content' => ['brands' => ['URAIR TECH', 'URIA', 'VOLTIX', 'NEOCORE', 'KINETIC']],
            'sort_order' => 2
        ]);

        // 2. New Acquisitions
        $newArrivals = HomepageSection::create([
            'type' => 'product_grid',
            'title' => 'New Acquisitions',
            'subtitle' => 'The latest breakthroughs in tech architecture.',
            'sort_order' => 3
        ]);

        $arrivalsProducts = Product::orderBy('created_at', 'desc')->take(4)->get();
        foreach ($arrivalsProducts as $idx => $product) {
            HomepageSectionItem::create([
                'homepage_section_id' => $newArrivals->id,
                'product_id' => $product->id,
                'sort_order' => $idx
            ]);
        }

        // 3. Promotional Banner
        $banner = HomepageSection::create([
            'type' => 'banner',
            'title' => 'Off-Grid Mastery',
            'subtitle' => 'Unleash your potential anywhere. The Voltix series provides limitless power for the modern nomad.',
            'content' => [
                'cta_label' => 'Explore Power',
                'cta_link' => '/shop/power-stations',
                'bg_image' => 'https://images.unsplash.com/photo-1623127622858-eb09835f8d55?auto=format&fit=crop&q=80&w=2000'
            ],
            'sort_order' => 4
        ]);

        // 4. Elite Performance
        $topSelling = HomepageSection::create([
            'type' => 'product_grid',
            'title' => 'Elite Performance',
            'subtitle' => 'Trusted by the world\'s most ambitious individuals.',
            'sort_order' => 5
        ]);

        $topProducts = Product::where('is_featured', true)->take(4)->get();
        foreach ($topProducts as $idx => $product) {
            HomepageSectionItem::create([
                'homepage_section_id' => $topSelling->id,
                'product_id' => $product->id,
                'sort_order' => $idx
            ]);
        }

        // 5. Shop by Workspace Layer
        $dressStyle = HomepageSection::create([
            'type' => 'category_grid',
            'title' => 'Shop by Workspace Layer',
            'sort_order' => 5
        ]);

        $styles = [
            ['title' => 'Mobile Gear', 'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800', 'link' => '/shop/laptop-bags'],
            ['title' => 'Office Hub', 'image' => 'https://images.unsplash.com/photo-1505797149-43b0076649d7?auto=format&fit=crop&q=80&w=800', 'link' => '/shop/ergonomic-chairs'],
            ['title' => 'Power Base', 'image' => 'https://images.unsplash.com/photo-1623127622858-eb09835f8d55?auto=format&fit=crop&q=80&w=800', 'link' => '/shop/power-stations'],
            ['title' => 'Precision', 'image' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800', 'link' => '/shop/precision-mice'],
        ];

        foreach ($styles as $idx => $style) {
            HomepageSectionItem::create([
                'homepage_section_id' => $dressStyle->id,
                'title' => $style['title'],
                'image' => $style['image'],
                'link' => $style['link'],
                'sort_order' => $idx
            ]);
        }

        // 6. Intelligence Report (Testimonials)
        $testimonials = HomepageSection::create([
            'type' => 'testimonials',
            'title' => 'Intelligence Report',
            'sort_order' => 6
        ]);

        $reviews = [
            ['title' => 'Marc V.', 'subtitle' => '"The URAIR Executive bag is more than just luggage; it\'s a piece of engineering. It keeps my workstation organized and protected during global transits."', 'is_active' => true],
            ['title' => 'Sasha K.', 'subtitle' => '"The Kinetic chair has fundamentally changed my productivity. The lumbar support is unlike anything I\'ve experienced in conventional office furniture."', 'is_active' => true],
            ['title' => 'James L.', 'subtitle' => '"The Voltix station is an absolute beast. I ran my entire remote setup for 12 hours straight without a hitch. This is true off-grid freedom."', 'is_active' => true],
        ];

        foreach ($reviews as $idx => $review) {
            HomepageSectionItem::create([
                'homepage_section_id' => $testimonials->id,
                'title' => $review['title'],
                'subtitle' => $review['subtitle'],
                'sort_order' => $idx
            ]);
        }
    }
}
