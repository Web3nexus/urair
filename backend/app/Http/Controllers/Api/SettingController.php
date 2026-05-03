<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        return response()->json(Setting::all()->pluck('value', 'key'));
    }

    public function update(Request $request)
    {
        $settings = $request->all();
        
        foreach ($settings as $key => $value) {
            $val = is_array($value) ? json_encode($value) : $value;
            
            // Sanitize email bodies specifically if they contain HTML
            if (str_contains($key, '_body')) {
                $val = clean($val);
            }

            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $val]
            );
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function testSmtp(Request $request)
    {
        $validated = $request->validate([
            'smtp_host' => 'required',
            'smtp_port' => 'required',
            'smtp_username' => 'required',
            'smtp_password' => 'required',
            'smtp_encryption' => 'required',
            'mail_from_address' => 'required|email',
            'mail_from_name' => 'required',
        ]);

        try {
            config([
                'mail.mailers.smtp.host' => $validated['smtp_host'],
                'mail.mailers.smtp.port' => $validated['smtp_port'],
                'mail.mailers.smtp.username' => $validated['smtp_username'],
                'mail.mailers.smtp.password' => $validated['smtp_password'],
                'mail.mailers.smtp.encryption' => $validated['smtp_encryption'] === 'none' ? null : $validated['smtp_encryption'],
                'mail.from.address' => $validated['mail_from_address'],
                'mail.from.name' => $validated['mail_from_name'],
            ]);

            \Illuminate\Support\Facades\Mail::raw('This is a test email from URAIR Admin.', function ($message) use ($validated) {
                $message->to($validated['mail_from_address'])
                        ->subject('SMTP Connection Test');
            });

            return response()->json(['message' => 'SMTP Test email sent successfully! Check your inbox.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'SMTP Error: ' . $e->getMessage()], 422);
        }
    }
}
