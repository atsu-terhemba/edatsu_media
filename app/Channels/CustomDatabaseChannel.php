<?php

namespace App\Channels;

use Illuminate\Notifications\Notification;

class CustomDatabaseChannel
{
    /**
     * Send the given notification.
     */
    public function send($notifiable, Notification $notification)
    {
        $data = $notification->toArray($notifiable);

        return $notifiable->routeNotificationFor('database', $notification)->create([
            'user_id' => $notifiable->id,
            'type' => $data['type'] ?? 'info',
            'title' => $data['title'] ?? '',
            'message' => $data['message'] ?? '',
            'action_url' => $data['action_url'] ?? null,
            'data' => $data['data'] ?? null,
            'is_read' => false,
            'read_at' => null,
        ]);
    }
}
