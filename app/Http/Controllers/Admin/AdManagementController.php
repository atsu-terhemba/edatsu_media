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

        // Build full image URLs for display
        $r2PublicUrl = rtrim(env('VITE_R2_PUBLIC_URL', ''), '/');
        $adSettings->transform(function ($ad) use ($r2PublicUrl) {
            if ($ad->image_url && !str_starts_with($ad->image_url, 'http://') && !str_starts_with($ad->image_url, 'https://')) {
                $path = ltrim($ad->image_url, '/');
                $path = preg_replace('#^storage/#', '', $path);
                $ad->image_url = $r2PublicUrl ? ($r2PublicUrl . '/' . $path) : ('/storage/' . $path);
            }
            return $ad;
        });

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
            'remove_image' => 'nullable',
            'link_url' => 'nullable|string|max:2048',
            'link_target' => 'nullable|string|in:_blank,_self',
            'is_active' => 'boolean',
            'order' => 'integer'
        ]);

        // Handle image file upload
        if ($request->hasFile('image_file')) {
            $validated['image_url'] = $this->uploadAdImage($request->file('image_file'));
        }
        unset($validated['image_file'], $validated['remove_image']);

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
            'remove_image' => 'nullable',
            'link_url' => 'nullable|string|max:2048',
            'link_target' => 'nullable|string|in:_blank,_self',
            'is_active' => 'boolean',
            'order' => 'integer'
        ]);

        // Handle image removal
        if ($request->input('remove_image') === 'true' || $request->input('remove_image') === true) {
            $this->deleteOldAdImage($adSetting->image_url);
            $validated['image_url'] = null;
        }

        // Handle image file upload
        if ($request->hasFile('image_file')) {
            $this->deleteOldAdImage($adSetting->image_url);
            $validated['image_url'] = $this->uploadAdImage($request->file('image_file'));
        }
        unset($validated['image_file'], $validated['remove_image']);

        $adSetting->update($validated);

        return back()->with('success', 'Ad slot updated successfully');
    }

    private function uploadAdImage($file)
    {
        $filename = uniqid('ad_') . '.' . $file->getClientOriginalExtension();
        $uploadPath = 'uploads/ads/' . $filename;

        // Try R2 first, fallback to local
        $r2Configured = env('R2_ACCESS_KEY_ID') && env('R2_BUCKET');

        if ($r2Configured) {
            try {
                Storage::disk('r2')->put($uploadPath, file_get_contents($file));
                \Log::info("Ad image uploaded to R2", ['path' => $uploadPath]);
                // Return the relative path - frontend will prepend R2 public URL
                return $uploadPath;
            } catch (\Exception $e) {
                \Log::warning("R2 ad upload failed, using local: " . $e->getMessage());
            }
        }

        // Fallback to local public storage
        Storage::disk('public')->put($uploadPath, file_get_contents($file));
        \Log::info("Ad image uploaded to local storage", ['path' => $uploadPath]);
        return $uploadPath;
    }

    private function deleteOldAdImage($imageUrl)
    {
        if (!$imageUrl) return;

        // Skip external URLs
        if (str_starts_with($imageUrl, 'http://') || str_starts_with($imageUrl, 'https://')) return;

        $path = ltrim($imageUrl, '/');
        // Remove /storage/ prefix if present (old format)
        $path = preg_replace('#^storage/#', '', $path);

        $r2Configured = env('R2_ACCESS_KEY_ID') && env('R2_BUCKET');
        if ($r2Configured) {
            try { Storage::disk('r2')->delete($path); } catch (\Exception $e) {}
        }
        try { Storage::disk('public')->delete($path); } catch (\Exception $e) {}
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

