<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('meta_description', 160)->nullable()->after('description');
            $table->json('tags')->nullable()->after('meta_description');
            // in_stock | out_of_stock | backorder
            $table->string('stock_status')->default('in_stock')->after('stock');
            $table->date('backorder_available_date')->nullable()->after('stock_status');
            $table->string('backorder_message')->nullable()->after('backorder_available_date');
        });

        Schema::create('product_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('author_name');
            $table->string('author_email')->nullable();
            $table->tinyInteger('rating')->default(5); // 1-5
            $table->string('title')->nullable();
            $table->text('body');
            $table->string('status')->default('pending'); // pending | approved | rejected
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_reviews');
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['meta_description', 'tags', 'stock_status', 'backorder_available_date', 'backorder_message']);
        });
    }
};
