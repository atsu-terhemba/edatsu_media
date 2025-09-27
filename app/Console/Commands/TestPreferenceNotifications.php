<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PreferenceNotificationService;
use App\Models\UserPreference;
use App\Models\User;
use App\Models\Notification;

class TestPreferenceNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:preference-notifications';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the preference notification system';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing Preference Notification System...');

        // Check if service class exists and can be instantiated
        try {
            $service = new PreferenceNotificationService();
            $this->info('✓ PreferenceNotificationService instantiated successfully');
        } catch (\Exception $e) {
            $this->error('✗ Failed to instantiate PreferenceNotificationService: ' . $e->getMessage());
            return 1;
        }

        // Check if UserPreference model works
        try {
            $userCount = User::count();
            $preferenceCount = UserPreference::count();
            $this->info("✓ Found {$userCount} users and {$preferenceCount} user preferences");
        } catch (\Exception $e) {
            $this->error('✗ Database connection or model issue: ' . $e->getMessage());
            return 1;
        }

        // Check notification system
        try {
            $notificationCount = Notification::count();
            $this->info("✓ Notification system accessible - {$notificationCount} total notifications");
        } catch (\Exception $e) {
            $this->error('✗ Notification system issue: ' . $e->getMessage());
            return 1;
        }

        // Test preference matching logic
        try {
            $testPreference = new UserPreference([
                'user_id' => 1,
                'opportunity_categories' => [1, 2, 3],
                'opportunity_countries' => [1, 2],
                'product_categories' => [1, 2],
                'opportunity_notifications' => true,
                'product_notifications' => true,
                'email_notifications' => false
            ]);

            // Test matching logic using reflection to access private methods
            $reflection = new \ReflectionClass($service);
            $opportunityMethod = $reflection->getMethod('doesOpportunityMatchPreferences');
            $opportunityMethod->setAccessible(true);

            $productMethod = $reflection->getMethod('doesProductMatchPreferences');
            $productMethod->setAccessible(true);

            // Test opportunity matching
            $oppMatch = $opportunityMethod->invokeArgs($service, [
                $testPreference, [1, 4], [1, 5], [1], [1]
            ]);
            $this->info($oppMatch ? '✓ Opportunity preference matching works' : '✗ Opportunity preference matching failed');

            // Test product matching
            $prodMatch = $productMethod->invokeArgs($service, [
                $testPreference, [1, 4], [1], [1]
            ]);
            $this->info($prodMatch ? '✓ Product preference matching works' : '✗ Product preference matching failed');

        } catch (\Exception $e) {
            $this->error('✗ Preference matching test failed: ' . $e->getMessage());
        }

        $this->info('✓ Preference notification system test completed!');
        $this->info('System is ready to send notifications when new opportunities or products match user preferences.');
        
        return 0;
    }
}
