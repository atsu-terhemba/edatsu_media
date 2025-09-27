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
     * Send notifications for a new opportunity to matching users
     */
    public function notifyOpportunityMatch($opportunity, $opportunityCategories, $opportunityCountries, $opportunityRegions, $opportunityBrands)
    {
        try {
            // Get users who have opportunity notifications enabled
            $usersWithPreferences = UserPreference::where('opportunity_notifications', true)
                ->with('user')
                ->get();

            foreach ($usersWithPreferences as $userPreference) {
                if ($this->doesOpportunityMatchPreferences($userPreference, $opportunityCategories, $opportunityCountries, $opportunityRegions, $opportunityBrands)) {
                    // Create in-app notification
                    $this->createNotification(
                        $userPreference->user_id,
                        'New Opportunity Match!',
                        "A new opportunity '{$opportunity->title}' matches your preferences!",
                        'info',
                        "/opportunities/{$opportunity->slug}",
                        [
                            'type' => 'opportunity_match',
                            'opportunity_id' => $opportunity->id,
                            'opportunity_title' => $opportunity->title
                        ]
                    );

                    // Send email if user opted for email notifications
                    if ($userPreference->email_notifications) {
                        $this->sendEmailNotification(
                            $userPreference->user,
                            'New Opportunity Match!',
                            "A new opportunity '{$opportunity->title}' matches your preferences!",
                            "/opportunities/{$opportunity->slug}"
                        );
                    }
                }
            }

            Log::info("Opportunity notifications sent for: {$opportunity->title}");
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
     * Check if opportunity matches user preferences
     */
    private function doesOpportunityMatchPreferences($userPreference, $categories, $countries, $regions, $brands)
    {
        // Check if any of the opportunity's attributes match user preferences
        $matchesCategory = empty($userPreference->opportunity_categories) || 
                          !empty(array_intersect($userPreference->opportunity_categories, $categories));
        
        $matchesCountry = empty($userPreference->opportunity_countries) || 
                         !empty(array_intersect($userPreference->opportunity_countries, $countries));
        
        $matchesRegion = empty($userPreference->opportunity_regions) || 
                        !empty(array_intersect($userPreference->opportunity_regions, $regions));
        
        $matchesBrand = empty($userPreference->opportunity_brands) || 
                       !empty(array_intersect($userPreference->opportunity_brands, $brands));

        // Return true if at least one preference matches
        return $matchesCategory || $matchesCountry || $matchesRegion || $matchesBrand;
    }

    /**
     * Check if product matches user preferences
     */
    private function doesProductMatchPreferences($userPreference, $categories, $brands, $tags)
    {
        // Check if any of the product's attributes match user preferences
        $matchesCategory = empty($userPreference->product_categories) || 
                          !empty(array_intersect($userPreference->product_categories, $categories));
        
        $matchesBrand = empty($userPreference->product_brands) || 
                       !empty(array_intersect($userPreference->product_brands, $brands));
        
        $matchesTags = empty($userPreference->product_tags) || 
                      !empty(array_intersect($userPreference->product_tags, $tags));

        // Return true if at least one preference matches
        return $matchesCategory || $matchesBrand || $matchesTags;
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
