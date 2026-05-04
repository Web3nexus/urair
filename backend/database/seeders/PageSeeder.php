<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\Page::query()->delete();

        $pages = [
            [
                'title' => 'About URAIR',
                'slug' => 'about',
                'content' => 'URAIR is a high-performance gear house dedicated to providing elite tech products, ergonomic workspace solutions, and off-grid power systems. We bridge the gap between architectural intelligence and professional everyday utility.',
                'meta_description' => 'Learn more about URAIR, our mission, and our commitment to architectural tech intelligence.'
            ],
            [
                'title' => 'Privacy Policy',
                'slug' => 'privacy',
                'content' => 'Your privacy is critical to our ecosystem. This policy outlines how we protect your digital footprint when you interact with the URAIR platform.',
                'meta_description' => 'Read our privacy protocol to understand how we handle your encrypted data.'
            ],
            [
                'title' => 'Terms of Operation',
                'slug' => 'terms',
                'content' => 'By utilizing URAIR, you adhere to the operational protocols outlined here. These govern your acquisitions, logistics, and utilization of our infrastructure.',
                'meta_description' => 'View the operational terms governing the use of URAIR.'
            ],
            [
                'title' => 'Tech Specs',
                'slug' => 'specs',
                'content' => 'Detailed technical specifications of our high-performance gear. Built for durability, optimized for rapid transit.',
                'meta_description' => 'Explore the technical specifications of URAIR gear.'
            ],
            [
                'title' => 'Innovation Lab',
                'slug' => 'innovation',
                'content' => 'Welcome to the URAIR Innovation Lab. Here we conceptualize the future of architectural intelligence and professional workstation gear.',
                'meta_description' => 'Discover the future of gear at the URAIR Innovation Lab.'
            ],
            [
                'title' => 'Press Room',
                'slug' => 'press',
                'content' => 'Latest news, press releases, and media assets for URAIR.',
                'meta_description' => 'URAIR news and press releases.'
            ],
            [
                'title' => 'Direct Support',
                'slug' => 'support',
                'content' => 'Connect with our Direct Support team for assistance with your acquisitions, technical inquiries, or warranty claims.',
                'meta_description' => 'Get support for your URAIR gear.'
            ],
            [
                'title' => 'Logistics Tracking',
                'slug' => 'delivery',
                'content' => 'Track your asset dispatch in real-time. Enter your tracking ID to monitor the delivery status.',
                'meta_description' => 'Track your URAIR delivery.'
            ],
            [
                'title' => 'Manage Acquisitions',
                'slug' => 'deliveries',
                'content' => 'Manage your pending and completed acquisitions. Review order details and dispatch information.',
                'meta_description' => 'Manage your URAIR acquisitions.'
            ],
            [
                'title' => 'Security',
                'slug' => 'security',
                'content' => 'Our security protocols ensure your data and digital footprint remain encrypted and protected within the URAIR ecosystem.',
                'meta_description' => 'Learn about URAIR security protocols.'
            ]
        ];

        foreach ($pages as $page) {
            \App\Models\Page::create($page);
        }
    }
}
