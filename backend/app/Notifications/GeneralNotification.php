<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class GeneralNotification extends Notification
{
    use Queueable;

    protected $title;
    protected $message;
    protected $type;
    protected $action_url;

    public function __construct($title, $message, $type = 'info', $action_url = null)
    {
        $this->title = $title;
        $this->message = $message;
        $this->type = $type;
        $this->action_url = $action_url;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'title' => $this->title,
            'message' => $this->message,
            'type' => $this->type,
            'action_url' => $this->action_url,
        ];
    }
}
