<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Bookmark;
use App\Models\Notification;
use Carbon\Carbon;

class ProcessBookmarkReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookmarks:process-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process due bookmark reminders and send notifications';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Processing bookmark reminders...');

        // Get all bookmarks with due reminders
        $dueReminders = Bookmark::with(['opportunity', 'event', 'product'])
            ->pendingReminders()
            ->get();

        $processedCount = 0;

        foreach ($dueReminders as $bookmark) {
            try {
                // Determine the type and title of the bookmarked item
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
                    // Create notification
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

                    // Mark reminder as sent
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
