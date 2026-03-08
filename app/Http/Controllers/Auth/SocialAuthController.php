<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Notifications\WelcomeNotification;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    protected $providers = ['google', 'linkedin-openid'];

    public function redirect(string $provider)
    {
        if (!in_array($provider, $this->providers)) {
            abort(404);
        }

        return Socialite::driver($provider)->redirect();
    }

    public function callback(string $provider)
    {
        if (!in_array($provider, $this->providers)) {
            abort(404);
        }

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            \Log::error("Social auth callback failed for {$provider}: " . $e->getMessage());
            return redirect()->route('login')->with('error', 'Social login failed. Please try again.');
        }

        try {
            // Normalize provider name for storage (linkedin-openid -> linkedin)
            $providerName = str_replace('-openid', '', $provider);

            // Find existing user by social provider+id, or by email
            $user = User::where('social_provider', $providerName)
                ->where('social_id', $socialUser->getId())
                ->first();

            if (!$user) {
                // Check if a user with this email already exists (registered via email/password)
                $user = User::where('email', $socialUser->getEmail())->first();

                if ($user) {
                    // Link social account to existing user and verify email if not already verified
                    $user->update([
                        'social_provider' => $providerName,
                        'social_id' => $socialUser->getId(),
                        'avatar' => $socialUser->getAvatar(),
                        'email_verified_at' => $user->email_verified_at ?? now(),
                    ]);
                } else {
                    // Create new user
                    $name = $socialUser->getName() ?? $socialUser->getNickname() ?? 'user';
                    // Ensure unique username by sanitizing and appending random string if needed
                    $baseName = Str::slug($name, '_');
                    if (User::where('name', $baseName)->exists()) {
                        $baseName = $baseName . '_' . Str::random(4);
                    }

                    $user = User::create([
                        'name' => $baseName,
                        'email' => $socialUser->getEmail(),
                        'social_provider' => $providerName,
                        'social_id' => $socialUser->getId(),
                        'avatar' => $socialUser->getAvatar(),
                        'email_verified_at' => now(),
                        'role' => 'subscriber',
                        'password' => null,
                    ]);

                    try {
                        $user->notify(new WelcomeNotification());
                    } catch (\Exception $e) {
                        \Log::warning("Welcome email failed for user {$user->id}: " . $e->getMessage());
                    }
                }
            } else {
                // Update avatar on each login
                $user->update(['avatar' => $socialUser->getAvatar()]);
            }

            Auth::login($user, true);

            return redirect()->intended(route('dashboard'));
        } catch (\Exception $e) {
            \Log::error("Social auth user creation/login failed for {$provider}: " . $e->getMessage() . "\n" . $e->getTraceAsString());
            return redirect()->route('login')->with('error', 'Social login failed. Please try again.');
        }
    }
}
