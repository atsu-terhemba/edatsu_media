<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Bookmark;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Profile;
use App\Models\Product;
use App\Models\Oppty;
use App\Models\Notification;
use App\Models\Message;
use App\Models\UserPreference;
use App\Models\Category;
use App\Models\Country;
use App\Models\Region;
use App\Models\BrandLabel;
use App\Models\Tag;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Notifications\ReminderNotification;
use App\Models\SavedFeedArticle;
use App\Models\PushSubscription;

class SubscriberController extends Controller
{
    /**
     * API endpoint to fetch comprehensive subscriber details
     */
    public function getSubscriberDetails(Request $request)
    {
        $user_id = Auth::user()->id;
        
        // Get total bookmarks (both tools and opportunities)
        $totalBookmarks = Bookmark::where('user_id', $user_id)
            ->where('removed', 0)
            ->count();
        
        // Get total bookmarked tools/products
        $totalBookmarkedTools = Bookmark::where('user_id', $user_id)
            ->where('post_type', 'tool')
            ->where('removed', 0)
            ->count();
        
        // Get upcoming opportunities from bookmarks (opportunities with deadline in future)
        $upcomingOpportunities = Bookmark::join('opportunities', 'bookmarks.post_id', '=', 'opportunities.id')
            ->where('bookmarks.user_id', $user_id)
            ->where('bookmarks.post_type', 'opp')
            ->where('bookmarks.removed', 0)
            ->where('opportunities.deadline', '>=', Carbon::now()->toDateString())
            ->count();

        // Get recent bookmarks with detailed information
        $recentBookmarks = Bookmark::with(['product', 'opportunity'])
            ->where('user_id', $user_id)
            ->where('removed', 0)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        // Get user notifications count
        $unreadNotifications = Notification::where('user_id', $user_id)
            ->where('is_read', false)
            ->count();
        
        // Get recent messages count (placeholder - update when Message model is implemented)
        $unreadMessages = 0; // Message::where('receiver_id', $user_id)->where('is_read', false)->count();
            
        // Get user profile information
        $userProfile = Profile::where('user_id', $user_id)->first();
        
        // Get user preferences
        $userPreferences = UserPreference::where('user_id', $user_id)->first();
        
        // Get bookmarked opportunities expiring soon (within 7 days)
        $expiringSoonOpportunities = Bookmark::join('opportunities', 'bookmarks.post_id', '=', 'opportunities.id')
            ->where('bookmarks.user_id', $user_id)
            ->where('bookmarks.post_type', 'opp')
            ->where('bookmarks.removed', 0)
            ->where('opportunities.deadline', '>=', Carbon::now()->toDateString())
            ->where('opportunities.deadline', '<=', Carbon::now()->addDays(7)->toDateString())
            ->select('opportunities.*', 'bookmarks.created_at as bookmarked_at')
            ->get();
            
        // Get activity summary for the current month
        $monthlyBookmarks = Bookmark::where('user_id', $user_id)
            ->where('removed', 0)
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();
        
        // Get upcoming reminders (reminders not yet sent and date is in the future)
        $upcomingReminders = Bookmark::with(['opportunity'])
            ->where('user_id', $user_id)
            ->where('removed', 0)
            ->where('post_type', 'opp')
            ->whereNotNull('reminder_date')
            ->where('reminder_sent', false)
            ->where('reminder_date', '>=', Carbon::now())
            ->orderBy('reminder_date', 'asc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'totalBookmarks' => $totalBookmarks,
                    'totalBookmarkedTools' => $totalBookmarkedTools,
                    'upcomingOpportunities' => $upcomingOpportunities,
                    'unreadNotifications' => $unreadNotifications,
                    'unreadMessages' => $unreadMessages,
                    'monthlyBookmarks' => $monthlyBookmarks
                ],
                'recentBookmarks' => $recentBookmarks,
                'expiringSoonOpportunities' => $expiringSoonOpportunities,
                'upcomingReminders' => $upcomingReminders,
                'userProfile' => $userProfile,
                'userPreferences' => $userPreferences,
                'user' => [
                    'id' => Auth::user()->id,
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                    'role' => Auth::user()->role,
                    'created_at' => Auth::user()->created_at,
                    'last_seen_at' => Auth::user()->last_seen_at,
                    'is_online' => Auth::user()->is_online
                ]
            ]
        ]);
    }
    
    //
    function index(){
        $user = Auth::user();
        $activeSubscription = $user->activeSubscription()->with('plan')->first();

        return Inertia::render('Subscriber/Dashboard', [
            'currentPlan' => $activeSubscription ? $activeSubscription->plan->name : 'Free',
            'activeSubscription' => $activeSubscription,
        ]);
    }        
    
    function bookmarkedOpportunities(){
        $user_id = Auth::user()->id;

        $opportunities = Bookmark::with('opportunity')
            ->where('user_id', $user_id)
            ->where('removed', 0)
            ->where('post_type', 'opp')
            ->orderBy('id', 'desc')
            ->paginate(10);

        return Inertia::render('Subscriber/BookmarkedOpportunities', [
            'opportunities' => $opportunities
        ]);
    }

    function exportBookmarkedOpportunities(){
        $user_id = Auth::user()->id;

        $bookmarks = Bookmark::with('opportunity')
            ->where('user_id', $user_id)
            ->where('removed', 0)
            ->where('post_type', 'opp')
            ->orderBy('id', 'desc')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="bookmarked_opportunities_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function() use ($bookmarks) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Title', 'Deadline', 'Status', 'Saved On', 'Reminder', 'URL']);

            foreach ($bookmarks as $bookmark) {
                $opp = $bookmark->opportunity;
                if (!$opp) continue;

                $deadline = $opp->deadline ? \Carbon\Carbon::parse($opp->deadline) : null;
                $now = now()->startOfDay();
                $status = 'Unknown';
                if ($deadline) {
                    $diff = $now->diffInDays($deadline, false);
                    if ($diff < 0) $status = 'Expired';
                    elseif ($diff <= 7) $status = 'Expiring Soon';
                    else $status = 'Active';
                }

                fputcsv($file, [
                    $opp->title,
                    $deadline ? $deadline->format('M d, Y') : 'N/A',
                    $status,
                    \Carbon\Carbon::parse($bookmark->created_at)->format('M d, Y'),
                    $bookmark->reminder_date ? \Carbon\Carbon::parse($bookmark->reminder_date)->format('M d, Y H:i') : 'None',
                    url("/op/{$opp->id}/{$opp->slug}"),
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    function exportBookmarkedTools(){
        $user_id = Auth::user()->id;

        $bookmarks = Bookmark::with('product')
            ->where('user_id', $user_id)
            ->where('removed', 0)
            ->where('post_type', 'tool')
            ->orderBy('id', 'desc')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="bookmarked_tools_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function() use ($bookmarks) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Name', 'Rating', 'Saved On', 'URL']);

            foreach ($bookmarks as $bookmark) {
                $product = $bookmark->product;
                if (!$product) continue;

                fputcsv($file, [
                    $product->product_name,
                    $product->ratings ? $product->ratings . '/5' : 'Unrated',
                    \Carbon\Carbon::parse($bookmark->created_at)->format('M d, Y'),
                    url("/product/{$product->id}/{$product->slug}"),
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    function bookmarkedTools(){
        $user_id = Auth::user()->id;

        $tools = Bookmark::with('product')
            ->where('user_id', $user_id)
            ->where('removed', 0)
            ->where('post_type', 'tool')
            ->orderBy('id', 'desc')
            ->paginate(10);

        return Inertia::render('Subscriber/BookmarkedTools', [
            'tools' => $tools
        ]);
    }

    function savedArticles(){
        $articles = SavedFeedArticle::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Subscriber/SavedArticles', [
            'articles' => $articles,
        ]);
    }

    function deleteSavedArticle($id){
        SavedFeedArticle::where('id', $id)
            ->where('user_id', Auth::id())
            ->delete();

        return response()->json(['status' => 'success', 'message' => 'Article removed']);
    }

    function deleteSavedArticlesBulk(Request $request){
        $request->validate(['ids' => 'required|array']);

        SavedFeedArticle::whereIn('id', $request->ids)
            ->where('user_id', Auth::id())
            ->delete();

        return response()->json(['status' => 'success', 'message' => count($request->ids) . ' articles removed']);
    }

    function notifications(){
        return Inertia::render('Subscriber/Notifications');
    }

    function messages(){
        return Inertia::render('Subscriber/Messages');
    }

    function notificationSettings(){
        return Inertia::render('Subscriber/NotificationSettings');
    }

    function preferences(){
        $user_id = Auth::user()->id;
        
        // Get user preferences or create empty ones
        $userPreferences = UserPreference::where('user_id', $user_id)->first();
        
        // Get all available options
        $categories = Category::orderBy('name')->get();
        $countries = Country::orderBy('name')->get();
        $regions = Region::orderBy('name')->get();
        $brands = BrandLabel::orderBy('name')->get();
        $tags = Tag::orderBy('name')->get();
        
        return Inertia::render('Subscriber/Preferences', [
            'userPreferences' => $userPreferences,
            'categories' => $categories,
            'countries' => $countries,
            'regions' => $regions,
            'brands' => $brands,
            'tags' => $tags,
        ]);
    }

    function updatePreferences(Request $request){
        $user_id = Auth::user()->id;
        
        $validated = $request->validate([
            'opportunity_categories' => 'nullable|array',
            'opportunity_countries' => 'nullable|array',
            'opportunity_regions' => 'nullable|array', 
            'opportunity_brands' => 'nullable|array',
            'product_categories' => 'nullable|array',
            'product_tags' => 'nullable|array',
            'product_brands' => 'nullable|array',
            'email_notifications' => 'boolean',
            'opportunity_notifications' => 'boolean',
            'product_notifications' => 'boolean',
        ]);

        UserPreference::updateOrCreate(
            ['user_id' => $user_id],
            $validated
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Preferences updated successfully!'
        ]);
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

        /**list all bookmarked opportunities */
        public function listBookmarkedOpportunites(Request $request) {
            $user_id = Auth::user()->id;

            $opportunities = Bookmark::with('opportunity')
                ->where('user_id', $user_id)
                ->where('removed', 0)
                ->where('post_type', 'opp')
                ->orderBy('id', 'desc')
                ->paginate(10);
  
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

        public function removeBookmarksBulk(Request $request){
            $ids = $request->input('ids', []);
            $user_id = Auth::user()->id;
            $count = Bookmark::whereIn('id', $ids)
                ->where('user_id', $user_id)
                ->update(['removed' => 1]);
            if($count > 0){
                return response()->json(['status' => 'success', 'message' => $count . ' bookmark(s) removed']);
            }
            return response()->json(['status' => 'error', 'message' => 'No bookmarks removed']);
        }

        /**
         * Get dashboard statistics via API
         */
        public function getDashboardStats(Request $request) {
            $user_id = Auth::user()->id;
            
            // Get total bookmarked tools/products
            $totalBookmarkedTools = Bookmark::where('user_id', $user_id)
                ->where('post_type', 'tool')
                ->where('removed', 0)
                ->count();
            
            // Get upcoming opportunities from bookmarks
            $upcomingOpportunities = Bookmark::join('opportunities', 'bookmarks.post_id', '=', 'opportunities.id')
                ->where('bookmarks.user_id', $user_id)
                ->where('bookmarks.post_type', 'opp')
                ->where('bookmarks.removed', 0)
                ->where('opportunities.deadline', '>=', Carbon::now()->toDateString())
                ->count();

            // Get total bookmarks count
            $totalBookmarks = Bookmark::where('user_id', $user_id)
                ->where('removed', 0)
                ->count();

            // Get opportunities expiring soon (within 7 days)
            $expiringSoon = Bookmark::join('opportunities', 'bookmarks.post_id', '=', 'opportunities.id')
                ->where('bookmarks.user_id', $user_id)
                ->where('bookmarks.post_type', 'opp')
                ->where('bookmarks.removed', 0)
                ->where('opportunities.deadline', '>=', Carbon::now()->toDateString())
                ->where('opportunities.deadline', '<=', Carbon::now()->addDays(7)->toDateString())
                ->count();
            
            return response()->json([
                'totalBookmarkedTools' => $totalBookmarkedTools,
                'upcomingOpportunities' => $upcomingOpportunities,
                'totalBookmarks' => $totalBookmarks,
                'expiringSoon' => $expiringSoon
            ]);
        }

        /**
         * Get bookmarked tools/products
         */
        public function listBookmarkedTools(Request $request) {
            $user_id = Auth::user()->id;

            $tools = Bookmark::with('product')
            ->where('user_id', $user_id)
            ->where('post_type', 'tool')
            ->where('removed', 0)
            ->orderBy('id', 'desc')->paginate('5');
  
            return response()->json($tools);
        }

        /**
         * Get notifications
         */
        public function getNotifications(Request $request) {
            $user_id = Auth::user()->id;
            $filter = $request->get('filter', 'all');

            $query = Notification::where('user_id', $user_id)
                ->orderBy('created_at', 'desc');

            if ($filter === 'unread') {
                $query->where('is_read', false);
            } elseif ($filter === 'read') {
                $query->where('is_read', true);
            }

            if ($request->has('limit')) {
                $query->limit((int) $request->get('limit'));
            }

            $notifications = $query->get();
            return response()->json($notifications);
        }

        /**
         * Mark notification as read
         */
        public function markNotificationAsRead(Request $request, $id) {
            $user_id = Auth::user()->id;
            
            $notification = Notification::where('id', $id)
                ->where('user_id', $user_id)
                ->first();

            if ($notification) {
                $notification->markAsRead();
                return response()->json(['status' => 'success']);
            }

            return response()->json(['status' => 'error'], 404);
        }

        /**
         * Mark all notifications as read
         */
        public function markAllNotificationsAsRead(Request $request) {
            $user_id = Auth::user()->id;
            
            Notification::where('user_id', $user_id)
                ->where('is_read', false)
                ->update([
                    'is_read' => true,
                    'read_at' => Carbon::now()
                ]);

            return response()->json(['status' => 'success']);
        }

        /**
         * Get messages
         */
        public function getMessages(Request $request) {
            $user_id = Auth::user()->id;
            $type = $request->get('type', 'inbox');

            if ($type === 'sent') {
                $messages = Message::with('recipient')
                    ->sent($user_id)
                    ->orderBy('created_at', 'desc')
                    ->get();
            } else {
                $messages = Message::with('sender')
                    ->inbox($user_id)
                    ->orderBy('created_at', 'desc')
                    ->get();
            }

            return response()->json($messages);
        }

        /**
         * Send message
         */
        public function sendMessage(Request $request) {
            $validator = Validator::make($request->all(), [
                'recipient_email' => 'required|email|exists:users,email',
                'subject' => 'required|string|max:255',
                'message' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $recipient = \App\Models\User::where('email', $request->recipient_email)->first();

            $message = Message::create([
                'sender_id' => Auth::user()->id,
                'recipient_id' => $recipient->id,
                'subject' => $request->subject,
                'message' => $request->message,
                'message_type' => 'user'
            ]);

            return response()->json(['status' => 'success', 'message' => $message]);
        }

        /**
         * Mark message as read
         */
        public function markMessageAsRead(Request $request, $id) {
            $user_id = Auth::user()->id;
            
            $message = Message::where('id', $id)
                ->where('recipient_id', $user_id)
                ->first();

            if ($message) {
                $message->markAsRead();
                return response()->json(['status' => 'success']);
            }

            return response()->json(['status' => 'error'], 404);
        }

        /**
         * Delete message
         */
        public function deleteMessage(Request $request, $id) {
            $user_id = Auth::user()->id;
            
            $message = Message::where('id', $id)
                ->where(function($query) use ($user_id) {
                    $query->where('sender_id', $user_id)
                          ->orWhere('recipient_id', $user_id);
                })
                ->first();

            if ($message) {
                if ($message->sender_id == $user_id) {
                    $message->update(['is_deleted_by_sender' => true]);
                } else {
                    $message->update(['is_deleted_by_recipient' => true]);
                }
                return response()->json(['status' => 'success']);
            }

            return response()->json(['status' => 'error'], 404);
        }

        /**
         * Set reminder for bookmark
         */
        public function setBookmarkReminder(Request $request)
        {
            $user_id = Auth::user()->id;
            
            $validator = Validator::make($request->all(), [
                'bookmark_id' => 'required|integer|exists:bookmarks,id',
                'reminder_date' => 'required|date|after:now',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error', 
                    'message' => 'Invalid data provided'
                ], 400);
            }

            $bookmark = Bookmark::where('id', $request->bookmark_id)
                ->where('user_id', $user_id)
                ->with(['opportunity', 'product', 'event'])
                ->first();

            if (!$bookmark) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Bookmark not found'
                ], 404);
            }

            $bookmark->update([
                'reminder_date' => $request->reminder_date,
                'reminder_sent' => false
            ]);

            // Send notification (email + push + database)
            $user = Auth::user();
            $related = $bookmark->bookmarkable;
            $user->notify(new ReminderNotification(
                'set',
                $related->title ?? 'Unknown',
                $request->reminder_date,
                $bookmark->id,
                $bookmark->post_id,
                $related->slug ?? null
            ));

            return response()->json([
                'status' => 'success', 
                'message' => 'Reminder set successfully'
            ]);
        }

        /**
         * Update reminder for bookmark
         */
        public function updateBookmarkReminder(Request $request)
        {
            $user_id = Auth::user()->id;
            
            $validator = Validator::make($request->all(), [
                'bookmark_id' => 'required|integer|exists:bookmarks,id',
                'reminder_date' => 'required|date|after:now',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error', 
                    'message' => 'Invalid data provided'
                ], 400);
            }

            $bookmark = Bookmark::where('id', $request->bookmark_id)
                ->where('user_id', $user_id)
                ->with(['opportunity', 'product', 'event'])
                ->first();

            if (!$bookmark) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Bookmark not found'
                ], 404);
            }

            $bookmark->update([
                'reminder_date' => $request->reminder_date,
                'reminder_sent' => false
            ]);

            // Send notification (email + push + database)
            $user = Auth::user();
            $related = $bookmark->bookmarkable;
            $user->notify(new ReminderNotification(
                'updated',
                $related->title ?? 'Unknown',
                $request->reminder_date,
                $bookmark->id,
                $bookmark->post_id,
                $related->slug ?? null
            ));

            return response()->json([
                'status' => 'success', 
                'message' => 'Reminder updated successfully'
            ]);
        }

        /**
         * Remove reminder for bookmark
         */
        public function removeBookmarkReminder(Request $request)
        {
            $user_id = Auth::user()->id;
            
            $validator = Validator::make($request->all(), [
                'bookmark_id' => 'required|integer|exists:bookmarks,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error', 
                    'message' => 'Invalid data provided'
                ], 400);
            }

            $bookmark = Bookmark::where('id', $request->bookmark_id)
                ->where('user_id', $user_id)
                ->first();

            if (!$bookmark) {
                return response()->json([
                    'status' => 'error', 
                    'message' => 'Bookmark not found'
                ], 404);
            }

            $bookmark->update([
                'reminder_date' => null,
                'reminder_sent' => false
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Reminder removed successfully'
            ]);
        }

        public function subscribePush(Request $request)
        {
            $validator = Validator::make($request->all(), [
                'endpoint' => 'required|url',
                'keys.p256dh' => 'required|string',
                'keys.auth' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $userId = Auth::user()->id;

            PushSubscription::updateOrCreate(
                ['endpoint' => $request->endpoint, 'user_id' => $userId],
                [
                    'p256dh_key' => $request->input('keys.p256dh'),
                    'auth_token' => $request->input('keys.auth'),
                    'content_encoding' => $request->input('content_encoding', 'aesgcm'),
                ]
            );

            return response()->json(['status' => 'success']);
        }

        public function unsubscribePush(Request $request)
        {
            $validator = Validator::make($request->all(), [
                'endpoint' => 'required|url',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            PushSubscription::where('user_id', Auth::user()->id)
                ->where('endpoint', $request->endpoint)
                ->delete();

            return response()->json(['status' => 'success']);
        }
}
