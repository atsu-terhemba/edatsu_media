<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\Request;
use App\Models\Oppty;
use Illuminate\Support\Carbon;
use App\Models\Bookmark;
use Illuminate\Support\Facades\Auth;
use App\Services\PreferenceNotificationService;
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
use Illuminate\Support\Facades\Redis;


class OpportunityController extends Controller
{
    //...

    public function __construct(Type $var = null) {
        $ttl = 86400; // 24 hours in seconds
        Cache::remember('categories', $ttl, function () {
            return Category::all();
        });

        // Cache countries
        Cache::remember('countries', $ttl, function () {
            return Country::all();
        });

        // Cache continents
        Cache::remember('continents', $ttl, function () {
            return Continent::all();
        });

        // Cache brands
        Cache::remember('brands', $ttl, function () {
            return BrandLabel::all();
        });
    }

    function initOpportunitiesPage(){
  
        $categories = Cache::get('categories');
        $countries = Cache::get('countries');
        $continents = Cache::get('continents');
        $brands = Cache::get('brands');

        return Inertia::render("Opportunities", [
            "categories" => $categories, 
            "countries" => $countries,
            "continents" => $continents,
            "brands" => $brands
        ]);
    }


    function publish($id){
        // Check if the user is authenticated
        if(!Auth::check()){
            return response()->json(['status' => 'error', 'message' => 'Unauthorized']);
        }
        $op = Oppty::find($id);
        if($op){
            $op->status = 'published';
            $op->save();
            return response()->json(['status' => 'success', 'message' => 'Published']);
        }else{
            return response()->json(['status' => 'error', 'message' => 'Opportunity Not Found']);
        }
    }

    function draft($id){
        // Check if the user is authenticated
        if(!Auth::check()){
            return response()->json(['status' => 'error', 'message' => 'Unauthorized']);
        }
        $op = Oppty::find($id);
        if($op){
            $op->status= 'draft';
            $op->save();
            return response()->json(['status' => 'success', 'message' => 'Saved to Draft']);
        }else{
            return response()->json(['status' => 'error', 'message' => 'Opportunity Not Found']);
        }
    }

    function archive($id){
        if(!Auth::check()){
            return response()->json(['status' => 'error', 'message' => 'Unauthorized']);
        }
        $op = Oppty::find($id);
        if($op){
            $op->status = 'archived';
            $op->save();
            return response()->json(['status' => 'success', 'message' => 'Archived']);
        }else{
            return response()->json(['status' => 'error', 'message' => 'Opportunity Not Found']);
        }
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


    public function readOpportunity(Request $request, $id, $title = null)
    {
        $user_id = null;
        if(Auth::check()){
            $user_id = Auth::id();
        }

        /**
         * @var mixed
         * show all data associated with this opportunites.
         */
        $opp_posts = DB::table('opportunities')
        ->where('opportunities.id', $id)
        ->leftJoin('category_selections', 'category_selections.post_id', '=', 'opportunities.id')
        ->leftJoin('categories', 'categories.id', '=', 'category_selections.category_id')
        ->leftJoin('brand_labels_selections', 'brand_labels_selections.post_id', '=', 'opportunities.id')
        ->leftJoin('brand_labels', 'brand_labels.id', '=', 'brand_labels_selections.brand_label_id')
        ->leftJoin('continent_selections', 'continent_selections.post_id', '=', 'opportunities.id')
        ->leftJoin('continents', 'continents.id', '=', 'continent_selections.continent_id')
        ->leftJoin('country_selections', 'country_selections.post_id', '=', 'opportunities.id')
        ->leftJoin('countries', 'countries.id', '=', 'country_selections.country_id')
        ->leftJoin('region_selections', 'region_selections.post_id', '=', 'opportunities.id')
        ->leftJoin('regions', 'regions.id', '=', 'region_selections.region_id')
        ->leftJoin('tags_selections', 'tags_selections.post_id', '=', 'opportunities.id')
        ->leftJoin('tags', 'tags.id', '=', 'tags_selections.tag_id')
        ->leftJoin('bookmarks', function($join) use ($user_id) {
            $join->on('bookmarks.post_id', '=', 'opportunities.id')
                ->where('bookmarks.user_id', '=', $user_id)
                ->where('bookmarks.post_type', '=', 'opp')
                ->where('bookmarks.removed', '!=', 1);
        })
        ->select('opportunities.id', 
                'opportunities.title', 
                'opportunities.deadline',
                'opportunities.slug',
                'opportunities.description',
                'opportunities.meta_description',
                'opportunities.meta_keywords',
                'opportunities.cover_img', 
                'opportunities.created_at',
                'opportunities.source_url',
                'opportunities.direct_link',
                DB::raw('GROUP_CONCAT(DISTINCT categories.id) as category_ids'),
                DB::raw('GROUP_CONCAT(DISTINCT categories.name) as categories'),
                DB::raw('GROUP_CONCAT(DISTINCT categories.slug) as category_slugs'),
                DB::raw('GROUP_CONCAT(DISTINCT brand_labels.id) as brand_label_ids'),
                DB::raw('GROUP_CONCAT(DISTINCT brand_labels.name) as brand_labels'),
                DB::raw('GROUP_CONCAT(DISTINCT brand_labels.slug) as brand_label_slugs'),
                DB::raw('GROUP_CONCAT(DISTINCT continents.id) as continent_ids'),
                DB::raw('GROUP_CONCAT(DISTINCT continents.name) as continents'),
                DB::raw('GROUP_CONCAT(DISTINCT continents.slug) as continent_slugs'),
                DB::raw('GROUP_CONCAT(DISTINCT countries.id) as country_ids'),
                DB::raw('GROUP_CONCAT(DISTINCT countries.name) as countries'),
                DB::raw('GROUP_CONCAT(DISTINCT countries.slug) as country_slugs'),
                DB::raw('GROUP_CONCAT(DISTINCT regions.id) as region_ids'),
                DB::raw('GROUP_CONCAT(DISTINCT regions.name) as regions'),
                DB::raw('GROUP_CONCAT(DISTINCT regions.slug) as region_slugs'),
                DB::raw('GROUP_CONCAT(DISTINCT tags.id) as tag_ids'),
                DB::raw('GROUP_CONCAT(DISTINCT tags.name) as tags'),
                DB::raw('GROUP_CONCAT(DISTINCT tags.slug) as tag_slugs'),
                DB::raw('CASE WHEN bookmarks.post_type = \'opp\' THEN 1 ELSE 0 END as is_bookmarked'))
        ->groupBy('opportunities.id', 
                'opportunities.title', 
                'opportunities.deadline',
                'opportunities.slug',
                'opportunities.description',
                'opportunities.meta_description',
                'opportunities.meta_keywords',
                'opportunities.cover_img', 
                'opportunities.created_at', 
                'opportunities.source_url',
                'opportunities.direct_link', 
                'bookmarks.post_type')
        ->first();

    // Debug: Check what we got from the query
    if (!$opp_posts) {
        // Try a simpler query to see if the opportunity exists
        $simple_opp = DB::table('opportunities')->where('id', $id)->first();
        if ($simple_opp) {
            return response()->json(['debug' => 'Complex query failed but simple query works', 'simple_opp' => $simple_opp]);
        } else {
            abort(404, 'Opportunity not found');
        }
    }

    
        /**
         * @var mixed
         * show category count that have not expired
         */
    //     $categoriesWithCounts = DB::table('category_selections')
    //     ->join('opportunities', 'opportunities.id', '=', 'category_selections.post_id')
    //     ->join('categories', 'categories.id', '=', 'category_selections.category_id')
    //     ->where('opportunities.deadline', '>', now())
    //     ->select(
    //         'categories.id as category_id',
    //         'categories.name as category_name',
    //         'categories.slug as category_slug',
    //         DB::raw('COUNT(DISTINCT opportunities.id) as future_opportunity_count')
    //     )
    //     ->groupBy('categories.id', 'categories.name', 'categories.slug')
    //     ->orderByDesc('future_opportunity_count')
    //     ->orderBy('category_name')
    //     ->get();
    
    // The ID of the post the user is currently viewing
    $current_post_id = $id; 
    
    function prepareIdList($idString) {
        $ids = array_filter(explode(',', $idString)); // Remove empty values
        return !empty($ids) ? implode(',', $ids) : 'NULL';
    }
    
    $category_ids = prepareIdList($opp_posts->category_ids);
    $brand_label_ids = prepareIdList($opp_posts->brand_label_ids);
    $continent_ids = prepareIdList($opp_posts->continent_ids);
    $country_ids = prepareIdList($opp_posts->country_ids);
    $region_ids = prepareIdList($opp_posts->region_ids);
    $tag_ids = prepareIdList($opp_posts->tag_ids);
    
    $similarPosts = DB::table('opportunities as o')
        ->leftJoin('category_selections as cs', 'cs.post_id', '=', 'o.id')
        ->leftJoin('categories as c', 'c.id', '=', 'cs.category_id')
        ->leftJoin('brand_labels_selections as bls', 'bls.post_id', '=', 'o.id')
        ->leftJoin('continent_selections as cts', 'cts.post_id', '=', 'o.id')
        ->leftJoin('continents as cont', 'cont.id', '=', 'cts.continent_id')
        ->leftJoin('country_selections as cos', 'cos.post_id', '=', 'o.id')
        ->leftJoin('countries as cou', 'cou.id', '=', 'cos.country_id')
        ->leftJoin('region_selections as rs', 'rs.post_id', '=', 'o.id')
        ->leftJoin('regions as r', 'r.id', '=', 'rs.region_id')
        ->leftJoin('tags_selections as ts', 'ts.post_id', '=', 'o.id')
        ->where('o.id', '!=', $current_post_id) // Exclude the current post
        ->where('o.deadline', '>', now()) 
        ->where('o.deleted', '!=', 1)
        ->where(function ($query) use ($category_ids, $brand_label_ids, $continent_ids, $country_ids, $region_ids, $tag_ids) {
            if ($category_ids !== 'NULL') $query->orWhereIn('cs.category_id', explode(',', $category_ids));
            if ($brand_label_ids !== 'NULL') $query->orWhereIn('bls.brand_label_id', explode(',', $brand_label_ids));
            if ($continent_ids !== 'NULL') $query->orWhereIn('cts.continent_id', explode(',', $continent_ids));
            if ($country_ids !== 'NULL') $query->orWhereIn('cos.country_id', explode(',', $country_ids));
            if ($region_ids !== 'NULL') $query->orWhereIn('rs.region_id', explode(',', $region_ids));
            if ($tag_ids !== 'NULL') $query->orWhereIn('ts.tag_id', explode(',', $tag_ids));
        })
        ->select('o.id', 
                    'o.title',
                    'o.deadline',
                    'o.slug',
                    'o.cover_img',
                    'o.description',
                    'o.created_at', 
                    'o.updated_at',
            DB::raw("SUM(
                CASE 
                    WHEN " . ($category_ids !== 'NULL' ? "cs.category_id IN ($category_ids)" : "FALSE") . " THEN 2
                    WHEN " . ($brand_label_ids !== 'NULL' ? "bls.brand_label_id IN ($brand_label_ids)" : "FALSE") . " THEN 2
                    WHEN " . ($continent_ids !== 'NULL' ? "cts.continent_id IN ($continent_ids)" : "FALSE") . " THEN 1
                    WHEN " . ($country_ids !== 'NULL' ? "cos.country_id IN ($country_ids)" : "FALSE") . " THEN 2
                    WHEN " . ($region_ids !== 'NULL' ? "rs.region_id IN ($region_ids)" : "FALSE") . " THEN 1
                    WHEN " . ($tag_ids !== 'NULL' ? "ts.tag_id IN ($tag_ids)" : "FALSE") . " THEN 1
                    ELSE 0
                END
            ) as similarity_score"),
            DB::raw('GROUP_CONCAT(DISTINCT c.name) as categories'),
            DB::raw('GROUP_CONCAT(DISTINCT r.name) as regions'),
            DB::raw('GROUP_CONCAT(DISTINCT cou.name) as countries'),
            DB::raw('GROUP_CONCAT(DISTINCT cont.name) as continents')
        )
        ->groupBy('o.id', 'o.title', 
        'o.deadline', 
        'o.slug',
        'o.cover_img',
        'o.description', 
        'o.created_at', 
        'o.updated_at') // Add all non-aggregated columns from 'o.*'
        ->orderByDesc('similarity_score')
        ->orderByDesc('o.created_at')
        ->limit(6)
        ->get();
    
        /***count comments from this id*/
        $total_comments = DB::table('comments')
        ->where('comments.commentable_id', '=', $current_post_id)
        ->count();
    
        if (!$opp_posts) {
            abort(404);
        }
    
        // Check if the user has already viewed this post in the current session
        $viewedPosts = $request->session()->get('viewed_posts', []);
    
        if (!in_array($id, $viewedPosts)) {
            // Increment views if not previously viewed
            DB::table('opportunities')->where('id', $id)->increment('views');
            // Store the post ID in the session
            $request->session()->push('viewed_posts', $id);
        }
    
        // return Inertia::render("Opp-view", [
        //     'opp_posts' => $opp_posts,
        //     'categoriesWithCounts' => $categoriesWithCounts,
        //     'similarPosts' => $similarPosts,
        //     'total_comments' => $total_comments,
        // ]);

        return Inertia::render("Opp-view", [
            'opp_posts' => $opp_posts,
            'similarPosts' => $similarPosts,
            'total_comments' => $total_comments,
        ]);
        
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
        // Fetch all cached categories, brand labels, tags, regions, countries, and continents
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
        // $selectedData = (Object) [
        //     'category' => $selectedCategories->toJson(),
        //     'brand_labels' => $selectedBrandLabels->toJson(),
        //     'tags' => $selectedTags->toJson(),
        //     'region' => $selectedRegions->toJson(),
        //     'country' => $selectedCountries->toJson(),
        //     'continent' => $selectedContinents->toJson(),
        // ];

        $selectedData = (object) [
            'category' => $selectedCategories,
            'brand_labels' => $selectedBrandLabels,
            'tags' => $selectedTags,
            'region' => $selectedRegions,
            'country' => $selectedCountries,
            'continent' => $selectedContinents,
        ];
        

    
        // Pass data to the view
        return Inertia::render("Admin/CreateOpportunity", [
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
        $file->storeAs('public/uploads/opp', $hashedFileName, 'public');
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

    // Send notifications for new opportunities (not for updates)
    if (!$isEditing) {
        try {
            $notificationService = new PreferenceNotificationService();
            
            // Extract IDs from the saved data
            $categoryIds = $notificationService->extractIds(null, 'category_selections', 'category_id', $postId);
            $countryIds = $notificationService->extractIds(null, 'country_selections', 'country_id', $postId);
            $regionIds = $notificationService->extractIds(null, 'region_selections', 'region_id', $postId);
            $brandIds = $notificationService->extractIds(null, 'brand_labels_selections', 'brand_label_id', $postId);
            
            // Send notifications to users with matching preferences
            $notificationService->notifyOpportunityMatch($op, $categoryIds, $countryIds, $regionIds, $brandIds);
        } catch (\Exception $e) {
            // Log error but don't break the opportunity creation flow
            \Log::error("Error sending opportunity notifications: " . $e->getMessage());
        }
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
   
   
   
    // function delete(Request $request, $id){
    //     Oppty::where('id', $id)
    //     ->where('u_id', $request->user()->id)
    //     ->update
    //     ([
    //         'deleted' => 1
    //     ]);
    //     return response()->json(['status' => 'success', 'message' => 'Deleted']); 
    // }

    function delete($id){
        // Check if the user is authenticated
        if(!Auth::check()){
            return response()->json(['status' => 'error', 'message' => 'Unauthorized']);
        }
        $op = Oppty::find($id);
        if($op){
            $op->deleted = 1; 
            $op->save();
            return response()->json(['status' => 'success', 'message' => 'Deleted']);
        }else{
            return response()->json(['status' => 'error', 'message' => 'Opportunity Not Found']);
        }
    }

    /***
     * bookmark opportunity
     */
    // public function bookmarkOpportunity(Request $request){
    //    // dd($request->input());
    //     if(Auth::check()){
    //         $opp_id = $request->post('id'); 
    //         $user_id = $request->user()->id;
    //         //validate entries 
    //         $validator = Validator::make($request->all(), [
    //             'id' => 'required|integer', 
    //             "type" => "required",
    //         ]);
    //         //handle validation errors
    //         if($validator->fails()){
    //             return response()->json(
    //                 ['status' => 'error', 'message'=> 'Oops! Something went wrong']
    //             );
    //         }
    //         //init bookmark
    //         $bookmark = new Bookmark;

    //         $bookmarked = $bookmark->where('post_id', $opp_id)
    //         ->where('user_id', $user_id)
    //         ->where('post_type', '=', 'opp')
    //         ->exists();

    //         //check if post_id already exist in database. 
    //         if($bookmarked){
    //             //check if its removed, if removed, update deleted to 0 to add it back
    //             $is_removed = $bookmark->where('post_id', $opp_id)
    //             ->where('user_id', $user_id)
    //             ->where('post_type', '=', 'opp')
    //             ->where('removed', 1);

    //             if($is_removed->count() > 0){
    //                 //update record
    //                 $restore_bookmark = $bookmark->where('post_id', $opp_id)
    //                 ->where('user_id', $user_id)
    //                 ->where('post_type', '=', 'opp')
    //                 ->update(['removed' => 0]);

    //                 if($restore_bookmark > 0){
    //                     return response()->json(['status' => 'success', 'message' => "Bookmarked"]);
    //                 }
    //             }

    //             $remove_bookmark = $bookmark->where('post_id', $opp_id)
    //             ->where('user_id', $user_id)
    //             ->where('post_type', '=', 'opp')
    //             ->update(['removed' => 1]);
                
    //             if($remove_bookmark > 0){
    //                 return response()->json(['status' => 'warning', 'message' => 'Bookmark Removed']);
    //             }else{
    //                 return response()->json(['status' => 'error', 'message' => 'Oops! Something went wrong']);
    //             }

    //            // return response()->json(['status' => 'error', 'message'=> 'Already Bookmarked']);
    //         }

    //         //save data...
    //         $bookmark->user_id = $user_id;
    //         $bookmark->post_id = $opp_id;
    //         $bookmark->post_type = 'opp';
    //         $bookmark->save();

    //         return response()->json(['status' => 'success', 'message' => "Bookmarked"]);
    //     }else{
    //         return response()->json(['status' => 'warning', 'message' => "Login to Bookmark"]);
    //     }
    //  }


     /**
      * display all opportunities 
      */
    public function fetchAllOpportunities()
    {
        // $allOppty = Oppty::orderBy('id', 'desc')
        //     ->get()
        //     ->map(function($oppty) {
        //         $current_date = Carbon::now();
        //         $status = ($current_date > $oppty->deadline) ? 'Expired' : 'Active';
                
        //         return [
        //             'id' => $oppty->id,
        //             'title' => $oppty->title,
        //             'views' => $oppty->views,
        //             'created_at' => $oppty->created_at->format('Y-m-d'),
        //             'deadline' => $oppty->deadline,
        //             'status' => $status,
        //             // Add any other fields you need
        //         ];
        //     });
    
        // return response()->json(['data' => $allOppty]);
        $current_date = Carbon::now();
        $opportunities = Oppty::orderBy('id', 'desc')
        ->paginate(20);
        
        return response()->json($opportunities);

    }

    public function showOpportunities(){
       return Inertia::render("Admin/AllOppty");
    }

    public function getLatestOpportunities()
    {
        $currentDate = Carbon::now();
        
        $opportunities = Oppty::select('id', 'title', 'description', 'deadline', 'created_at')
            ->where('status', 'published')
            ->where('deadline', '>', $currentDate) // Only active opportunities
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function($oppty) use ($currentDate) {
                $deadline = Carbon::parse($oppty->deadline);
                $daysLeft = $currentDate->diffInDays($deadline);
                
                // Determine region based on opportunity (you may need to adjust this logic)
                $region = 'Global'; // Default region
                $regionColor = '#26A69A';
                $regionIcon = 'Globe';
                
                // You can add logic here to determine region based on title or other fields
                if (str_contains(strtolower($oppty->title), 'africa') || str_contains(strtolower($oppty->title), 'nigerian')) {
                    $region = 'Africa';
                    $regionColor = '#FF9800';
                    $regionIcon = 'MapPin';
                } elseif (str_contains(strtolower($oppty->title), 'canada') || str_contains(strtolower($oppty->title), 'north america')) {
                    $region = 'North America';
                    $regionColor = '#43A047';
                    $regionIcon = 'Users';
                }
                
                return [
                    'id' => $oppty->id,
                    'title' => $oppty->title,
                    'description' => substr($oppty->description, 0, 120) . '...',
                    'daysLeft' => $daysLeft,
                    'region' => $region,
                    'regionColor' => $regionColor,
                    'regionIcon' => $regionIcon,
                ];
            });
            
        return response()->json($opportunities);
    }


}
