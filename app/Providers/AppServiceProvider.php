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
                    
                    foreach ($ads as $ad) {
                        $slotsArray[$ad->slot_name] = [
                            'ad_code' => $ad->ad_code,
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

