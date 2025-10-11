<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdSetting;
use App\Models\AdGlobalSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdManagementController extends Controller
{
    public function index()
    {
        $globalSettings = AdGlobalSetting::getSetting();
        $adSettings = AdSetting::orderBy('page')->orderBy('order')->get();

        return Inertia::render('Admin/AdManagement', [
            'globalSettings' => $globalSettings,
            'adSettings' => $adSettings,
        ]);
    }

    public function toggleAds(Request $request)
    {
        $globalSettings = AdGlobalSetting::getSetting();
        $globalSettings->ads_enabled = $request->input('ads_enabled');
        $globalSettings->save();

        return back()->with('success', $request->input('ads_enabled') 
            ? 'Ads have been enabled across the site' 
            : 'Ads have been disabled across the site');
    }

    public function togglePlaceholders()
    {
        $globalSettings = AdGlobalSetting::getSetting();
        $globalSettings->show_placeholders = !$globalSettings->show_placeholders;
        $globalSettings->save();

        return back()->with('success', $globalSettings->show_placeholders 
            ? 'Ad placeholders are now shown' 
            : 'Ad placeholders are now hidden');
    }

    public function updateGlobalSettings(Request $request)
    {
        $validated = $request->validate([
            'ads_enabled' => 'required|boolean',
            'adsense_publisher_id' => 'nullable|string|max:255'
        ]);

        $globalSettings = AdGlobalSetting::getSetting();
        $globalSettings->update($validated);

        return back()->with('success', 'Global ad settings updated successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'slot_name' => 'required|string|unique:ad_settings|max:255',
            'page' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'size' => 'required|string|max:255',
            'ad_code' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'integer'
        ]);

        AdSetting::create($validated);

        return back()->with('success', 'Ad slot created successfully');
    }

    public function update(Request $request, AdSetting $adSetting)
    {
        $validated = $request->validate([
            'slot_name' => 'required|string|max:255|unique:ad_settings,slot_name,' . $adSetting->id,
            'page' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'size' => 'required|string|max:255',
            'ad_code' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'integer'
        ]);

        $adSetting->update($validated);

        return back()->with('success', 'Ad slot updated successfully');
    }

    public function destroy(AdSetting $adSetting)
    {
        $adSetting->delete();

        return back()->with('success', 'Ad slot deleted successfully');
    }

    public function toggleActive(AdSetting $adSetting)
    {
        $adSetting->is_active = !$adSetting->is_active;
        $adSetting->save();

        return back()->with('success', 'Ad slot ' . ($adSetting->is_active ? 'activated' : 'deactivated'));
    }

    public function toggleVisibility(AdSetting $adSetting)
    {
        $adSetting->is_visible = !$adSetting->is_visible;
        $adSetting->save();

        return back()->with('success', 'Ad placeholder ' . ($adSetting->is_visible ? 'shown' : 'hidden'));
    }
}

