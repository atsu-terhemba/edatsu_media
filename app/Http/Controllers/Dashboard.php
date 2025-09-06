<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Events;
use App\Models\Oppty;
use App\Models\User;
use Inertia\Inertia;

class Dashboard extends Controller
{
    //redirect logged user...
    function accessControl(Request $request){
        if(Auth::check()){
            if(Auth::user()->role == 'admin'){
                //display total number of events and opp posted
                $total_oppty = Oppty::all();
                $total_events = Events::all();
                
                // Enhanced user statistics
                $total_users = User::where('role', '=', 'subscriber')->count();
                $total_admins = User::where('role', '=', 'admin')->count();
                $all_users_count = User::count();
                
                // Recent user registrations (last 30 days)
                $recent_users = User::where('created_at', '>=', now()->subDays(30))->count();
                
                // Users registered this week
                $weekly_users = User::where('created_at', '>=', now()->startOfWeek())->count();
                
                // Users registered today
                $daily_users = User::whereDate('created_at', today())->count();
                
                // User registration trend (last 6 months)
                $user_trend = [];
                for($i = 5; $i >= 0; $i--) {
                    $month = now()->subMonths($i);
                    $user_trend[] = [
                        'month' => $month->format('M Y'),
                        'count' => User::whereYear('created_at', $month->year)
                                      ->whereMonth('created_at', $month->month)
                                      ->count()
                    ];
                }
                
                // Most recent users (last 5)
                $recent_user_list = User::where('role', '=', 'subscriber')
                                       ->orderBy('created_at', 'desc')
                                       ->limit(5)
                                       ->select('id', 'name', 'email', 'created_at')
                                       ->get();

                return Inertia::render('Admin/Dashboard', 
                    [
                        'total_events'=> count($total_events),
                        'total_oppty' => count($total_oppty),
                        'total_users' => $total_users,
                        'total_admins' => $total_admins,
                        'all_users_count' => $all_users_count,
                        'recent_users' => $recent_users,
                        'weekly_users' => $weekly_users,
                        'daily_users' => $daily_users,
                        'user_trend' => $user_trend,
                        'recent_user_list' => $recent_user_list
                    ]
                );
            }elseif(Auth::user()->role == 'subscriber'){
                return Inertia::render('Subscriber/Dashboard');
            }
        }else{
            //terminate existing session an redirect user to home page
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect('/');
        }
    }


    //Display All users 
    public function allUsers(Request $request){
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);
        
        $usersQuery = User::select([
                'id', 'name', 'email', 'role', 'created_at', 'updated_at',
                'last_seen_at', 'device_type', 'browser', 'operating_system', 
                'device_name', 'is_online'
            ])
            ->orderBy('is_online', 'desc')
            ->orderBy('last_seen_at', 'desc')
            ->orderBy('created_at', 'desc');
        
        // Apply search filter if provided
        if ($search) {
            $usersQuery->where(function($query) use ($search) {
                $query->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%")
                      ->orWhere('role', 'LIKE', "%{$search}%")
                      ->orWhere('device_type', 'LIKE', "%{$search}%")
                      ->orWhere('browser', 'LIKE', "%{$search}%")
                      ->orWhere('operating_system', 'LIKE', "%{$search}%");
            });
        }
        
        $users = $usersQuery->paginate($perPage);
        
        // Get summary statistics
        $statistics = [
            'total_users' => User::count(),
            'total_subscribers' => User::where('role', 'subscriber')->count(),
            'total_admins' => User::where('role', 'admin')->count(),
            'online_users' => User::where('is_online', true)->count(),
            'recent_registrations' => User::where('created_at', '>=', now()->subDays(30))->count(),
            'today_registrations' => User::whereDate('created_at', today())->count(),
            'mobile_users' => User::where('device_type', 'mobile')->where('is_online', true)->count(),
            'desktop_users' => User::where('device_type', 'desktop')->where('is_online', true)->count(),
        ];

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'statistics' => $statistics,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage
            ]
        ]);
    }



}


