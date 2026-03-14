<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use App\Models\AdSetting;
use App\Models\AdGlobalSetting;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        Vite::prefetch(concurrency: 3);
        
        // Share ad settings with all Inertia views
        Inertia::share([
            'adSettings' => function () {
                try {
                    $globalSettings = AdGlobalSetting::getSetting();
                    
                    if (!$globalSettings->ads_enabled) {
                        return [
                            'enabled' => false,
                            'show_placeholders' => $globalSettings->show_placeholders,
                            'slots' => []
                        ];
                    }
                    
                    $ads = AdSetting::active()->get()->keyBy('slot_name');
                    $slotsArray = [];
                    
                    $r2PublicUrl = rtrim(env('VITE_R2_PUBLIC_URL', ''), '/');

                    foreach ($ads as $ad) {
                        // Build full image URL
                        $imageUrl = $ad->image_url;
                        if ($imageUrl && !str_starts_with($imageUrl, 'http://') && !str_starts_with($imageUrl, 'https://')) {
                            // Relative path - prepend R2 public URL or local storage URL
                            $imageUrl = ltrim($imageUrl, '/');
                            $imageUrl = preg_replace('#^storage/#', '', $imageUrl);
                            if ($r2PublicUrl) {
                                $imageUrl = $r2PublicUrl . '/' . $imageUrl;
                            } else {
                                $imageUrl = '/storage/' . $imageUrl;
                            }
                        }

                        $slotsArray[$ad->slot_name] = [
                            'ad_code' => $ad->ad_code,
                            'ad_type' => $ad->ad_type ?? 'adsense',
                            'image_url' => $imageUrl,
                            'link_url' => $ad->link_url,
                            'link_target' => $ad->link_target ?? '_blank',
                            'is_visible' => $ad->is_visible,
                            'size' => $ad->size,
                            'page' => $ad->page,
                            'position' => $ad->position
                        ];
                    }
                    
                    return [
                        'enabled' => true,
                        'show_placeholders' => $globalSettings->show_placeholders,
                        'slots' => $slotsArray,
                        'publisher_id' => $globalSettings->adsense_publisher_id
                    ];
                } catch (\Exception $e) {
                    return [
                        'enabled' => false,
                        'show_placeholders' => true,
                        'slots' => []
                    ];
                }
            }
        ]);
    }
}

