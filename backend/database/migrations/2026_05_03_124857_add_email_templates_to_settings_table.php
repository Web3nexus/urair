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
        // Registration Email
        \DB::table('settings')->insertOrIgnore([
            ['key' => 'email_registration_subject', 'value' => 'Welcome to URAIR'],
            ['key' => 'email_registration_body', 'value' => '<h2>Welcome, {{name}}!</h2><p>Thank you for joining URAIR. Your account has been successfully created.</p><p>You can now explore our curated collections of premium tech gear and luxury lifestyle products.</p>'],
            
            // Order Confirmation
            ['key' => 'email_order_confirmed_subject', 'value' => 'Order Confirmed!'],
            ['key' => 'email_order_confirmed_body', 'value' => '<h2>Order Confirmed!</h2><p>Hi {{name}},</p><p>Thank you for your order. We\'ve received your request and are currently processing it.</p><div class="order-meta"><p><strong>Order ID:</strong> #{{order_id}}</p><p><strong>Total Amount:</strong> {{total}}</p></div>'],
            
            // Order Status Update
            ['key' => 'email_order_status_subject', 'value' => 'Order Status Updated'],
            ['key' => 'email_order_status_body', 'value' => '<h2>Order Update</h2><p>Hi {{name}},</p><p>Your order #{{order_id}} status has been updated to: <strong>{{status}}</strong>.</p>'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Not dropping the table, just an additive migration
    }
};
