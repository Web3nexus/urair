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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('shipping_method')->nullable()->after('status');
            $table->decimal('shipping_cost', 10, 2)->default(0)->after('shipping_method');
            $table->json('shipping_details')->nullable()->after('shipping_address');
            $table->json('billing_details')->nullable()->after('shipping_details');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['shipping_method', 'shipping_cost', 'shipping_details', 'billing_details']);
        });
    }
};
