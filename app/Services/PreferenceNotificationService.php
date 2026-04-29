<?php

namespace App\Services;

use App\Models\UserPreference;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class PreferenceNotificationService
{
    /**
     * Send notifications for a new or updated opportunity to matching users.
     * $isUpdate = true rephrases the notification so subscribers don't think
     * an old opportunity is being re-announced as new.
     */
    public function notifyOpportunityMatch($opportunity, $opportunityCategories, $opportunityCountries, $opportunityRegions, $opportunityBrands, $isUpdate = false)
    {
        try {
            $title   = $isUpdate ? 'Opportunity Updated' : 'New Opportunity Match!';
            $message = $isUpdate
                ? "An opportunity you may be interested in was updated: '{$opportunity->title}'."
                : "A new opportunity '{$opportunity->title}' matches your preferences!";
            $type = $isUpdate ? 'opportunity_update' : 'opportunity_match';

            // Get users who have opportunity notifications enabled
            $usersWithPreferences = UserPreference::where('opportunity_notifications', true)
                ->with('user')
                ->get();

            foreach ($usersWithPreferences as $userPreference) {
                if ($this->doesOpportunityMatchPreferences($userPreference, $opportunityCategories, $opportunityCountries, $opportunityRegions, $opportunityBrands)) {
                    // Create in-app notification
                    $this->createNotification(
                        $userPreference->user_id,
                        $title,
                        $message,
                        'info',
                        "/op/{$opportunity->id}/{$opportunity->slug}",
                        [
                            'type' => $type,
                            'opportunity_id' => $opportunity->id,
                            'opportunity_title' => $opportunity->title
                        ]
                    );

                    // Send email if user opted for email notifications
                    if ($userPreference->email_notifications) {
                        $this->sendEmailNotification(
                            $userPreference->user,
                            $title,
                            $message,
                            "/op/{$opportunity->id}/{$opportunity->slug}"
                        );
                    }
                }
            }

            Log::info("Opportunity " . ($isUpdate ? 'update' : 'match') . " notifications sent for: {$opportunity->title}");
        } catch (\Exception $e) {
            Log::error("Error sending opportunity notifications: " . $e->getMessage());
        }
    }

    /**
     * Send notifications for a new product to matching users
     */
    public function notifyProductMatch($product, $productCategories, $productBrands, $productTags)
    {
        try {
            // Get users who have product notifications enabled
            $usersWithPreferences = UserPreference::where('product_notifications', true)
                ->with('user')
                ->get();

            foreach ($usersWithPreferences as $userPreference) {
                if ($this->doesProductMatchPreferences($userPreference, $productCategories, $productBrands, $productTags)) {
                    // Create in-app notification
                    $this->createNotification(
                        $userPreference->user_id,
                        'New Tool Match!',
                        "A new tool '{$product->product_name}' matches your preferences!",
                        'info',
                        "/tools/{$product->slug}",
                        [
                            'type' => 'product_match',
                            'product_id' => $product->id,
                            'product_name' => $product->product_name
                        ]
                    );

                    // Send email if user opted for email notifications
                    if ($userPreference->email_notifications) {
                        $this->sendEmailNotification(
                            $userPreference->user,
                            'New Tool Match!',
                            "A new tool '{$product->product_name}' matches your preferences!",
                            "/tools/{$product->slug}"
                        );
                    }
                }
            }

            Log::info("Product notifications sent for: {$product->product_name}");
        } catch (\Exception $e) {
            Log::error("Error sending product notifications: " . $e->getMessage());
        }
    }

    /**
     * Check if opportunity matches user preferences.
     * Uses AND logic: ALL set preferences must match.
     * If user has no preferences set at all, returns false (no spam).
     */
    private function doesOpportunityMatchPreferences($userPreference, $categories, $countries, $regions, $brands)
    {
        $hasCats = !empty($userPreference->opportunity_categories);
        $hasCountries = !empty($userPreference->opportunity_countries);
        $hasRegions = !empty($userPreference->opportunity_regions);
        $hasBrands = !empty($userPreference->opportunity_brands);

        // If user hasn't set any preferences, don't notify
        if (!$hasCats && !$hasCountries && !$hasRegions && !$hasBrands) {
            return false;
        }

        // Every set preference must match (AND logic); unset ones are ignored
        if ($hasCats && empty(array_intersect($userPreference->opportunity_categories, $categories))) {
            return false;
        }
        if ($hasCountries && empty(array_intersect($userPreference->opportunity_countries, $countries))) {
            return false;
        }
        if ($hasRegions && empty(array_intersect($userPreference->opportunity_regions, $regions))) {
            return false;
        }
        if ($hasBrands && empty(array_intersect($userPreference->opportunity_brands, $brands))) {
            return false;
        }

        return true;
    }

    /**
     * Check if product matches user preferences.
     * Uses AND logic: ALL set preferences must match.
     * If user has no preferences set at all, returns false (no spam).
     */
    private function doesProductMatchPreferences($userPreference, $categories, $brands, $tags)
    {
        $hasCats = !empty($userPreference->product_categories);
        $hasBrands = !empty($userPreference->product_brands);
        $hasTags = !empty($userPreference->product_tags);

        // If user hasn't set any preferences, don't notify
        if (!$hasCats && !$hasBrands && !$hasTags) {
            return false;
        }

        // Every set preference must match (AND logic); unset ones are ignored
        if ($hasCats && empty(array_intersect($userPreference->product_categories, $categories))) {
            return false;
        }
        if ($hasBrands && empty(array_intersect($userPreference->product_brands, $brands))) {
            return false;
        }
        if ($hasTags && empty(array_intersect($userPreference->product_tags, $tags))) {
            return false;
        }

        return true;
    }

    /**
     * Create in-app notification
     */
    private function createNotification($userId, $title, $message, $type, $actionUrl, $data = [])
    {
        Notification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'action_url' => $actionUrl,
            'data' => $data
        ]);
    }

    /**
     * Send email notification
     */
    private function sendEmailNotification($user, $title, $message, $actionUrl)
    {
        try {
            // Create a simple email notification
            Mail::send('emails.preference-notification', [
                'user' => $user,
                'title' => $title,
                'message' => $message,
                'actionUrl' => url($actionUrl),
                'appUrl' => url('/')
            ], function ($mail) use ($user, $title) {
                $mail->to($user->email, $user->name)
                     ->subject($title);
            });
        } catch (\Exception $e) {
            Log::error("Error sending email notification to {$user->email}: " . $e->getMessage());
        }
    }

    /**
     * Extract IDs from relational data arrays
     */
    public function extractIds($relationshipData, $table, $columnName, $postId)
    {
        return DB::table($table)
            ->where('post_id', $postId)
            ->pluck($columnName)
            ->toArray();
    }
}
