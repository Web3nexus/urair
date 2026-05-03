<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data
        ProductImage::query()->delete();
        Product::query()->delete();
        Category::query()->delete();
        Brand::query()->delete();

        // 1. Create Tech-Focused Categories
        $categories = [
            'Tech Gear' => ['Laptop Bags', 'Tech Sleeves', 'Cable Organizers', 'Tech Backpacks'],
            'Office Setup' => ['Ergonomic Chairs', 'Standing Desks', 'Monitor Arms', 'Desk Mats'],
            'Power & Energy' => ['Power Stations', 'Solar Panels', 'Power Banks', 'Charging Hubs'],
            'Accessories' => ['Mechanical Keyboards', 'Precision Mice', 'Webcams', 'Headsets'],
        ];

        foreach ($categories as $parentName => $children) {
            $parent = Category::create([
                'name' => $parentName,
                'slug' => Str::slug($parentName),
            ]);

            foreach ($children as $childName) {
                Category::create([
                    'name' => $childName,
                    'slug' => Str::slug($childName),
                    'parent_id' => $parent->id,
                ]);
            }
        }

        // 2. Create Brands
        $brands = ['URAIR TECH', 'URIA', 'VOLTIX', 'NEOCORE', 'KINETIC'];
        foreach ($brands as $brandName) {
            Brand::create([
                'name' => $brandName,
                'slug' => Str::slug($brandName),
            ]);
        }

        // 3. Create Tech Products
        $products = [
            [
                'name' => 'URAIR Executive Laptop Bag',
                'description' => 'A high-performance tech carrier for the modern professional. Engineered with ballistic nylon and internal shock-absorption for maximum protection.',
                'price' => 185.00,
                'old_price' => 220.00,
                'stock' => 50,
                'category' => 'Laptop Bags',
                'brand' => 'URAIR TECH',
                'rating' => 4.9,
                'is_featured' => true,
                'material' => '1680D Ballistic Nylon',
                'weight' => '0.9kg',
                'colors' => ['#1A1A1A', '#3C3C3C', '#2C3E50'],
                'sizes' => ['14-inch', '16-inch'],
                'specifications' => [
                    'Dimensions' => '42cm x 31cm x 8cm',
                    'Compartments' => '12 Dedicated Pockets',
                    'Water Resistance' => 'IPX4 Rated Coat'
                ],
                'images' => [
                    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
                    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800'
                ],
            ],
            [
                'name' => 'Uria Lasp Tech Dock',
                'description' => 'The ultimate companion for your workspace. A minimalist vertical laptop stand integrated with a high-speed 10-in-1 USB-C hub.',
                'price' => 145.00,
                'old_price' => 175.00,
                'stock' => 30,
                'category' => 'Charging Hubs',
                'brand' => 'URIA',
                'rating' => 4.8,
                'is_featured' => true,
                'material' => 'Anodized Aluminum',
                'weight' => '450g',
                'colors' => ['#C0C0C0', '#1A1A1A', '#4F4631'],
                'sizes' => ['Standard'],
                'specifications' => [
                    'Ports' => '2x HDMI 4K, 3x USB 3.0, SD Card',
                    'Power Delivery' => '100W Pass-through',
                    'Compatibility' => 'Universal USB-C'
                ],
                'images' => [
                    'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?auto=format&fit=crop&q=80&w=800',
                    'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=800'
                ],
            ],
            [
                'name' => 'URAIR Kinetic Office Chair',
                'description' => 'Experience gravity-defying comfort. The Kinetic features dynamic lumbar support and breathable tech-mesh for long-duration productivity.',
                'price' => 850.00,
                'old_price' => 990.00,
                'stock' => 15,
                'category' => 'Ergonomic Chairs',
                'brand' => 'KINETIC',
                'rating' => 5.0,
                'is_featured' => true,
                'material' => 'Proprietary Aero-Mesh',
                'weight' => '18kg',
                'colors' => ['#1A1A1A', '#F9F7F2', '#3C3C3C'],
                'sizes' => ['Adjustable Fit'],
                'specifications' => [
                    'Tilt' => 'Synchronized 4-Point Recline',
                    'Casters' => 'Precision Silent-Glide',
                    'Warranty' => '10-Year Frame Warranty'
                ],
                'images' => [
                    '/Users/vincent/.gemini/antigravity/brain/60b9e055-264d-4121-909a-3093d2814c31/urair_kinetic_chair_1777579709473.png',
                    'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=800'
                ],
            ],
            [
                'name' => 'Voltix Pro Power Station',
                'description' => 'Elite power for off-grid operations. 1500Wh capacity with pure sine wave AC outlets to power everything from laptops to workstations.',
                'price' => 1250.00,
                'old_price' => 1400.00,
                'stock' => 10,
                'category' => 'Power Stations',
                'brand' => 'VOLTIX',
                'rating' => 4.9,
                'is_featured' => true,
                'material' => 'Polycarbonate & Aluminum Shell',
                'weight' => '14kg',
                'colors' => ['#1A1A1A', '#A67C52'],
                'sizes' => ['1500Wh'],
                'specifications' => [
                    'Capacity' => '1512Wh (420000mAh)',
                    'AC Output' => '2000W (Surge 4000W)',
                    'Charge Time' => '2 Hours to 80%'
                ],
                'images' => [
                    '/Users/vincent/.gemini/antigravity/brain/60b9e055-264d-4121-909a-3093d2814c31/voltix_power_station_1777579783691.png',
                    'https://images.unsplash.com/photo-1617783852033-0498a9643537?auto=format&fit=crop&q=80&w=800'
                ],
            ],
            [
                'name' => 'Neocore Precision Mouse',
                'description' => 'The ultimate tool for creative precision. Zero-latency wireless tracking with customizable haptic feedback.',
                'price' => 110.00,
                'stock' => 80,
                'category' => 'Precision Mice',
                'brand' => 'NEOCORE',
                'rating' => 4.7,
                'is_featured' => false,
                'material' => 'Soft-Touch Recycled Polymer',
                'weight' => '75g',
                'colors' => ['#1A1A1A', '#C0C0C0'],
                'sizes' => ['Ambidextrous'],
                'specifications' => [
                    'DPI' => 'Up to 26,000 native DPI',
                    'Battery' => '120 Hours on single charge',
                    'Switches' => 'Optical Gen-3 (90M Clicks)'
                ],
                'images' => ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800'],
            ]
        ];

        foreach ($products as $p) {
            $p['slug'] = Str::slug($p['name']);
            $categoryName = $p['category'];
            $brandName = $p['brand'];
            
            unset($p['category'], $p['brand']);
            
            $cat = Category::where('name', $categoryName)->first();
            $brd = Brand::where('name', $brandName)->first();
            
            $p['category_id'] = $cat?->id;
            $p['brand_id'] = $brd?->id;
            $p['category'] = $categoryName; 
            
            $product = Product::create($p);
            
            // Create Product Images
            foreach ($p['images'] as $idx => $url) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => $url,
                    'sort_order' => $idx,
                    'is_featured' => $idx === 0
                ]);
            }
        }
    }
}
