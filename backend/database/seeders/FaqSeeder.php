<?php

namespace Database\Seeders;

use App\Models\FaqItem;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\FaqItem::query()->delete();
        $faqs = [
            [
                'question' => 'How do I track my order?',
                'answer' => 'Once your order has been dispatched, you will receive an email with a tracking number and a link to the courier\'s website.',
                'category' => 'Delivery',
                'sort_order' => 1
            ],
            [
                'question' => 'What is your return policy?',
                'answer' => 'We offer a 30-day return policy for all unworn items in their original packaging. Please visit our Returns page for more details.',
                'category' => 'Returns',
                'sort_order' => 2
            ],
            [
                'question' => 'Do you ship internationally?',
                'answer' => 'Yes, URAIR ships to over 200 countries worldwide. Shipping costs and delivery times vary by location.',
                'category' => 'Delivery',
                'sort_order' => 3
            ]
        ];

        foreach ($faqs as $faq) {
            FaqItem::create($faq);
        }
    }
}
