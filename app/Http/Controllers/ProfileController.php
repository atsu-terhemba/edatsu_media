<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use PragmaRX\Google2FA\Google2FA;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $activeSubscription = $user->activeSubscription()->with('plan')->first();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'currentPlan' => $activeSubscription ? $activeSubscription->plan->name : 'Free',
            'activeSubscription' => $activeSubscription,
        ]);
    }

    /**
     * Display the user's settings page.
     */
    public function settings(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Profile/Settings', [
            'twoFactorEnabled' => $user->hasTwoFactorEnabled(),
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
     * Generate a new 2FA secret and return QR code data.
     */
    public function enableTwoFactor(Request $request)
    {
        $request->validate(['password' => ['required', 'current_password']]);

        $user = $request->user();
        $google2fa = new Google2FA();

        $secret = $google2fa->generateSecretKey();

        // Store secret (not yet confirmed)
        $user->update([
            'two_factor_secret' => encrypt($secret),
            'two_factor_confirmed_at' => null,
            'two_factor_recovery_codes' => null,
        ]);

        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name', 'Edatsu'),
            $user->email,
            $secret
        );

        return response()->json([
            'success' => true,
            'secret' => $secret,
            'qr_url' => $qrCodeUrl,
        ]);
    }

    /**
     * Confirm 2FA setup by verifying a code from the authenticator app.
     */
    public function confirmTwoFactor(Request $request)
    {
        $request->validate(['code' => ['required', 'string', 'size:6']]);

        $user = $request->user();

        if (!$user->two_factor_secret) {
            return response()->json(['success' => false, 'message' => '2FA setup not initiated.'], 400);
        }

        $google2fa = new Google2FA();
        $secret = decrypt($user->two_factor_secret);

        if (!$google2fa->verifyKey($secret, $request->code)) {
            return response()->json(['success' => false, 'message' => 'Invalid verification code. Please try again.'], 422);
        }

        // Generate recovery codes
        $recoveryCodes = collect(range(1, 8))->map(fn() => Str::random(10))->toArray();

        $user->update([
            'two_factor_confirmed_at' => now(),
            'two_factor_recovery_codes' => encrypt(json_encode($recoveryCodes)),
        ]);

        return response()->json([
            'success' => true,
            'recovery_codes' => $recoveryCodes,
        ]);
    }

    /**
     * Disable 2FA for the user.
     */
    public function disableTwoFactor(Request $request)
    {
        $request->validate(['password' => ['required', 'current_password']]);

        $request->user()->update([
            'two_factor_secret' => null,
            'two_factor_confirmed_at' => null,
            'two_factor_recovery_codes' => null,
        ]);

        return response()->json(['success' => true, 'message' => '2FA has been disabled.']);
    }

    /**
     * Show current recovery codes.
     */
    public function getRecoveryCodes(Request $request)
    {
        $request->validate(['password' => ['required', 'current_password']]);

        $user = $request->user();

        if (!$user->hasTwoFactorEnabled() || !$user->two_factor_recovery_codes) {
            return response()->json(['success' => false, 'message' => '2FA is not enabled.'], 400);
        }

        $codes = json_decode(decrypt($user->two_factor_recovery_codes), true);

        return response()->json(['success' => true, 'recovery_codes' => $codes]);
    }

    /**
     * Regenerate recovery codes.
     */
    public function regenerateRecoveryCodes(Request $request)
    {
        $request->validate(['password' => ['required', 'current_password']]);

        $user = $request->user();

        if (!$user->hasTwoFactorEnabled()) {
            return response()->json(['success' => false, 'message' => '2FA is not enabled.'], 400);
        }

        $recoveryCodes = collect(range(1, 8))->map(fn() => Str::random(10))->toArray();

        $user->update([
            'two_factor_recovery_codes' => encrypt(json_encode($recoveryCodes)),
        ]);

        return response()->json(['success' => true, 'recovery_codes' => $recoveryCodes]);
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
