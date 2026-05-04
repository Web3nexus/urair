<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserRegistered;
use App\Notifications\GeneralNotification;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    protected function verifyTurnstile(Request $request)
    {
        $secretKey = Setting::where('key', 'turnstile_secret_key')->value('value');
        
        if ($secretKey) {
            $token = $request->input('cf_turnstile_response');
            if (!$token) {
                throw ValidationException::withMessages(['turnstile' => 'Security check token is missing.']);
            }

            $response = Http::asForm()->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                'secret' => $secretKey,
                'response' => $token,
                'remoteip' => $request->ip()
            ]);

            if (!$response->json('success')) {
                throw ValidationException::withMessages(['turnstile' => 'Security check failed. Please try again.']);
            }
        }
    }

    public function register(Request $request)
    {
        $this->verifyTurnstile($request);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'string', 'confirmed', Password::min(8)->letters()->numbers()->symbols()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        try {
            $user->sendEmailVerificationNotification();
        } catch (\Exception $e) {
            \Log::error('Failed to send verification email: ' . $e->getMessage());
        }

        // Notify admin
        $admins = User::where('role', 'admin')->orWhere('email', 'admin@urair.com')->get();
        foreach ($admins as $admin) {
            $admin->notify(new GeneralNotification(
                'New Account Registration',
                "A new user {$user->name} ({$user->email}) has registered.",
                'registration',
                "/admin/users"
            ));
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function login(Request $request)
    {
        $this->verifyTurnstile($request);

        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Invalid login details'],
            ]);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        
        // Prevent admins from logging in via regular user portal if you want strict separation
        if ($user->role === 'admin') {
             // Optional: throw error or just allow it. The user asked for "different logic"
        }

        if ($user->two_factor_enabled) {
            return response()->json([
                '2fa_required' => true,
                'user_id' => $user->id,
                'message' => 'Two-factor authentication required.'
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function adminLogin(Request $request)
    {
        $this->verifyTurnstile($request);

        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Invalid administrative credentials'],
            ]);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        if ($user->role !== 'admin' && $user->email !== 'admin@urair.com') {
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => ['Access denied. This portal is restricted to authorized personnel.'],
            ]);
        }

        if ($user->two_factor_enabled) {
            return response()->json([
                '2fa_required' => true,
                'user_id' => $user->id,
                'message' => 'Two-factor authentication required.'
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed',
            'avatar' => 'nullable|string' // base64 or URL
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function verifyEmail(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Invalid verification link.'], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.']);
        }

        if ($user->markEmailAsVerified()) {
            event(new \Illuminate\Auth\Events\Verified($user));
        }

        return response()->json(['message' => 'Email verified successfully.']);
    }

    public function resendVerification(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification link sent.']);
    }
}
