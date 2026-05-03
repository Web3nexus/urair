<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->json('colors')->nullable()->after('images');
            $table->json('sizes')->nullable()->after('colors');
            $table->json('specifications')->nullable()->after('sizes');
            $table->string('material')->nullable()->after('description');
            $table->string('weight')->nullable()->after('material');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['colors', 'sizes', 'specifications', 'material', 'weight']);
        });
    }
};
