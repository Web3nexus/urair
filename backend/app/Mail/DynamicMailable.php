<?php

namespace App\Mail;

use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DynamicMailable extends Mailable
{
    use Queueable, SerializesModels;

    public $body;
    public $subject;
    public $button_url;
    public $button_text;

    /**
     * Create a new message instance.
     */
    public function __construct($key, $data = [], $button = [])
    {
        $subjectTemplate = Setting::where('key', "email_{$key}_subject")->value('value') ?? 'Notification';
        $bodyTemplate = Setting::where('key', "email_{$key}_body")->value('value') ?? '';

        // Simple variable replacement {{var}}
        foreach ($data as $k => $v) {
            $subjectTemplate = str_replace("{{{$k}}}", $v, $subjectTemplate);
            $bodyTemplate = str_replace("{{{$k}}}", $v, $bodyTemplate);
        }

        $this->subject = $subjectTemplate;
        $this->body = $bodyTemplate;
        
        if (!empty($button)) {
            $this->button_url = $button['url'] ?? null;
            $this->button_text = $button['text'] ?? null;
        }
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.dynamic',
            with: [
                'body' => $this->body,
                'button_url' => $this->button_url,
                'button_text' => $this->button_text,
            ],
        );
    }
}
