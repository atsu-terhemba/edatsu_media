<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Mail\BookmarkReminderDue;
use App\Models\Bookmark;
use App\Models\Notification;
use App\Models\User;
use App\Services\FeatureGate;
use App\Services\WebPushService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

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

                    $user = User::find($bookmark->user_id);

                    // Email reminder — sent to all users (free + pro) alongside
                    // the in-app notification. Queued so a bad SMTP day doesn't
                    // block the rest of the reminders in the loop.
                    if ($user && $user->email) {
                        try {
                            Mail::to($user->email, $user->name)->queue(
                                new BookmarkReminderDue($user, $itemTitle, $itemType, $actionUrl)
                            );
                        } catch (\Exception $e) {
                            $this->warn("Email notification failed for bookmark {$bookmark->id}: " . $e->getMessage());
                        }
                    }

                    // Bookmark-reminder push is Pro-gated (web_push_pro_only).
                    // Forum push is wired separately and stays free. In-app
                    // notification above still fires for Free users so they
                    // see the reminder inside the app — they just don't get
                    // a push to the device.
                    if (FeatureGate::proOnly($user, 'web_push')) {
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
