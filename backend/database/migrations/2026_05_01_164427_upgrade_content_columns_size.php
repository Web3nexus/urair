<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Using raw SQL to ensure compatibility with large Base64 strings across environments
        DB::statement('ALTER TABLE settings MODIFY value LONGTEXT');
        DB::statement('ALTER TABLE homepage_sections MODIFY content LONGTEXT');
        DB::statement('ALTER TABLE homepage_section_items MODIFY image LONGTEXT');
        DB::statement('ALTER TABLE products MODIFY images LONGTEXT');
    }

    public function down(): void
    {
        //
    }
};
