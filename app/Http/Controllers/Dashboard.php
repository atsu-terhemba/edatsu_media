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
                
                $all_users = User::where('role', '=', 'subscriber')->count();

                return Inertia::render('Admin/Dashboard', 
                    [
                        'total_events'=> count($total_events),
                        'total_oppty' => count($total_oppty),
                        'total_users' => $all_users
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

        return view('admin.users'); 

    }



}


