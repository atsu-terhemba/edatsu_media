<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use PragmaRX\Google2FA\Google2FA;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'error' => session('error'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $user = Auth::user();

        // Check if user has 2FA enabled
        if ($user->hasTwoFactorEnabled()) {
            // Store user ID in session and log them out temporarily
            $request->session()->put('2fa:user_id', $user->id);
            $request->session()->put('2fa:remember', $request->boolean('remember'));
            Auth::guard('web')->logout();

            return redirect()->route('2fa.challenge');
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Show the 2FA challenge page.
     */
    public function twoFactorChallenge(Request $request)
    {
        if (!$request->session()->has('2fa:user_id')) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/TwoFactorChallenge');
    }

    /**
     * Verify the 2FA code.
     */
    public function twoFactorVerify(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $userId = $request->session()->get('2fa:user_id');
        if (!$userId) {
            return redirect()->route('login');
        }

        $user = \App\Models\User::findOrFail($userId);
        $code = $request->code;

        // Check if it's a recovery code
        if (strlen($code) > 6) {
            $recoveryCodes = json_decode(decrypt($user->two_factor_recovery_codes), true);
            $index = array_search($code, $recoveryCodes);

            if ($index === false) {
                return back()->withErrors(['code' => 'Invalid recovery code.']);
            }

            // Remove used recovery code
            unset($recoveryCodes[$index]);
            $user->update([
                'two_factor_recovery_codes' => encrypt(json_encode(array_values($recoveryCodes))),
            ]);
        } else {
            // Verify TOTP code
            $google2fa = new Google2FA();
            $secret = decrypt($user->two_factor_secret);

            if (!$google2fa->verifyKey($secret, $code)) {
                return back()->withErrors(['code' => 'Invalid verification code.']);
            }
        }

        // Log the user in
        Auth::login($user, $request->session()->get('2fa:remember', false));
        $request->session()->forget(['2fa:user_id', '2fa:remember']);
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
