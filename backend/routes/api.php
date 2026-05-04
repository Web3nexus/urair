<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\HomepageController;
use App\Http\Controllers\Api\UserAddressController;
use App\Http\Controllers\Api\LayoutController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CurationController;
use App\Http\Controllers\Api\NavigationController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\ProductReviewController;
use App\Http\Controllers\Api\NewsletterSubscriptionController;
use App\Http\Controllers\Api\WebhookController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Auth (Strict Rate Limiting for Login/Register)
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/admin/login', [AuthController::class, 'adminLogin']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/2fa/verify-login', [\App\Http\Controllers\Api\TwoFactorController::class, 'verifyLogin']);
});

// Email Verification (Public signed link)
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');
Route::post('/email/resend', [AuthController::class, 'resendVerification'])->middleware(['auth:sanctum', 'throttle:6,1'])->name('verification.send');

Route::apiResource('coupons', CouponController::class);
Route::post('/coupons/validate', [CouponController::class, 'validateCoupon']);

// Public API Rate Limiting
Route::middleware('throttle:60,1')->group(function () {
    // Public Storefront Data
    Route::get('/settings', [SettingController::class, 'index']);
    Route::get('/layout', [LayoutController::class, 'index']);
    Route::get('/homepage', [HomepageController::class, 'index']);
    Route::get('/pages/{slug}', [PageController::class, 'show']);
    Route::get('/faqs', [PageController::class, 'faqs']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/brands', [BrandController::class, 'index']);
    Route::get('/curations', [CurationController::class, 'index']);
    Route::get('/curations/{curation:slug}', [CurationController::class, 'show']);
    Route::get('/payment-gateways/active', [\App\Http\Controllers\Api\PaymentGatewayController::class, 'active']);
    Route::get('/navigations', [NavigationController::class, 'index']);
    Route::get('/pages', [PageController::class, 'index']);

    // Public product reviews
    Route::get('/products/{product}/reviews', [ProductReviewController::class, 'index']);
    Route::post('/products/{product}/reviews', [ProductReviewController::class, 'store'])->middleware('auth:sanctum');

    // Newsletter
    Route::post('/newsletter/subscribe', [NewsletterSubscriptionController::class, 'store']);
});

// Payment Webhooks — No auth required (verified by signature inside controller)
// Rate limited tightly to reduce abuse; real gateways send very few events
Route::middleware('throttle:30,1')->group(function () {
    Route::post('/webhooks/paystack',     [WebhookController::class, 'paystack']);
    Route::post('/webhooks/flutterwave',  [WebhookController::class, 'flutterwave']);
});

// Protected Area
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // 2FA Management
    Route::get('/2fa/status', [\App\Http\Controllers\Api\TwoFactorController::class, 'status']);
    Route::post('/2fa/setup', [\App\Http\Controllers\Api\TwoFactorController::class, 'setup']);
    Route::post('/2fa/enable', [\App\Http\Controllers\Api\TwoFactorController::class, 'enable']);
    Route::post('/2fa/disable', [\App\Http\Controllers\Api\TwoFactorController::class, 'disable']);
    Route::get('/2fa/recovery-codes', [\App\Http\Controllers\Api\TwoFactorController::class, 'recoveryCodes']);

    Route::apiResource('user-addresses', UserAddressController::class);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // User Orders
    Route::get('/my-orders', [OrderController::class, 'myOrders']);
    Route::post('/orders', [OrderController::class, 'store'])->middleware('verified');
    Route::post('/orders/{order}/verify-payment', [OrderController::class, 'verifyPayment']);

    // Support Tickets (User)
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::get('/tickets/{ticket}', [TicketController::class, 'show']);
    Route::post('/tickets/{ticket}/reply', [TicketController::class, 'reply']);

    // Admin Only
    Route::middleware('admin')->group(function () {
        Route::get('/admin/stats', [StatsController::class, 'index']);
        Route::get('/payment-gateways', [\App\Http\Controllers\Api\PaymentGatewayController::class, 'index']);
        Route::put('/payment-gateways/{gateway}', [\App\Http\Controllers\Api\PaymentGatewayController::class, 'update']);
        
        Route::post('/pages', [PageController::class, 'store']);
        Route::put('/pages/{page}', [PageController::class, 'update']);
        
        Route::post('/faqs', [PageController::class, 'storeFaq']);
        Route::put('/faqs/{faq}', [PageController::class, 'updateFaq']);
        Route::delete('/faqs/{faq}', [PageController::class, 'destroyFaq']);

        Route::post('/homepage/sections', [HomepageController::class, 'store']);
        Route::put('/homepage/sections/{section}', [HomepageController::class, 'update']);
        Route::delete('/homepage/sections/{section}', [HomepageController::class, 'destroy']);
        
        // Orders (Admin)
        Route::apiResource('orders', OrderController::class)->except(['store']);
        
        // Import / Export
        Route::get('/products/export', [ProductController::class, 'export']);
        Route::post('/products/import', [ProductController::class, 'import']);
        
        // Management CRUD
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);
        Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
        Route::apiResource('brands', BrandController::class)->except(['index', 'show']);
        Route::apiResource('curations', CurationController::class)->except(['index', 'show']);
        Route::apiResource('navigations', NavigationController::class)->except(['index']);
        Route::apiResource('users', UserController::class);
        Route::apiResource('pages', PageController::class)->except(['show']);

        // Admin review moderation
        Route::get('/admin/reviews', [ProductReviewController::class, 'adminIndex']);
        Route::put('/admin/reviews/{review}', [ProductReviewController::class, 'update']);
        Route::delete('/admin/reviews/{review}', [ProductReviewController::class, 'destroy']);
        
        // CMS Updates
        Route::post('/settings', [SettingController::class, 'update']);
        Route::post('/settings/test-smtp', [SettingController::class, 'testSmtp']);
        Route::post('/layout/navigation', [LayoutController::class, 'updateNavigation']);
        Route::post('/layout/footer', [LayoutController::class, 'updateFooter']);
        Route::post('/homepage', [HomepageController::class, 'update']);
        Route::post('/faqs', [PageController::class, 'updateFaqs']);
        
        // Newsletter Admin
        Route::get('/admin/newsletter-subscribers', [NewsletterSubscriptionController::class, 'index']);
        Route::delete('/admin/newsletter-subscribers/{subscription}', [NewsletterSubscriptionController::class, 'destroy']);

        // Support Tickets (Admin)
        Route::put('/tickets/{ticket}/status', [TicketController::class, 'updateStatus']);
    });
});
