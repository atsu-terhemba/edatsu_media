<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProGatingSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProGatingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ProGating', [
            'settings' => ProGatingSetting::current(),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'enabled' => 'required|boolean',
            'bookmarks_max' => 'required|integer|min:0|max:10000',
            'saved_articles_max' => 'required|integer|min:0|max:10000',
            'reminders_max' => 'required|integer|min:0|max:10000',
            'custom_feeds_max' => 'required|integer|min:0|max:10000',
            'bulk_export_pro_only' => 'required|boolean',
            'web_push_pro_only' => 'required|boolean',
        ]);

        $setting = ProGatingSetting::current();
        $setting->update($data);

        return back()->with('success', 'Pro-gating settings updated');
    }
}
