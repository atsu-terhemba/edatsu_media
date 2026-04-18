<?php

namespace App\Notifications;

use App\Models\ForumThread;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ForumInviteNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected ForumThread $thread,
        protected array $matchedCategoryNames = []
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $threadUrl = url('/forum/' . $this->thread->id);
        $starterName = $this->thread->user?->name ?? 'A member';
        $preview = mb_strimwidth(strip_tags((string) $this->thread->body), 0, 220, '…');

        return (new MailMessage)
            ->subject('A discussion for you: ' . mb_strimwidth($this->thread->title, 0, 80, '…'))
            ->view('emails.forum-invite', [
                'user' => $notifiable,
                'thread' => $this->thread,
                'threadUrl' => $threadUrl,
                'starterName' => $starterName,
                'preview' => $preview,
                'matchedCategories' => $this->matchedCategoryNames,
                'appUrl' => config('app.url'),
            ]);
    }
}
