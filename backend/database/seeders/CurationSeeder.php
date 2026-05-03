<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Curation;
use App\Models\Product;

class CurationSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing curations
        Curation::query()->delete();

        $curations = [
            [
                'name' => 'The High-Performance Workspace',
                'slug' => 'high-performance-workspace',
                'description' => 'A curated selection of ergonomic tools and docking solutions for peak professional output.',
                'hero_image' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
                'products' => ['URAIR Kinetic Office Chair', 'Uria Lasp Tech Dock', 'Neocore Precision Mouse']
            ],
            [
                'name' => 'The Nomad Protocol',
                'slug' => 'nomad-protocol',
                'description' => 'Essential gear for the modern wanderer. Stay powered and protected in any environment.',
                'hero_image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1200',
                'products' => ['URAIR Executive Laptop Bag', 'Voltix Pro Power Station', 'Neocore Precision Mouse']
            ]
        ];

        foreach ($curations as $data) {
            $productNames = $data['products'];
            unset($data['products']);

            $curation = Curation::create($data);

            foreach ($productNames as $idx => $name) {
                $product = Product::where('name', $name)->first();
                if ($product) {
                    $curation->products()->attach($product->id, ['sort_order' => $idx]);
                }
            }
        }
    }
}
