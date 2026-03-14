<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdSetting;
use App\Models\AdGlobalSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'ad_type' => 'required|string|in:adsense,custom',
            'ad_code' => 'nullable|string',
            'image_url' => 'nullable|string|max:2048',
            'image_file' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:5120',
            'link_url' => 'nullable|string|max:2048',
            'link_target' => 'nullable|string|in:_blank,_self',
            'is_active' => 'boolean',
            'order' => 'integer'
        ]);

        // Handle image file upload
        if ($request->hasFile('image_file')) {
            $validated['image_url'] = $this->uploadAdImage($request->file('image_file'));
        }
        unset($validated['image_file']);

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
            'ad_type' => 'required|string|in:adsense,custom',
            'ad_code' => 'nullable|string',
            'image_url' => 'nullable|string|max:2048',
            'image_file' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:5120',
            'link_url' => 'nullable|string|max:2048',
            'link_target' => 'nullable|string|in:_blank,_self',
            'is_active' => 'boolean',
            'order' => 'integer'
        ]);

        // Handle image file upload
        if ($request->hasFile('image_file')) {
            // Delete old uploaded image if it exists
            if ($adSetting->image_url && str_starts_with($adSetting->image_url, '/storage/uploads/ads/')) {
                $oldPath = str_replace('/storage/', '', $adSetting->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $validated['image_url'] = $this->uploadAdImage($request->file('image_file'));
        }
        unset($validated['image_file']);

        $adSetting->update($validated);

        return back()->with('success', 'Ad slot updated successfully');
    }

    private function uploadAdImage($file)
    {
        $filename = uniqid('ad_') . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('uploads/ads', $filename, 'public');
        return '/storage/' . $path;
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

