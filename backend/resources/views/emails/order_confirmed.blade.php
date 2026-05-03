<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1a1a1a; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e5e5e5; border-radius: 12px; }
        .logo { font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px; }
        .highlight { color: #A67C52; }
        .order-meta { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { margin-top: 40px; font-size: 12px; color: #666; border-top: 1px solid #eee; pt: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">UR<span class="highlight">AIR</span></div>
        <h2>Order Confirmed!</h2>
        <p>Hi {{ $order->user->name }},</p>
        <p>Thank you for your order. We've received your request and are currently processing it.</p>
        
        <div class="order-meta">
            <p><strong>Order ID:</strong> #{{ $order->id }}</p>
            <p><strong>Total Amount:</strong> ${{ number_format($order->total_price, 2) }}</p>
            <p><strong>Shipping Address:</strong> {{ $order->shipping_address }}</p>
        </div>

        <p>We'll notify you as soon as your items are packed and on their way.</p>
        <a href="{{ config('app.url') }}/account" style="display: inline-block; padding: 12px 24px; background-color: #1a1a1a; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">Track Your Order</a>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} URAIR. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
