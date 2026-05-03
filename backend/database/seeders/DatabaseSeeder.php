<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin User
        User::updateOrCreate(
            ['email' => 'admin@urair.com'],
            [
                'name' => 'Admin Manager',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // 2. Data Seeders
        $this->call([
            SettingSeeder::class,
            ProductSeeder::class,
            CurationSeeder::class,
            LayoutSeeder::class,
            HomepageSeeder::class,
            PageSeeder::class,
            FaqSeeder::class,
        ]);
    }
}
