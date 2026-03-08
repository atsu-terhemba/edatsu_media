<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'profile_photo_path',
        'role',
        'password',
        'social_provider',
        'social_id',
        'avatar',
        'last_seen_at',
        'device_type',
        'browser',
        'operating_system',
        'device_name',
        'last_ip_address',
        'user_agent',
        'is_online'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'user_agent',
        'last_ip_address'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_seen_at' => 'datetime',
        'is_online' => 'boolean'
    ];

    /**
     * Check if user is online (active within last 5 minutes)
     */
    public function isOnline()
    {
        return $this->last_seen_at && $this->last_seen_at->gt(now()->subMinutes(5));
    }

    /**
     * Get the device icon based on device type
     */
    public function getDeviceIcon()
    {
        switch($this->device_type) {
            case 'mobile':
                return 'smartphone';
            case 'tablet':
                return 'tablet';
            case 'desktop':
            default:
                return 'computer';
        }
    }

    /**
     * Update user's last seen activity
     */
    public function updateLastSeen($request = null)
    {
        $this->update([
            'last_seen_at' => now(),
            'is_online' => true
        ]);

        if ($request) {
            $this->updateDeviceInfo($request);
        }
    }

    /**
     * Update device information from request
     */
    public function updateDeviceInfo($request)
    {
        $userAgent = $request->header('User-Agent');
        
        // Parse device type
        $deviceType = 'desktop';
        if (preg_match('/Mobile|Android|iPhone|iPad/', $userAgent)) {
            if (preg_match('/iPad/', $userAgent)) {
                $deviceType = 'tablet';
            } else {
                $deviceType = 'mobile';
            }
        }

        // Parse browser
        $browser = 'Unknown';
        if (preg_match('/Chrome/', $userAgent)) {
            $browser = 'Chrome';
        } elseif (preg_match('/Firefox/', $userAgent)) {
            $browser = 'Firefox';
        } elseif (preg_match('/Safari/', $userAgent)) {
            $browser = 'Safari';
        } elseif (preg_match('/Edge/', $userAgent)) {
            $browser = 'Edge';
        }

        // Parse OS
        $os = 'Unknown';
        if (preg_match('/Windows/', $userAgent)) {
            $os = 'Windows';
        } elseif (preg_match('/Mac/', $userAgent)) {
            $os = 'macOS';
        } elseif (preg_match('/Linux/', $userAgent)) {
            $os = 'Linux';
        } elseif (preg_match('/Android/', $userAgent)) {
            $os = 'Android';
        } elseif (preg_match('/iOS/', $userAgent)) {
            $os = 'iOS';
        }

        $this->update([
            'device_type' => $deviceType,
            'browser' => $browser,
            'operating_system' => $os,
            'last_ip_address' => $request->ip(),
            'user_agent' => $userAgent,
            'device_name' => $os . ' - ' . $browser
        ]);
    }

    /**
     * Route notifications for the custom database channel.
     */
    public function routeNotificationForDatabase()
    {
        return $this->hasMany(\App\Models\Notification::class, 'user_id');
    }

    /**
     * Get user's notifications relationship
     */
    public function notifications()
    {
        return $this->hasMany(\App\Models\Notification::class, 'user_id')->latest();
    }

    /**
     * Get user's unread notifications
     */
    public function unreadNotifications()
    {
        return $this->hasMany(\App\Models\Notification::class, 'user_id')
            ->where('is_read', false)
            ->latest();
    }
}
