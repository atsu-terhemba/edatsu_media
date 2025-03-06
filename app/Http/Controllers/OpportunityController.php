<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\Request;
use App\Models\Oppty;
use Illuminate\Support\Carbon;
use App\Models\Bookmark;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use App\Models\Category;
use App\Models\BrandLabel;
use App\Models\Tag;
use App\Models\Region;
use App\Models\Continent;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class OpportunityController extends Controller
{
    //...

    function initOpportunitiesPage(){
        $categories = Category::all();
        $countries = Country::all();
        $continents = Continent::all();
        $brands = BrandLabel::all();

        return Inertia::render("Opportunities", [
            "categories" => $categories, 
            "countries" => $countries,
            "continents" => $continents,
            "brands" => $brands
        ]);
    }





    function show(){
    // Define a cache key
    $cacheKey = 'create_opportunity_data';

    // Check if the data is already cached
    if (Cache::has($cacheKey)) {
        // Retrieve the data from the cache
        $data = Cache::get($cacheKey);
    } else {
        // If not cached, fetch the data from the database
        $categories = Category::all();
        $brand_label = BrandLabel::all();
        $tags = Tag::all();
        $regions = Region::all();
        $countries = Country::all();
        $continents = Continent::all();

        // Store the data in the cache for future requests
        Cache::put($cacheKey, [
            "categories" => $categories, 
            "brand_label" => $brand_label,
            "tags" => $tags,
            "regions" => $regions,
            "countries" => $countries,
            "continents" => $continents
        ], now()->addHours(24)); // Cache for 1 hour

        // Retrieve the data from the cache
        $data = Cache::get($cacheKey);
    }

    return Inertia::render("Admin/CreateOpportunity", $data);

    }

    // function edit(Request $request, $id){
    //     $categories = Category::all();
    //     $brand_label = BrandLabel::all();
    //     $tags = Tag::all();
    //     $regions = Region::all();
    //     $countries = Country::all();
    //     $continents = Continent::all();

    //     $opp_posts = Oppty::where('deleted', 0)->orderByDesc('id')->paginate(10);
    //     $edits = Oppty::select('*')->where('id', '=', $id)->where('u_id', '=', $request->user()->id)->get();
    //     return view("admin.opportunity_page", [
    //     "opp_posts" => $opp_posts, "edits"=> $edits, 
    //     "categories" => $categories, 
    //     "brand_label" => $brand_label,
    //     "tags" => $tags,
    //     "regions" => $regions,
    //     "countries" => $countries,
    //     "continents" => $continents
    // ]);
    // }



    // function edit(Request $request, $id) {
    //     $categories = Category::all();
    //     $brand_label = BrandLabel::all();
    //     $tags = Tag::all();
    //     $regions = Region::all();
    //     $countries = Country::all();
    //     $continents = Continent::all();
    
    //     // Fetch the opportunity post
    //     $opportunity = Oppty::where('deleted', 0)
    //                         ->where('id', $id)
    //                         ->where('u_id', $request->user()->id)
    //                         ->firstOrFail();
    
    //     // Retrieve selected relational data
    //     $selectedCategories = $opportunity->categories()->pluck('category_id')->toArray();
    //     $selectedBrandLabels = $opportunity->brandLabels()->pluck('brand_label_id')->toArray();
    //     $selectedTags = $opportunity->tags()->pluck('tag_id')->toArray();
    //     $selectedRegions = $opportunity->regions()->pluck('region_id')->toArray();
    //     $selectedCountries = $opportunity->countries()->pluck('country_id')->toArray();
    //     $selectedContinents = $opportunity->continents()->pluck('continent_id')->toArray();
    
    //     // Convert the selected IDs to JSON format
    //     $selectedData = [
    //         'category' => json_encode(array_map(function($id) {
    //             return ['id' => $id]; // Assuming you only need IDs
    //         }, $selectedCategories)),
    //         'brand_labels' => json_encode(array_map(function($id) {
    //             return ['id' => $id];
    //         }, $selectedBrandLabels)),
    //         'tags' => json_encode(array_map(function($id) {
    //             return ['id' => $id];
    //         }, $selectedTags)),
    //         'region' => json_encode(array_map(function($id) {
    //             return ['id' => $id];
    //         }, $selectedRegions)),
    //         'country' => json_encode(array_map(function($id) {
    //             return ['id' => $id];
    //         }, $selectedCountries)),
    //         'continent' => json_encode(array_map(function($id) {
    //             return ['id' => $id];
    //         }, $selectedContinents)),
    //     ];
    
    //     // Pass data to the view
    //     return view("admin.opportunity_page", [
    //         "opp_posts" => Oppty::where('deleted', 0)->orderByDesc('id')->paginate(10),
    //         "edits" => $opportunity,
    //         "categories" => $categories,
    //         "brand_label" => $brand_label,
    //         "tags" => $tags,
    //         "regions" => $regions,
    //         "countries" => $countries,
    //         "continents" => $continents,
    //         "selectedData" => $selectedData, // Pass the selected data
    //     ]);
    // }
    

    function edit(Request $request, $id) {
        $categories = Category::all();
        $brand_label = BrandLabel::all();
        $tags = Tag::all();
        $regions = Region::all();
        $countries = Country::all();
        $continents = Continent::all();
    
        // Fetch the opportunity post
        $opportunity = Oppty::where('deleted', 0)
                            ->where('id', $id)
                            ->where('u_id', $request->user()->id)
                            ->firstOrFail();
    
        // Retrieve selected relational data by joining with respective tables
        $selectedCategories = DB::table('category_selections')
            ->join('categories', 'category_selections.category_id', '=', 'categories.id')
            ->where('category_selections.post_id', $id)
            ->select('category_selections.category_id as id', 'categories.name')
            ->get();
    
        $selectedBrandLabels = DB::table('brand_labels_selections')
            ->join('brand_labels', 'brand_labels_selections.brand_label_id', '=', 'brand_labels.id')
            ->where('brand_labels_selections.post_id', $id)
            ->select('brand_labels_selections.brand_label_id as id', 'brand_labels.name')
            ->get();
    
        $selectedTags = DB::table('tags_selections')
            ->join('tags', 'tags_selections.tag_id', '=', 'tags.id')
            ->where('tags_selections.post_id', $id)
            ->select('tags_selections.tag_id as id', 'tags.name')
            ->get();
    
        $selectedRegions = DB::table('region_selections')
            ->join('regions', 'region_selections.region_id', '=', 'regions.id')
            ->where('region_selections.post_id', $id)
            ->select('region_selections.region_id as id', 'regions.name')
            ->get();
    
        $selectedCountries = DB::table('country_selections')
            ->join('countries', 'country_selections.country_id', '=', 'countries.id')
            ->where('country_selections.post_id', $id)
            ->select('country_selections.country_id as id', 'countries.name')
            ->get();

    
        $selectedContinents = DB::table('continent_selections')
            ->join('continents', 'continent_selections.continent_id', '=', 'continents.id')
            ->where('continent_selections.post_id', $id)
            ->select('continent_selections.continent_id as id', 'continents.name')
            ->get();
    
        // Prepare selected data in the required format
        $selectedData = (Object) [
            'category' => $selectedCategories->toJson(),
            'brand_labels' => $selectedBrandLabels->toJson(),
            'tags' => $selectedTags->toJson(),
            'region' => $selectedRegions->toJson(),
            'country' => $selectedCountries->toJson(),
            'continent' => $selectedContinents->toJson(),
        ];
    
        // Pass data to the view
        return view("admin.opportunity_page", [
            // "opp_posts" => Oppty::where('deleted', 0)->orderByDesc('id')->paginate(10),
            "edits" => $opportunity,
            "categories" => $categories,
            "brand_label" => $brand_label,
            "tags" => $tags,
            "regions" => $regions,
            "countries" => $countries,
            "continents" => $continents,
            "selectedData" => $selectedData, // Pass the selected data
        ]);
    }
    

    function createSlug($title) {
        // Convert to lowercase
        $slug = strtolower($title);
        
        // Replace non-alphanumeric characters with hyphens
        $slug = preg_replace('/[^a-z0-9-]/', '-', $slug);
        
        // Remove consecutive hyphens
        $slug = preg_replace('/-+/', '-', $slug);
        
        // Trim hyphens from the beginning and end
        $slug = trim($slug, '-');
        
        return $slug;
    }



function store(Request $request)
{

    //dd($request->input());

    // $categories = extractSelectData($request->category);

    //dd($categories);
    
    // Define custom validation rules
    $rules = [
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'source_url' => 'required|url|max:255',
        'deadline' => 'nullable|date|after_or_equal:today',
        'meta_description' => 'nullable|string',
        'meta_keywords' => 'nullable|string',
        'post_id' => 'nullable|integer|exists:opportunities,id',
    ];

    // Validate the request
    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => $validator->errors()->first()
        ], 422);
    }

    $postId = $request->input('post_id');
    $signature = $request->input('signature');
    $isEditing = false;

    // Verify the HMAC signature if post_id is provided
    // if ($postId && !hash_equals($signature, hash_hmac('sha256', $postId, config('app.key')))) {
    //     return response()->json([
    //         'success' => false,
    //         'message' => 'Invalid signature'
    //     ], 422);
    // }

    $op = $postId ? Oppty::findOrFail($postId) : new Oppty();

    // Check user authorization for existing posts
    if ($postId && $op->u_id !== Auth::id()) {
        $isEditing = true;
        return response()->json(["success" => false, "message" => "Unauthorized Access"], 403);
    }

    // Handle file upload
    if ($request->hasFile('cover_img') && $request->file('cover_img')->isValid()) {
        $file = $request->file('cover_img');
        $hashedFileName = $this->generateUniqueFileName($file);
        $file->storeAs('public/uploads/channels', $hashedFileName);
        $op->cover_img = $hashedFileName;
    }

    // Populate model attributes
    $op->u_id = Auth::id();
    $op->user_role = Auth::user()->role;
    $op->slug = $this->createSlug($request->title);

    // Store the data in the database
    $op->title = $request->title;
    $op->description = $request->description;
    $op->deadline = $request->deadline;
    $op->source_url = $request->source_url;
    $op->direct_link = $request->direct_link;
    $op->meta_description = $request->meta_description;
    $op->meta_keywords = $request->meta_keywords;

    $op->save();

    // Get the ID of the newly created or updated post
    $postId = $op->id;

    $categories = extractSelectData($request->categories);
    $brand_labels = extractSelectData($request->brand_labels);
    $tags = extractSelectData($request->tags);
    $regions = extractSelectData($request->regions);
    $countries = extractSelectData($request->countries);
    $continents = extractSelectData($request->continents);


    // Helper function to delete and insert relational data
    $manageRelationalData = function ($table, $columnName, $data) use ($postId, $request) {
        // First, delete existing records for the post in this table
        DB::table($table)->where('post_id', $postId)->delete();
        // Insert new data
        if (empty($data)) return;
        // Decode JSON string and extract IDs

        $decodedData = json_decode($data, true);

        foreach ($decodedData as $id) {
            if (isset($id) && !empty($id)) {
                $insertData[] = [
                    'user_id' => $request->user()->id,
                    'post_id' => $postId,
                    $columnName => $id, // Use 'id' from the new format
                    'post_type' => 'opportunity',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        if (!empty($insertData)) {
            DB::table($table)->insert($insertData);
        }
    };

    // Manage relational data for each attribute
    $relationalData = [
        'category_selections' => ['category_id', $categories],
        'brand_labels_selections' => ['brand_label_id', $brand_labels],
        'tags_selections' => ['tag_id', $tags],
        'region_selections' => ['region_id', $regions],
        'country_selections' => ['country_id', $countries],
        'continent_selections' => ['continent_id', $continents],
    ];

    // dd($brand_labels);

    // Loop through each relational data table and update it
    foreach ($relationalData as $table => $data) {
        $manageRelationalData($table, $data[0], $data[1]);
    }

    if($isEditing){
        $post_message = "Post Updated Successful";
    }else{
        $post_message = "Post Successful";
    }
    return response()->json([
        "success" => true,
        "message" => $post_message,
    ]);
}



    
    // Helper function to generate a unique file name
    private function generateUniqueFileName($file)
    {
        $originalFileName = $file->getClientOriginalName();
        $fileExtension = $file->getClientOriginalExtension();
        $uniqueHash = hash('sha256', $originalFileName . time());
        return $uniqueHash . '.' . $fileExtension;
    }
   
   
   
    function delete(Request $request, $id){
        Oppty::where('id', $id)
        ->where('u_id', $request->user()->id)
        ->update
        ([
            'deleted' => 1
        ]);

        return redirect('admin-post-opportunity')->with('status', 'Post Deleted!');
    }

    /***
     * bookmark opportunity
     */
    public function bookmarkOpportunity(Request $request){
        if(Auth::check()){
            $opp_id = $request->post('id'); 
            $user_id = $request->user()->id;
            //validate entries 
            $validator = Validator::make($request->all(), [
                'id' => 'required|integer', 
                "type" => "required",
            ]);
            //handle validation errors
            if($validator->fails()){
                return response()->json(
                    ['status' => 'error', 'message'=> 'Oops! Something went wrong']
                );
            }
            //init bookmark
            $bookmark = new Bookmark;

            //check if post_id already exist in database. 
            if($bookmark->where('post_id', $opp_id)
            ->where('user_id', $user_id)
            ->where('post_type', '=', 'opp')
            ->exists()){
                //check if its removed, if removed, update deleted to 0 to add it back
                $is_deleted = $bookmark->where('post_id', $opp_id)
                ->where('user_id', $user_id)
                ->where('post_type', '=', 'opp')
                ->where('deleted', 1);

                if($is_deleted->count() > 0){
                    //update record
                    $restore_bookmark = $bookmark->where('post_id', $opp_id)
                    ->where('user_id', $user_id)
                    ->where('post_type', '=', 'opp')
                    ->update(['deleted' => 0]);

                    if($restore_bookmark > 0){
                        return response()->json(['status' => 'success', 'message' => "Bookmarked"]);
                    }
                }
                return response()->json(['status' => 'error', 'message'=> 'Already Bookmarked']);
            }

            //save data...
            $bookmark->user_id = $user_id;
            $bookmark->post_id = $opp_id;
            $bookmark->post_type = 'opp';
            $bookmark->save();

            return response()->json(['status' => 'success', 'message' => "Bookmarked"]);
        }else{
            return response()->json(['status' => 'warning', 'message' => "Login to Bookmark"]);
        }
     }


     /**
      * display all opportunities 
      */
    public function fetchAllOpportunities()
    {
        $allOppty = Oppty::orderBy('id', 'desc')
            ->get()
            ->map(function($oppty) {
                $current_date = Carbon::now();
                $status = ($current_date > $oppty->deadline) ? 'Expired' : 'Active';
                
                return [
                    'id' => $oppty->id,
                    'title' => $oppty->title,
                    'views' => $oppty->views,
                    'created_at' => $oppty->created_at->format('Y-m-d'),
                    'deadline' => $oppty->deadline,
                    'status' => $status,
                    // Add any other fields you need
                ];
            });
    
        return response()->json(['data' => $allOppty]);
    }


    public function showOpportunities(){
      
        return view('admin.allOppty'); 
    }


}
