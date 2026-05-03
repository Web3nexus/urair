<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1a1a1a; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e5e5e5; border-radius: 12px; }
        .logo { font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px; }
        .highlight { color: #A67C52; }
        .status-badge { display: inline-block; padding: 6px 12px; background: #1a1a1a; color: white; border-radius: 20px; text-transform: uppercase; font-size: 10px; font-weight: 900; letter-spacing: 1px; }
        .rider-info { background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0066cc; }
        .footer { margin-top: 40px; font-size: 12px; color: #666; border-top: 1px solid #eee; pt: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">UR<span class="highlight">AIR</span></div>
        <h2>Order Status Update</h2>
        <p>Hi {{ $order->user->name }},</p>
        <p>The status of your order <strong>#{{ $order->id }}</strong> has been updated to:</p>
        
        <div style="margin: 20px 0;">
            <span class="status-badge">{{ str_replace('_', ' ', $order->status) }}</span>
        </div>

        @if($order->status === 'sent_for_delivery' && $order->rider)
            <div class="rider-info">
                <p><strong>Rider Assigned:</strong> {{ $order->rider->name }}</p>
                <p><strong>Contact Number:</strong> {{ $order->rider_phone ?? 'Available in tracking dashboard' }}</p>
                <p>Our rider is on their way with your package!</p>
            </div>
        @endif

        <p>You can track the full progress of your delivery on your dashboard.</p>
        <a href="{{ config('app.url') }}/account" style="display: inline-block; padding: 12px 24px; background-color: #1a1a1a; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">View Tracking Details</a>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} URAIR. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
