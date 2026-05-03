<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'systemName' => 'URAIR',
            'announcementText' => 'Sign up and get 20% off to your first order.',
            'showAnnouncement' => '1',
            
            // Hero Section (Defaults)
            'heroTitle' => 'Find Clothes That Matches Your Style',
            'heroSubtitle' => 'Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.',
            
            // Newsletter
            'newsletterTitle' => 'STAY UP TO DATE ABOUT OUR LATEST OFFERS',
            'newsletterPlaceholder' => 'Enter your email address',
            'newsletterButtonText' => 'Subscribe to Newsletter',
            
            // Design Tokens
            'primaryColor' => '#000000',
            'secondaryColor' => '#f0f0f0',
            'accentColor' => '#ffc633',
            'baseFontSize' => '16',
            'headingFont' => 'Playfair Display',
            'bodyFont' => 'Inter',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
