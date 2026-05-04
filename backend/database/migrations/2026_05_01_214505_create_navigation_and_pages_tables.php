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
        Schema::dropIfExists('navigation_items');
        Schema::dropIfExists('navigations');
        Schema::dropIfExists('pages');
        Schema::dropIfExists('curation_products');
        Schema::dropIfExists('curation_product');
        Schema::dropIfExists('curations');

        Schema::create('navigations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('navigation_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('navigation_id')->constrained()->onDelete('cascade');
            $table->string('label');
            $table->string('url');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content')->nullable();
            $table->text('meta_description')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::create('curations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->longText('image')->nullable();
            $table->timestamps();
        });

        Schema::create('curation_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('curation_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('curation_products');
        Schema::dropIfExists('curations');
        Schema::dropIfExists('pages');
        Schema::dropIfExists('navigation_items');
        Schema::dropIfExists('navigations');
    }
};
