<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Bookmark;
use App\Models\Notification;
use App\Services\WebPushService;
use Carbon\Carbon;

class ProcessBookmarkReminders extends Command
{
    protected $signature = 'bookmarks:process-reminders';
    protected $description = 'Process due bookmark reminders and send notifications';

    public function handle()
    {
        $this->info('Processing bookmark reminders...');

        $dueReminders = Bookmark::with(['opportunity', 'event', 'product'])
            ->pendingReminders()
            ->get();

        $processedCount = 0;

        foreach ($dueReminders as $bookmark) {
            try {
                $itemTitle = '';
                $itemType = '';
                $actionUrl = '';

                if ($bookmark->post_type === 'opp' && $bookmark->opportunity) {
                    $itemTitle = $bookmark->opportunity->title;
                    $itemType = 'opportunity';
                    $actionUrl = "/op/{$bookmark->opportunity->id}/{$bookmark->opportunity->slug}";
                } elseif ($bookmark->post_type === 'tool' && $bookmark->product) {
                    $itemTitle = $bookmark->product->product_name;
                    $itemType = 'tool';
                    $actionUrl = "/tools/{$bookmark->product->slug}";
                } elseif ($bookmark->event) {
                    $itemTitle = $bookmark->event->title;
                    $itemType = 'event';
                    $actionUrl = "/events/{$bookmark->event->slug}";
                }

                if ($itemTitle) {
                    // Create in-app notification
                    Notification::create([
                        'user_id' => $bookmark->user_id,
                        'title' => 'Bookmark Reminder',
                        'message' => "Don't forget about: {$itemTitle}",
                        'type' => 'info',
                        'action_url' => $actionUrl,
                        'data' => [
                            'bookmark_id' => $bookmark->id,
                            'item_type' => $itemType,
                            'reminder_type' => 'bookmark_reminder'
                        ]
                    ]);

                    // Send push notification
                    try {
                        $pushService = app(WebPushService::class);
                        $pushService->sendToUser($bookmark->user_id, [
                            'title' => 'Bookmark Reminder',
                            'body' => "Don't forget about: {$itemTitle}",
                            'icon' => '/img/logo.png',
                            'badge' => '/img/logo.png',
                            'url' => $actionUrl,
                            'tag' => 'reminder-' . $bookmark->id,
                        ]);
                    } catch (\Exception $e) {
                        $this->warn("Push notification failed for bookmark {$bookmark->id}: " . $e->getMessage());
                    }

                    $bookmark->markReminderSent();
                    $processedCount++;

                    $this->info("Sent reminder for: {$itemTitle}");
                }
            } catch (\Exception $e) {
                $this->error("Failed to process reminder for bookmark ID {$bookmark->id}: " . $e->getMessage());
            }
        }

        $this->info("Processed {$processedCount} bookmark reminders.");
        return 0;
    }
}
