<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('id')->constrained()->onDelete('set null');
            $table->foreignId('brand_id')->nullable()->after('category_id')->constrained()->onDelete('set null');
            $table->foreignId('collection_id')->nullable()->after('brand_id')->constrained()->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropForeign(['brand_id']);
            $table->dropForeign(['collection_id']);
            $table->dropColumn(['category_id', 'brand_id', 'collection_id']);
        });
    }
};
