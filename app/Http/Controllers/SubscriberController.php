<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Bookmark;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Profile;
use Inertia\Inertia;

class SubscriberController extends Controller
{
        //
        function index(){
            return Inertia::render('Subscriber/Dashboard');
        }

        function bookmark(){
            return Inertia::render('Subscriber/Bookmark');
        }

        function notifications(){
            return Inertia::render('Subscriber/Notification');
        }

        function notificationSettings(){
            return Inertia::render('Subscriber/NotificationSettings');
        }

        /**
         * calculate profile completion percentile
         */
        public function calculateDataCompletionPercentage($userId)
        {
            $candidate = Profile::where('user_id', $userId)->first();
        
            if ($candidate) {
                $candidateData = $candidate->toArray();
                $totalFields   = count($candidateData);
                $filledFields  = 0;
                
                foreach ($candidateData as $field => $value) {
                    if (!empty($value)) {
                        $filledFields++;
                    }
                }
                
                $completionPercentage = round(($filledFields / $totalFields) * 100);
                
                return $completionPercentage;
            }
            
            return 0;
        }

        /**
         * initialize profile
         */

        public function initProfile(Request $request){
            $user_id = $request->user()->id;
            $data_count = $this->calculateDataCompletionPercentage($user_id);
            $profile_data = Profile::where("user_id", $user_id)->first();
            return view('subscriber.profile', ['data_count' => $data_count, 'profile_data' => $profile_data]);
        }


        /**
         * update profile
         */
        public function updateProfile(Request $request)
        {
            $this->validateInput($request);
            $user_id = $request->user()->id;
            // $this->calculateDataCompletionPercentage($user_id);

            // Check if the ID already exists in the database
            $existingCandidate =  Profile::where('user_id', $user_id)->first();


            if ($existingCandidate !== null) {
                //store cv if exist

                //store certifications if exist
                // if ($request->hasFile("certifications")){
                //     $certification_path  = $this->storeFiles($request, "certifications", ['pdf', 'doc', 'docx', 'txt', 'rtf', 'csv']);
                // }else{
                //      //get old image and update store it in database
                //      $certification_path = Candidate::select('certifications')->where('user_id', $request->user()->id)->first();
                //      $certification_path  = ( $certification_path  == null)? '' :  $certification_path->certifications;
                // }

                //update data
                Profile::where('user_id', $user_id)
                ->update([
                    'profile_picture' => $request->input('profile_picture'),
                    'full_name' => $request->input('full_name'),
                    'about' => $request->input('about'),
                    'linkedin_profile' => $request->input('linkedin_profile'),
                    'email' => $request->input('email'),
                    'phone_no' => $request->input('phone_no'),
                    'location' => $request->input('location'),
                    'gender' => $request->input('gender'),
                    'date_of_birth' => $request->input('date_of_birth'),
                ]);

                return redirect()->back()->with('status', 'Profile updated!');

            }else{

                //store cv if exist
                //  if ($request->hasFile("certifications")){
                //     $certification_path = $this->storeFiles($request, "certifications", ['pdf', 'doc', 'docx', 'txt', 'rtf', 'csv']);
                // }else{
                //     $certification_path = "";
                // }

                Profile::create([
                    'user_id' => $user_id,
                    'profile_picture' => $request->input('profile_picture'),
                    'full_name' => $request->input('full_name'),
                    'about' => $request->input('about'),
                    'linkedin_profile' => $request->input('linkedin_profile'),
                    'email' => $request->input('email'),
                    'phone_no' => $request->input('phone_no'),
                    'location' => $request->input('location'),
                    'gender' => $request->input('gender'),
                    'date_of_birth' => $request->input('date_of_birth'),
                ]);

                return redirect()->back()->with('status', 'Profile stored!');
            }
        }






        //bookmarking
        public function bookmarkFeed(Request $request){
            //check if user is authenticated if not 
            // return response()->json(['data' => $request->all()]);
            if(Auth::check()){

                //validate entries 
                $validator = Validator::make($request->all(), [
                    "url" => "required", 
                    "title" => "required",
                ]);

                //handle validation errors
                if($validator->fails()){
                    return response()->json(['message'=> $validator->errors()]);
                }

                //init database 
                $feedsBookmark = new BookmarkFeeds;
                $feedsBookmark->user_id = Auth::user()->id;
                $feedsBookmark->title = $request->post('title');
                $feedsBookmark->external_url = $request->post('url');
                $feedsBookmark->save();

                return response()->json(['success' => true, 'message'=> 'Bookmark Successful']);
            }else{
                //request user to sign up
                return response()->json(['success' => false, 'message'=> 'Login to bookmark']);
            }
        }

        /**list all bookmarked opportunities */
        public function listBookmarkedOpportunites(Request $request) {
            $user_id = Auth::user()->id;

            $opportunities = Bookmark::with('opportunity')
            ->where('user_id', $user_id)
            ->where('deleted', 0)
            ->where('opportunity_id', '<>', null)
            ->orderBy('id', 'desc')->paginate('5');
  
            return response()->json($opportunities);
        }


        /**list all bookmarked events */
        public function listBookmarkedEvents(Request $request) {
            $user_id = Auth::user()->id;

            $events = Bookmark::with('event')
            ->where('user_id', $user_id)
            ->where('deleted', 0)
            ->where('event_id', '<>', null)
            ->orderBy('id', 'desc')->paginate('5');

            return response()->json(['data_feeds' => $events]);
        }

        /**
         * list all bookmarks
         */

        public function fetchAllBookmark(){
            $user_id = Auth::user()->id;
            /**ELOQUENT DB QUERY**/
            $bookmarks = Bookmark::with('opportunity', 'event')
            ->where('user_id', $user_id)
            ->where('removed', 0)
            ->orderBy('id', 'desc')
            ->paginate('5');

            // Fetch bookmarked opportunities
            // $opportunities = DB::table('bookmarks')
            // ->join('opportunities', 'bookmarks.opportunity_id', '=', 'opportunities.id')
            // ->select('bookmarks.id AS bookmark_id', 'bookmarks.*', 'opportunities.*')
            // ->where('bookmarks.deleted', 0)
            // ->where('user_id', $user_id)
            // ->orderBy('bookmarks.id', 'desc')
            // ->get();

            // Fetch bookmarked events
            // $events = DB::table('bookmarks')
            // ->join('events', 'bookmarks.event_id', '=', 'events.id')
            // ->select('bookmarks.id AS event_id', 'bookmarks.*', 'events.*')
            // ->where('bookmarks.deleted', 0)
            // ->where('user_id', $user_id)
            // ->orderBy('bookmarks.id', 'desc')
            // ->get();

            // Merge the opportunities and events into a single collection
            // $allBookmarks = $opportunities->merge($events);

            // // Paginate the combined collection
            // $bookmarks = new LengthAwarePaginator(
            //     $allBookmarks->forPage(request()->page, 5),
            //     $allBookmarks->count(),
            //     5,
            //     request()->page,
            //     ['path' => request()->url()]
            // );

            return response()->json($bookmarks);
        }

        /**remove bookmark */
        public function removeBookmark(Request $request){
            $id = $request->input('id'); 
            $user_id = Auth::user()->id;
            $remove_bookmark = Bookmark::where('id', $id)
            ->where('user_id', $user_id)->update(['removed' => 1]);
            if($remove_bookmark > 0){
                return response()->json(['status' => 'success', 'message' => 'Bookmark Removed']);
            }else{
                return response()->json(['status' => 'error', 'message' => 'Oops! Something went wrong']);
            }
        }

}
