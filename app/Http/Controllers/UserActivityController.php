<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserActivity;
use Illuminate\Support\Facades\Auth;

class UserActivityController extends Controller
{
    /**
     * Store user activity data.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Get the authenticated user's ID (if logged in)
        $userId = Auth::id();

        // Capture the IP address
        $ipAddress = $request->ip();

        // Gather the user agent info
        $deviceType = $this->getDeviceType($request->userAgent());
        $browser = $this->getBrowser($request->userAgent());
        $operatingSystem = $this->getOperatingSystem($request->userAgent());

        // Capture time spent, scroll depth, etc. from the request
        $timeSpent = $request->input('time_spent');
        $scrollDepth = $request->input('scroll_depth');
        $clickedLinks = $request->input('clicked_links', []);
        $engaged = count($clickedLinks) > 0;
        $referral_url = $request->input('referrer_url');
        $current_url = $request->input('current_url');

        // Store the activity in the database
        $activity = new UserActivity();
        $activity->user_id = $userId;
        $activity->session_id = $request->session()->getId();
        $activity->ip_address = $ipAddress;
        $activity->location = $this->getLocation($ipAddress); // You can use a service like IP Geolocation
        $activity->device_type = $deviceType;
        $activity->browser = $browser;
        $activity->operating_system = $operatingSystem;
        // $activity->referral_url = $request->headers->get('referer');
        // $activity->current_page_url = $request->fullUrl();
        $activity->referral_url = $referral_url;
        $activity->current_page_url = $current_url;

        $activity->time_spent = $timeSpent;
        $activity->scroll_depth = $scrollDepth;
        $activity->engaged = $engaged;
        $activity->clicked_links = json_encode($clickedLinks);
        $activity->save();

        return response()->json(['message' => 'User activity recorded successfully']);
    }

    /**
     * Get the device type based on the user agent string.
     *
     * @param  string  $userAgent
     * @return string
     */
    private function getDeviceType($userAgent)
    {
        if (preg_match('/mobile/i', $userAgent)) {
            return 'Mobile';
        } elseif (preg_match('/tablet/i', $userAgent)) {
            return 'Tablet';
        } else {
            return 'Desktop';
        }
    }

    /**
     * Get the browser type based on the user agent string.
     *
     * @param  string  $userAgent
     * @return string
     */
    private function getBrowser($userAgent)
    {
        if (preg_match('/chrome/i', $userAgent)) {
            return 'Chrome';
        } elseif (preg_match('/firefox/i', $userAgent)) {
            return 'Firefox';
        } elseif (preg_match('/safari/i', $userAgent)) {
            return 'Safari';
        } elseif (preg_match('/msie|trident/i', $userAgent)) {
            return 'Internet Explorer';
        } else {
            return 'Other';
        }
    }

    /**
     * Get the operating system based on the user agent string.
     *
     * @param  string  $userAgent
     * @return string
     */
    private function getOperatingSystem($userAgent)
    {
        if (preg_match('/windows/i', $userAgent)) {
            return 'Windows';
        } elseif (preg_match('/mac/i', $userAgent)) {
            return 'MacOS';
        } elseif (preg_match('/linux/i', $userAgent)) {
            return 'Linux';
        } elseif (preg_match('/android/i', $userAgent)) {
            return 'Android';
        } elseif (preg_match('/iphone|ipad/i', $userAgent)) {
            return 'iOS';
        } else {
            return 'Other';
        }
    }

    /**
     * Get the location based on the IP address.
     *
     * @param  string  $ipAddress
     * @return array|string|null
     */
    private function getLocation($ipAddress){
    // Use the free IP geolocation service from ip-api.com
    $url = "http://ip-api.com/json/{$ipAddress}";

    // Fetch the location data
    $response = file_get_contents($url);
    
    if ($response === false) {
        // Handle error (e.g., log it or return null)
        return null;
    }

    $data = json_decode($response, true);

    // Check if the response indicates a successful query
    if (isset($data['status']) && $data['status'] === 'success') {
        // Return the location data
        $geolocation  =  [
            'country' => $data['country'] ?? null,
            'region' => $data['regionName'] ?? null,
            'city' => $data['city'] ?? null,
            'zip' => $data['zip'] ?? null,
            'lat' => $data['lat'] ?? null,
            'lon' => $data['lon'] ?? null,
        ];

        return $geolocation;
    }

    // If the IP was not found, return null
    return null;
}








}
