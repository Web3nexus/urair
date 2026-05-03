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
        .btn { display: inline-block; padding: 12px 24px; background-color: #1a1a1a; color: white !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">UR<span class="highlight">AIR</span></div>
        
        {!! $body !!}

        @if(isset($button_url))
            <a href="{{ $button_url }}" class="btn">{{ $button_text ?? 'View More' }}</a>
        @endif
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} URAIR. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
