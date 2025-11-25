<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Notifications\ReminderNotification;

class TestReminderNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:reminder-notification {user_id?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test reminder notification (email + push + database)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->argument('user_id') ?? 1;
        
        $user = User::find($userId);
        
        if (!$user) {
            $this->error("User with ID {$userId} not found!");
            return 1;
        }

        $this->info("Sending test notification to: {$user->name} ({$user->email})");
        
        try {
            $user->notify(new ReminderNotification(
                'set',
                'Sample Opportunity - AI Startup Grant',
                now()->addDays(7)->format('Y-m-d H:i:s'),
                999,
                999,
                'sample-opportunity'
            ));
            
            $this->info("✓ Notification queued successfully!");
            $this->info("✓ Email will be sent to: {$user->email}");
            $this->info("✓ Database notification created");
            $this->info("✓ Push notification queued (if configured)");
            $this->newLine();
            $this->warn("Make sure queue worker is running:");
            $this->line("  php artisan queue:work");
            
            return 0;
        } catch (\Exception $e) {
            $this->error("Failed to send notification: " . $e->getMessage());
            return 1;
        }
    }
}
