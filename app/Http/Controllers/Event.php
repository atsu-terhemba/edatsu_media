<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Events;
use Illuminate\Support\Carbon;
use Validator;
use App\Models\Bookmark;
use Illuminate\Support\Facades\Auth;



class Event extends Controller
{

//
function show(){
    $ev_posts = Events::where('deleted', 0)->orderByDesc('id')->paginate(10);
    return view("admin.event_page", ["ev_posts" => $ev_posts]);
}

function edit(Request $request, $id){
    $ev_posts = Events::where('deleted', 0)->orderByDesc('id')->paginate(10);
    $edits = Events::select('*')->where('id', '=', $id)->where('u_id', '=', $request->user()->id)->get();
    return view("admin.event_page", ["ev_posts" => $ev_posts, "edits"=> $edits]);
}

function store(Request $request){

    //validate the data 
    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'event_type' => 'required|string|max:50',
        'location' => 'nullable|string|max:255',
        'event_date' => 'required|date',
        'event_time' => 'nullable',
        'alternate_dates' => 'nullable',
        'reference' => 'required|nullable|url|max:255',
        'category' => 'nullable|string',
        'country' => 'required|string',
        'region' => 'nullable|string',
        'continent' => 'nullable|string',
    ]);


    //capture values 
    $title = $request->title;
    $description = $request->description;
    $event_type = $request->event_type;
    $location = $request->location;
    $event_date = $request->event_date;
    $event_time = $request->event_time;
    $alternate_dates_input = $request->alternate_dates;
    $reference = $request->reference;
    $category = $request->category;
    $country = $request->country;
    $region = $request->region;
    $continent = $request->continent;

 


    //prevent users from backdating job post
    $current_date = Carbon::now();  
    $event_date = Carbon::parse($request->event_date);



    if (!$event_date->greaterThanOrEqualTo($current_date)) {
    return back()->withErrors(["error_msg"=>"Invalid event date"])->withInput($request->input());
    }

   
    //split alternative dates where they are delimited by comma
    $alternate_dates = explode(',', $alternate_dates_input);



    if(count($alternate_dates) > 0){
        foreach ($alternate_dates as $value) {
            $value = Carbon::parse($value);
            if (!$value->greaterThanOrEqualTo($current_date)) {
                return back()->withErrors(["error_msg"=>"Invalid alternative date"])->withInput($request->input());
            }
        }
    };

    //store the data in the data base
    $event = new Events;
    $event->u_id = $request->user()->id;
    $event->user_role = $request->user()->role;
    $event->title = $title;
    $event->description = $description;
    $event->event_type = $event_type;
    $event->location = $location;
    $event->event_date = $event_date;
    $event->event_time = $event_time;
    $event->alternate_dates = $alternate_dates_input;
    $event->source_url = $reference;
    $event->category = $category;
    $event->country = $country;
    $event->region = $region;
    $event->continent = $continent;
    $event->save();

    return redirect('admin-post-event')->with('status', 'Post Successful!');
}

/**update database */
function update(Request $request, $id){
        //capture values 
        $title = $request->title;
        $description = $request->description;
        $location = $request->location;
        $event_date = $request->event_date;
        $reference = $request->reference;
        $region = $request->region;
        $country = $request->country;  
    
        //validate the data 
        $request->validate([
            'title' => ['required', 'max:191'],
            'description'=> ['required'],
            'location' => ['required'],
            'event_date' => ['required'],
            'reference'=> ['required', 'url', 'regex:/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/', 'active_url'],
            'region'=> [ 'max:191'],
            'country'=> ['required', 'max:191'],
        ]);

    //prevent users from backdating job post
    $current_date = Carbon::now();  
    $event_date = Carbon::parse($request->event_date);

    if (!$event_date->greaterThanOrEqualTo($current_date)) {
    return back()->withErrors(["error_msg"=>"Invalid event date"])->withInput($request->input());
    }

    //store the data in the data base
    Events::where('id', $id)
    ->where('u_id', $request->user()->id)
    ->update
    ([
        'u_id' => $request->user()->id,
        'user_role' => $request->user()->role,
        'title' => $title,
        'description'=> $description,
        'location'=> $location,
        'event_date'=> $event_date,
        'source_url' => $reference,
        'region'=> $region,
        'country'=> $country
    ]);

    return redirect('admin-post-event')->with('status', 'Post Updated!');
}

/**delete database */
function delete(Request $request, $id){
    Events::where('id', $id)
    ->where('u_id', $request->user()->id)
    ->update
    ([
        'deleted' => 1
    ]);

    return redirect('admin-post-event')->with('status', 'Post Deleted!');
}


/**
 * Bookmark Event
 */
function bookmarkEvent(Request $request){
    if(Auth::check()){

        $event_id = $request->post('id'); 
        $user_id = $request->user()->id;
        
        //validate entries 
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer', 
            "type" => "required",
        ]);

        //handle validation errors
        if($validator->fails()){
            return response()->json(['status' => 'error', 'message'=> 'Oops! Something went wrong']);
        }

        //init bookmark
        $bookmark = new Bookmark;

        //check if post_id already exist in database. 
        if($bookmark->where('event_id', $event_id)
        ->where('user_id', $user_id)
        ->exists()){

        //check if its removed, if removed, update deleted to 0 to add it back
        $is_deleted = $bookmark->where('event_id', $event_id)
        ->where('user_id', $user_id)
        ->where('deleted', 1);

        if($is_deleted->count() > 0){
            //update record
            $restore_bookmark = $bookmark->where('event_id', $event_id)
            ->where('user_id', $user_id)
            ->update(['deleted' => 0]);

            if($restore_bookmark > 0){
                return response()->json(['status' => 'success', 'message' => "Bookmarked"]);
            }
        }

            return response()->json(['status' => 'error', 'message'=> 'Already Bookmarked']);
        }

        //save data...
        $bookmark->user_id = $user_id;
        $bookmark->event_id = $event_id;
        $bookmark->save();

        return response()->json(['status' => 'success', 'message' => "Bookmarked"]);

    }else{

        return response()->json(['status' => 'warning', 'message' => "Login to Bookmark"]);
    }
}



}
