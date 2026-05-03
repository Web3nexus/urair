<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1a1a1a; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e5e5e5; border-radius: 12px; }
        .logo { font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px; }
        .highlight { color: #A67C52; }
        .footer { margin-top: 40px; font-size: 12px; color: #666; border-top: 1px solid #eee; pt: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">UR<span class="highlight">AIR</span></div>
        <h2>Welcome, {{ $user->name }}!</h2>
        <p>Thank you for joining URAIR. Your account has been successfully created.</p>
        <p>You can now explore our curated collections of premium tech gear and luxury lifestyle products.</p>
        <a href="{{ config('app.url') }}/login" style="display: inline-block; padding: 12px 24px; background-color: #1a1a1a; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">Sign In to Your Account</a>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} URAIR. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
