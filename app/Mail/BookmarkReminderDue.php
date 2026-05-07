<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Sent by ProcessBookmarkReminders when a user's bookmark reminder is due.
 * Companion to the in-app + (Pro-gated) push notification.
 */
class BookmarkReminderDue extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $itemTitle,
        public string $itemType,
        public string $actionUrl
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Reminder: {$this->itemTitle}"
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.bookmark-reminder',
            with: [
                'user' => $this->user,
                'itemTitle' => $this->itemTitle,
                'itemType' => $this->itemType,
                'actionUrl' => url($this->actionUrl),
                'appUrl' => config('app.url'),
            ],
        );
    }
}
