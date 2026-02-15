<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Get the storage disk to use for profile photos.
     */
    private function getStorageDisk(): string
    {
        $r2Configured = env('R2_ACCESS_KEY_ID') && env('R2_BUCKET');
        return $r2Configured ? 'r2' : 'public';
    }

    /**
     * Update the user's profile photo.
     */
    public function updatePhoto(Request $request)
    {
        $request->validate([
            'photo' => ['required', 'image', 'max:2048'],
        ]);

        $user = $request->user();
        $disk = $this->getStorageDisk();

        // Delete old photo if exists
        if ($user->profile_photo_path) {
            try {
                Storage::disk($disk)->delete('profile-photos/' . $user->profile_photo_path);
            } catch (\Exception $e) {
                \Log::warning("Failed to delete old profile photo: " . $e->getMessage());
            }
        }

        // Store new photo
        $file = $request->file('photo');
        $hashedFileName = md5($file->getClientOriginalName() . time()) . '.' . $file->getClientOriginalExtension();
        $uploadPath = 'profile-photos/' . $hashedFileName;

        try {
            Storage::disk($disk)->put($uploadPath, file_get_contents($file));
        } catch (\Exception $e) {
            if ($disk === 'r2') {
                \Log::warning("R2 upload failed for profile photo, using local: " . $e->getMessage());
                Storage::disk('public')->put($uploadPath, file_get_contents($file));
            } else {
                throw $e;
            }
        }

        $user->update([
            'profile_photo_path' => $hashedFileName,
        ]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Profile photo updated successfully',
                'path' => $hashedFileName,
            ]);
        }

        return Redirect::route('profile.edit')->with('status', 'profile-photo-updated');
    }

    /**
     * Delete the user's profile photo.
     */
    public function deletePhoto(Request $request)
    {
        $user = $request->user();

        if ($user->profile_photo_path) {
            $disk = $this->getStorageDisk();
            try {
                Storage::disk($disk)->delete('profile-photos/' . $user->profile_photo_path);
            } catch (\Exception $e) {
                \Log::warning("Failed to delete profile photo: " . $e->getMessage());
            }
            $user->update(['profile_photo_path' => null]);
        }

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Profile photo deleted successfully',
            ]);
        }

        return Redirect::route('profile.edit')->with('status', 'profile-photo-deleted');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
