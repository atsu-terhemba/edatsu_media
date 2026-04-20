<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification
{
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome to Edatsu Media!')
            ->view('emails.welcome', [
                'user' => $notifiable,
                'dashboardUrl' => url('/dashboard'),
                'appUrl' => config('app.url'),
            ]);
    }
}
