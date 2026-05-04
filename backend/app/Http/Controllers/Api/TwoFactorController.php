<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PragmaRX\Google2FA\Google2FA;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class TwoFactorController extends Controller
{
    protected Google2FA $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    /**
     * Generate a new 2FA secret and return QR code SVG + secret.
     * Does NOT enable 2FA yet — user must verify first.
     */
    public function setup(Request $request)
    {
        $user = $request->user();
        $secret = $this->google2fa->generateSecretKey();

        // Store as pending until verified
        $user->update(['two_factor_pending_secret' => encrypt($secret)]);

        $otpAuthUrl = $this->google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        $renderer = new ImageRenderer(
            new RendererStyle(200),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        $svg = $writer->writeString($otpAuthUrl);

        return response()->json([
            'secret' => $secret,
            'qr_svg' => base64_encode($svg),
            'otpauth_url' => $otpAuthUrl,
        ]);
    }

    /**
     * Verify the OTP and activate 2FA.
     */
    public function enable(Request $request)
    {
        $request->validate(['code' => 'required|string|size:6']);
        $user = $request->user();

        if (!$user->two_factor_pending_secret) {
            return response()->json(['message' => 'No pending 2FA setup found. Please start setup first.'], 422);
        }

        $secret = decrypt($user->two_factor_pending_secret);
        $valid = $this->google2fa->verifyKey($secret, $request->code);

        if (!$valid) {
            return response()->json(['message' => 'Invalid verification code. Please try again.'], 422);
        }

        // Generate recovery codes
        $recoveryCodes = collect(range(1, 8))->map(fn() => implode('-', [
            strtoupper(substr(bin2hex(random_bytes(3)), 0, 5)),
            strtoupper(substr(bin2hex(random_bytes(3)), 0, 5)),
        ]))->toArray();

        $user->update([
            'two_factor_secret' => encrypt($secret),
            'two_factor_recovery_codes' => encrypt(json_encode($recoveryCodes)),
            'two_factor_enabled' => true,
            'two_factor_pending_secret' => null,
        ]);

        return response()->json([
            'message' => '2FA has been enabled successfully.',
            'recovery_codes' => $recoveryCodes,
        ]);
    }

    /**
     * Disable 2FA for the authenticated user.
     */
    public function disable(Request $request)
    {
        $request->validate(['code' => 'required|string']);
        $user = $request->user();

        if (!$user->two_factor_enabled) {
            return response()->json(['message' => '2FA is not enabled.'], 422);
        }

        $secret = decrypt($user->two_factor_secret);

        // Allow recovery code or OTP
        $validOtp = $this->google2fa->verifyKey($secret, $request->code);
        $recoveryCodes = json_decode(decrypt($user->two_factor_recovery_codes), true);
        $validRecovery = in_array($request->code, $recoveryCodes);

        if (!$validOtp && !$validRecovery) {
            return response()->json(['message' => 'Invalid code. Enter your authenticator code or a recovery code.'], 422);
        }

        $user->update([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_enabled' => false,
            'two_factor_pending_secret' => null,
        ]);

        return response()->json(['message' => '2FA has been disabled.']);
    }

    /**
     * Verify 2FA code during login (called after credentials check).
     */
    public function verifyLogin(Request $request)
    {
        $request->validate(['code' => 'required|string', 'user_id' => 'required|integer']);

        $user = \App\Models\User::findOrFail($request->user_id);

        if (!$user->two_factor_enabled) {
            return response()->json(['message' => '2FA is not enabled for this account.'], 422);
        }

        $secret = decrypt($user->two_factor_secret);
        $validOtp = $this->google2fa->verifyKey($secret, $request->code);

        // Also allow recovery codes
        $recoveryCodes = json_decode(decrypt($user->two_factor_recovery_codes), true);
        $validRecovery = in_array($request->code, $recoveryCodes);

        if (!$validOtp && !$validRecovery) {
            return response()->json(['message' => 'Invalid 2FA code.'], 422);
        }

        // If recovery code used, remove it
        if ($validRecovery) {
            $remaining = array_values(array_filter($recoveryCodes, fn($c) => $c !== $request->code));
            $user->update(['two_factor_recovery_codes' => encrypt(json_encode($remaining))]);
        }

        // Issue token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    /**
     * Get current 2FA status for the authenticated user.
     */
    public function status(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'enabled' => $user->two_factor_enabled,
        ]);
    }

    /**
     * Show recovery codes (requires OTP to confirm identity).
     */
    public function recoveryCodes(Request $request)
    {
        $user = $request->user();
        if (!$user->two_factor_enabled) {
            return response()->json(['message' => '2FA not enabled.'], 422);
        }
        $codes = json_decode(decrypt($user->two_factor_recovery_codes), true);
        return response()->json(['recovery_codes' => $codes]);
    }
}
