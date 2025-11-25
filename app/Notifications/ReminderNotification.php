<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Carbon\Carbon;
use App\Channels\CustomDatabaseChannel;

class ReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $reminderType;
    protected $opportunityTitle;
    protected $reminderDate;
    protected $bookmarkId;
    protected $opportunityId;
    protected $opportunitySlug;

    /**
     * Create a new notification instance.
     */
    public function __construct($reminderType, $opportunityTitle, $reminderDate, $bookmarkId, $opportunityId, $opportunitySlug = null)
    {
        $this->reminderType = $reminderType; // 'set' or 'updated'
        $this->opportunityTitle = $opportunityTitle;
        $this->reminderDate = $reminderDate;
        $this->bookmarkId = $bookmarkId;
        $this->opportunityId = $opportunityId;
        $this->opportunitySlug = $opportunitySlug;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable)
    {
        // Send via mail, custom database, and broadcast (for push notifications)
        return ['mail', CustomDatabaseChannel::class, 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $formattedDate = Carbon::parse($this->reminderDate)->format('M d, Y \a\t h:i A');
        $actionText = $this->reminderType === 'set' ? 'set' : 'updated';
        $actionUrl = url("/op/{$this->opportunityId}/" . ($this->opportunitySlug ?? ''));

        return (new MailMessage)
            ->subject("Reminder {$actionText} for: {$this->opportunityTitle}")
            ->greeting("Hello {$notifiable->name}!")
            ->line("Your reminder has been {$actionText} for the opportunity: **{$this->opportunityTitle}**")
            ->line("You will be reminded on: **{$formattedDate}**")
            ->action('View Opportunity', $actionUrl)
            ->line('Thank you for using Edatsu!');
    }

    /**
     * Get the array representation of the notification for database.
     */
    public function toArray($notifiable)
    {
        $formattedDate = Carbon::parse($this->reminderDate)->format('M d, Y \a\t h:i A');
        $actionText = $this->reminderType === 'set' ? 'set' : 'updated';

        return [
            'type' => 'reminder_' . $this->reminderType,
            'title' => 'Reminder ' . ucfirst($actionText),
            'message' => "Reminder has been {$actionText} for \"{$this->opportunityTitle}\" " . 
                        ($this->reminderType === 'set' ? 'on' : 'to') . " {$formattedDate}",
            'action_url' => "/op/{$this->opportunityId}/" . ($this->opportunitySlug ?? ''),
            'data' => json_encode([
                'bookmark_id' => $this->bookmarkId,
                'opportunity_id' => $this->opportunityId,
                'reminder_date' => $this->reminderDate,
            ]),
            'is_read' => false,
        ];
    }

    /**
     * Get the broadcastable representation of the notification (for push).
     */
    public function toBroadcast($notifiable)
    {
        $formattedDate = Carbon::parse($this->reminderDate)->format('M d, Y \a\t h:i A');
        $actionText = $this->reminderType === 'set' ? 'set' : 'updated';

        return new BroadcastMessage([
            'type' => 'reminder_' . $this->reminderType,
            'title' => 'Reminder ' . ucfirst($actionText),
            'body' => "Reminder has been {$actionText} for \"{$this->opportunityTitle}\" " . 
                     ($this->reminderType === 'set' ? 'on' : 'to') . " {$formattedDate}",
            'icon' => '/img/notification-icon.png',
            'action_url' => "/op/{$this->opportunityId}/" . ($this->opportunitySlug ?? ''),
        ]);
    }
}
