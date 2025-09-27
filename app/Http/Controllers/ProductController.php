<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\ProductCategory;
use App\Models\BrandLabel;
use App\Models\Tag;
use App\Models\Region;
use App\Services\PreferenceNotificationService;
use App\Models\Continent;
use App\Models\Country;
use App\Models\ProductFunctionality;
use App\Models\ProductPricing;
use App\Models\Rating;
use App\Models\Comment;
use Illuminate\Support\Carbon;
use App\Models\Bookmark;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
    //

    public function show(Request $request){
            $categories = ProductCategory::all();
            $brand_label = BrandLabel::all();
            $tags = Tag::all();
            $countries = Country::all();
            $continents = Continent::all();

            return Inertia::render("Admin/CreateProduct", [
                "categories" => $categories,
                "brand_label" => $brand_label,
                "tags" => $tags,
                "countries" => $countries,
                "continents" => $continents,
            ]);
    }


    function searchProducts(Request $request)
{
    // Get authenticated user ID if available
    //authentication
    $user_id = Auth::check() ? Auth::id() : null;

    // Validate incoming request data
    $validatedData = $request->validate([
        // 'program_status' => 'nullable',
        'categories' => 'nullable',
        // 'continents' => 'nullable',
        // 'countries' => 'nullable',
        'brands' => 'nullable',
        'tags' => 'nullable',
        'datePosted' => 'nullable',
        // 'month' => 'nullable',
        // 'year' => 'nullable',
        'search_keyword' => 'nullable'
    ]);
    
    // Extract filter data
    $filters = [
        // 'program_status' => extractSelectData($validatedData['program_status'] ?? ''),
        'categories' => extractSelectData($validatedData['categories'] ?? ''),
        // 'continents' => extractSelectData($validatedData['continents'] ?? ''),
        // 'countries' => extractSelectData($validatedData['countries'] ?? ''),
        'brands' => extractSelectData($validatedData['brands'] ?? ''),
        'tags' => extractSelectData($validatedData['tags'] ?? ''),
        'date_posted' => extractSelectData($validatedData['datePosted'] ?? ''),
        // 'month' => extractSelectData($validatedData['month'] ?? ''),
        // 'year' => extractSelectData($validatedData['year'] ?? ''),
        'search_keyword' => $validatedData['search_keyword'] ?? ''
    ];
    
    // Initialize base query
    $query = $this->buildBaseQuery($user_id);
    
    // Apply filters to query
    $query = $this->applySearchKeywordFilter($query, $filters['search_keyword']);
    $query = $this->applyTaxonomyFilters($query, $filters);
    $query = $this->applyDateFilters($query, $filters);
    
    // Return paginated results
    return $query->orderByDesc('products.id')
                ->paginate($request->input('per_page', 20))
                ->withQueryString();
}


/**
 * Build the base query for products
 *
 * @param int|null $user_id
 * @return \Illuminate\Database\Eloquent\Builder
 */
private function buildBaseQuery($user_id)
{
    return Product::query()
        ->select([
            'products.id', 
            'products.product_name', 
            'products.slug',
            'products.product_description as description',
            'products.cover_img',
            'products.direct_link',
            'products.youtube_link',
            'products.created_at',
            'products.updated_at',
            \DB::raw('GROUP_CONCAT(DISTINCT product_categories.name SEPARATOR ", ") as category_name'),
            \DB::raw('GROUP_CONCAT(DISTINCT brand_labels.name SEPARATOR ", ") as brand_labels'),
            \DB::raw('GROUP_CONCAT(DISTINCT tags.name SEPARATOR ", ") as tags'),
            \DB::raw('CASE WHEN bookmarks.id IS NOT NULL AND bookmarks.removed != 1 THEN 1 ELSE 0 END as is_bookmarked'),
            \DB::raw('COALESCE(AVG(ratings.rating), 0) as average_rating'),
            \DB::raw('COUNT(DISTINCT ratings.id) as total_ratings'),
            \DB::raw('COUNT(DISTINCT comments.id) as total_comments')
        ])
        ->where('products.deleted', '!=', 1)
        ->leftJoin('category_selections', function($join) {
            $join->on('category_selections.post_id', '=', 'products.id')
                 ->where('category_selections.post_type', '=', 'products');
        })
        ->leftJoin('product_categories', 'product_categories.id', '=', 'category_selections.category_id')
        ->leftJoin('brand_labels_selections', function($join) {
            $join->on('brand_labels_selections.post_id', '=', 'products.id')
                 ->where('brand_labels_selections.post_type', '=', 'products');
        })
        ->leftJoin('brand_labels', 'brand_labels.id', '=', 'brand_labels_selections.brand_label_id')
        ->leftJoin('tags_selections', function($join) {
            $join->on('tags_selections.post_id', '=', 'products.id')
                 ->where('tags_selections.post_type', '=', 'products');
        })
        ->leftJoin('tags', 'tags.id', '=', 'tags_selections.tag_id')
        ->leftJoin('bookmarks', function ($join) use ($user_id) {
            $join->on('bookmarks.post_id', '=', 'products.id')
                ->where('bookmarks.post_type', '=', 'tool')
                ->where('bookmarks.user_id', '=', $user_id);
        })
        ->leftJoin('ratings', function($join) {
            $join->on('ratings.rateable_id', '=', 'products.id')
                 ->where('ratings.rateable_type', '=', 'App\\Models\\Product');
        })
        ->leftJoin('comments', function($join) {
            $join->on('comments.commentable_id', '=', 'products.id')
                 ->where('comments.commentable_type', '=', 'App\\Models\\Product');
        })
        ->groupBy([
            'products.id', 
            'products.product_name', 
            'products.slug',
            'products.product_description',
            'products.cover_img',
            'products.direct_link',
            'products.youtube_link',
            'products.created_at',
            'products.updated_at',
            'bookmarks.id',
            'bookmarks.removed'
        ]);
}

/**
 * Apply search keyword filter with progressive fallback strategies
 *
 * @param \Illuminate\Database\Eloquent\Builder $query
 * @param string $searchKeyword
 * @return \Illuminate\Database\Eloquent\Builder
 */
private function applySearchKeywordFilter($query, $searchKeyword)
{
    if (empty($searchKeyword)) {
        return $query;
    }

    $words = preg_split('/\s+/', $searchKeyword, -1, PREG_SPLIT_NO_EMPTY);
    
    // Strategy 1: Full-text search
    $fullTextQuery = clone $query;
    $fullTextQuery->where(function ($q) use ($searchKeyword, $words) {
        $q->whereRaw("MATCH(products.product_name, products.product_description) AGAINST(? IN BOOLEAN MODE)", [$searchKeyword . '*']);
        foreach ($words as $word) {
            $q->orWhereRaw("MATCH(products.product_name, products.product_description) AGAINST(? IN BOOLEAN MODE)", [$word . '*']);
        }
    });
    
    $results = $fullTextQuery->paginate(1);
    
    if (!$results->isEmpty()) {
        return $fullTextQuery;
    }
    
    // Strategy 2: LIKE search
    $likeQuery = clone $query;
    $likeQuery->where(function ($q) use ($searchKeyword, $words) {
        $q->where('products.product_name', 'LIKE', "%$searchKeyword%")
          ->orWhere('products.product_description', 'LIKE', "%$searchKeyword%");
          
        foreach ($words as $word) {
            $q->orWhere('products.product_name', 'LIKE', "%$word%")
              ->orWhere('products.product_description', 'LIKE', "%$word%");
        }
    });
    
    $results = $likeQuery->paginate(1);
    
    if (!$results->isEmpty()) {
        return $likeQuery;
    }
    
    // Strategy 3: SOUNDEX search
    $soundexQuery = clone $query;
    $soundexQuery->where(function ($q) use ($searchKeyword, $words) {
        $q->whereRaw('SOUNDEX(products.product_name) = SOUNDEX(?)', [$searchKeyword])
          ->orWhereRaw('SOUNDEX(products.product_description) = SOUNDEX(?)', [$searchKeyword]);
          
        foreach ($words as $word) {
            $q->orWhereRaw('SOUNDEX(products.product_name) = SOUNDEX(?)', [$word])
              ->orWhereRaw('SOUNDEX(products.product_description) = SOUNDEX(?)', [$word]);
        }
    });
    
    return $soundexQuery;
}

/**
 * Apply taxonomy-based filters (categories, countries, continents, brands)
 *
 * @param \Illuminate\Database\Eloquent\Builder $query
 * @param array $filters
 * @return \Illuminate\Database\Eloquent\Builder
 */
private function applyTaxonomyFilters($query, $filters)
{
    $post_type = 'products';
    
    // Apply brands filter
    if (!empty($filters['brands'])) {
        $brandIds = json_decode($filters['brands'], true);
        if (is_array($brandIds) && count($brandIds) > 0) {
            $query = $this->applyTaxonomyFilter($query, 'brand_labels_selections', 'brand_label_id', $brandIds, $post_type);
        }
    }
    
    // Apply countries filter
    // if (!empty($filters['countries'])) {
    //     $countryIds = json_decode($filters['countries'], true);
    //     if (is_array($countryIds) && count($countryIds) > 0) {
    //         $query = $this->applyTaxonomyFilter($query, 'country_selections', 'country_id', $countryIds, $post_type);
    //     }
    // }
    
    // Apply categories filter
    if (!empty($filters['categories'])) {
        $categoryIds = json_decode($filters['categories'], true);
        if (is_array($categoryIds) && count($categoryIds) > 0) {
            $query = $this->applyTaxonomyFilter($query, 'category_selections', 'category_id', $categoryIds, $post_type);
        }
    }
    
    // Apply continents filter
    // if (!empty($filters['continents'])) {
    //     $continentIds = json_decode($filters['continents'], true);
    //     if (is_array($continentIds) && count($continentIds) > 0) {
    //         $query = $this->applyTaxonomyFilter($query, 'continent_selections', 'continent_id', $continentIds, $post_type);
    //     }
    // }
    
    // Apply tags filter
    if (!empty($filters['tags'])) {
        $tagIds = json_decode($filters['tags'], true);
        if (is_array($tagIds) && count($tagIds) > 0) {
            $query = $this->applyTaxonomyFilter($query, 'tags_selections', 'tag_id', $tagIds, $post_type);
        }
    }
    
    return $query;
}

/**
 * Generic method to apply taxonomy filter
 *
 * @param \Illuminate\Database\Eloquent\Builder $query
 * @param string $tableName
 * @param string $idColumn
 * @param array $idValues
 * @param string $postType
 * @return \Illuminate\Database\Eloquent\Builder
 */
private function applyTaxonomyFilter($query, $tableName, $idColumn, $idValues, $postType)
{
    return $query->whereExists(function ($subquery) use ($tableName, $idColumn, $idValues, $postType) {
        $subquery->select(DB::raw(1))
            ->from($tableName)
            ->where('post_type', $postType)
            ->whereRaw("{$tableName}.post_id = products.id")
            ->whereIn("{$tableName}.{$idColumn}", $idValues);
    });
}

/**
 * Apply date-related filters (month, year, deadline, date posted)
 *
 * @param \Illuminate\Database\Eloquent\Builder $query
 * @param array $filters
 * @return \Illuminate\Database\Eloquent\Builder
 */
private function applyDateFilters($query, $filters)
{
    // Apply month filter
    // if (!empty($filters['month'])) {
    //     $query->whereMonth('products.created_at', Carbon::parse($filters['month'])->month);
    // }
    
    // Apply year filter
    // if (!empty($filters['year'])) {
    //     $query->whereYear('products.created_at', $filters['year']);
    // }
    
    // Apply program status filter
    // if ($filters['program_status'] === 'on_going') {
    //     $query->whereDate('products.deadline', '>=', now());
    // } elseif ($filters['program_status'] === 'up_coming') {
    //     $query->whereDate('products.deadline', '>', now())
    //           ->orderBy('products.deadline', 'asc');
    // }
    
    // Apply date posted filter
    if (!empty($filters['date_posted'])) {
        switch ($filters['date_posted']) {
            case 'one_day':
                $query->whereDate('products.created_at', '>=', now()->subDay());
                break;
            case 'one_week':
                $query->whereDate('products.created_at', '>=', now()->subWeek());
                break;
            case 'two_weeks':
                $query->whereDate('products.created_at', '>=', now()->subWeeks(2));
                break;
            case 'one_month':
                $query->whereDate('products.created_at', '>=', now()->subMonth());
                break;
        }
    }
    
    return $query;
}





 public function readProductData(Request $request, $id)
    {
        $user_id = null;
        if(Auth::check()){
            $user_id = Auth::id();
        }
    
        /**
         * @var mixed
         * show all data associated with this product/tool.
         */
        $tool_data = DB::table('products')
        ->where('products.id', $id)
        ->leftJoin('category_selections', function($join) {
            $join->on('category_selections.post_id', '=', 'products.id')
                 ->where('category_selections.post_type', '=', 'products');
        })
        ->leftJoin('product_categories', 'product_categories.id', '=', 'category_selections.category_id')
        ->leftJoin('brand_labels_selections', function($join) {
            $join->on('brand_labels_selections.post_id', '=', 'products.id')
                 ->where('brand_labels_selections.post_type', '=', 'products');
        })
        ->leftJoin('brand_labels', 'brand_labels.id', '=', 'brand_labels_selections.brand_label_id')
        ->leftJoin('continent_selections', function($join) {
            $join->on('continent_selections.post_id', '=', 'products.id')
                 ->where('continent_selections.post_type', '=', 'products');
        })
        ->leftJoin('continents', 'continents.id', '=', 'continent_selections.continent_id')
        ->leftJoin('country_selections', function($join) {
            $join->on('country_selections.post_id', '=', 'products.id')
                 ->where('country_selections.post_type', '=', 'products');
        })
        ->leftJoin('countries', 'countries.id', '=', 'country_selections.country_id')
        ->leftJoin('tags_selections', function($join) {
            $join->on('tags_selections.post_id', '=', 'products.id')
                 ->where('tags_selections.post_type', '=', 'products');
        })
        ->leftJoin('tags', 'tags.id', '=', 'tags_selections.tag_id')
        ->leftJoin('bookmarks', function($join) use ($user_id) {
            $join->on('bookmarks.post_id', '=', 'products.id')
                ->where('bookmarks.user_id', '=', $user_id)
                ->where('bookmarks.post_type', '=', 'tool')
                ->where('bookmarks.removed', '!=', 1);
        })
        ->leftJoin('ratings', function($join) {
            $join->on('ratings.rateable_id', '=', 'products.id')
                 ->where('ratings.rateable_type', '=', 'App\\Models\\Product');
        })
        ->leftJoin('comments', function($join) {
            $join->on('comments.commentable_id', '=', 'products.id')
                 ->where('comments.commentable_type', '=', 'App\\Models\\Product');
        })
        ->select('products.id',
                'products.product_name as title', 
                'products.slug',
                'products.product_description as description',
                'products.meta_description',
                'products.meta_keywords',
                'products.cover_img', 
                'products.created_at',
                'products.direct_link',
                'products.source_url',
                'products.youtube_link',
                'products.ratings',
                DB::raw('GROUP_CONCAT(DISTINCT product_categories.id) as category_ids'),
                DB::raw('GROUP_CONCAT(DISTINCT product_categories.name) as categories'),
                DB::raw('GROUP_CONCAT(DISTINCT product_categories.slug) as category_slugs'),
                DB::raw('GROUP_CONCAT(DISTINCT brand_labels.id) as brand_label_ids'),
                DB::raw('GROUP_CONCAT(DISTINCT brand_labels.name) as brand_labels'),
                DB::raw('GROUP_CONCAT(DISTINCT brand_labels.slug) as brand_label_slugs'),
                DB::raw('GROUP_CONCAT(DISTINCT continents.id) as continent_ids'),
                DB::raw('GROUP_CONCAT(DISTINCT continents.name) as continents'),
                DB::raw('GROUP_CONCAT(DISTINCT continents.slug) as continent_slugs'),
                DB::raw('GROUP_CONCAT(DISTINCT countries.id) as country_ids'),
                DB::raw('GROUP_CONCAT(DISTINCT countries.name) as countries'),
                DB::raw('GROUP_CONCAT(DISTINCT countries.slug) as country_slugs'),
                DB::raw('GROUP_CONCAT(DISTINCT tags.id) as tag_ids'),
                DB::raw('GROUP_CONCAT(DISTINCT tags.name) as tags'),
                DB::raw('GROUP_CONCAT(DISTINCT tags.slug) as tag_slugs'),
                DB::raw('CASE WHEN bookmarks.post_type = \'tool\' THEN 1 ELSE 0 END as is_bookmarked'),
                DB::raw('COALESCE(AVG(ratings.rating), 0) as average_rating'),
                DB::raw('COUNT(DISTINCT ratings.id) as total_ratings'),
                DB::raw('COUNT(DISTINCT comments.id) as total_comments'))
        ->groupBy('products.id', 
                'products.product_name', 
                'products.slug',
                'products.product_description',
                'products.meta_description',
                'products.meta_keywords',
                'products.cover_img', 
                'products.created_at', 
                'products.direct_link',
                'products.source_url',
                'products.youtube_link',
                'products.ratings',
                'bookmarks.post_type')
        ->first();

    // Check if product exists
    if (!$tool_data) {
        abort(404, 'Product not found');
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
    
    $category_ids = prepareIdList($tool_data->category_ids);
    $brand_label_ids = prepareIdList($tool_data->brand_label_ids);
    $continent_ids = prepareIdList($tool_data->continent_ids);
    $country_ids = prepareIdList($tool_data->country_ids);
    $tag_ids = prepareIdList($tool_data->tag_ids);
    
    $similarPosts = DB::table('products as p')
        ->leftJoin('category_selections as cs', 'cs.post_id', '=', 'p.id')
        ->leftJoin('categories as c', 'c.id', '=', 'cs.category_id')
        ->leftJoin('brand_labels_selections as bls', 'bls.post_id', '=', 'p.id')
        ->leftJoin('continent_selections as cts', 'cts.post_id', '=', 'p.id')
        ->leftJoin('continents as cont', 'cont.id', '=', 'cts.continent_id')
        ->leftJoin('country_selections as cos', 'cos.post_id', '=', 'p.id')
        ->leftJoin('countries as cou', 'cou.id', '=', 'cos.country_id')
        ->leftJoin('tags_selections as ts', 'ts.post_id', '=', 'p.id')
        ->where('p.id', '!=', $current_post_id) // Exclude the current post
        ->where('p.deleted', '!=', 1)
        ->where(function ($query) use ($category_ids, $brand_label_ids, $continent_ids, $country_ids, $tag_ids) {
            if ($category_ids !== 'NULL') $query->orWhereIn('cs.category_id', explode(',', $category_ids));
            if ($brand_label_ids !== 'NULL') $query->orWhereIn('bls.brand_label_id', explode(',', $brand_label_ids));
            if ($continent_ids !== 'NULL') $query->orWhereIn('cts.continent_id', explode(',', $continent_ids));
            if ($country_ids !== 'NULL') $query->orWhereIn('cos.country_id', explode(',', $country_ids));
            if ($tag_ids !== 'NULL') $query->orWhereIn('ts.tag_id', explode(',', $tag_ids));
        })
        ->select('p.id', 
                    'p.product_name as title',
                    'p.slug',
                    'p.cover_img',
                    'p.product_description as description',
                    'p.created_at', 
                    'p.updated_at',
            DB::raw("SUM(
                CASE 
                    WHEN " . ($category_ids !== 'NULL' ? "cs.category_id IN ($category_ids)" : "FALSE") . " THEN 2
                    WHEN " . ($brand_label_ids !== 'NULL' ? "bls.brand_label_id IN ($brand_label_ids)" : "FALSE") . " THEN 2
                    WHEN " . ($continent_ids !== 'NULL' ? "cts.continent_id IN ($continent_ids)" : "FALSE") . " THEN 1
                    WHEN " . ($country_ids !== 'NULL' ? "cos.country_id IN ($country_ids)" : "FALSE") . " THEN 2
                    WHEN " . ($tag_ids !== 'NULL' ? "ts.tag_id IN ($tag_ids)" : "FALSE") . " THEN 1
                    ELSE 0
                END
            ) as similarity_score"),
            DB::raw('GROUP_CONCAT(DISTINCT c.name) as categories'),
            DB::raw('GROUP_CONCAT(DISTINCT cou.name) as countries'),
            DB::raw('GROUP_CONCAT(DISTINCT cont.name) as continents')
        )
        ->groupBy('p.id', 'p.product_name', 
        'p.slug',
        'p.cover_img',
        'p.product_description', 
        'p.created_at', 
        'p.updated_at') // Add all non-aggregated columns from 'p.*'
        ->orderByDesc('similarity_score')
        ->orderByDesc('p.created_at')
        ->limit(6)
        ->get();
    
        if (!$tool_data) {
            abort(404);
        }
    
        // Check if the user has already viewed this post in the current session
        $viewedPosts = $request->session()->get('viewed_posts', []);
    
        if (!in_array($id, $viewedPosts)) {
            // Increment views if not previously viewed
            DB::table('products')->where('id', $id)->increment('views');
            
            // Store the post ID in the session
            $request->session()->push('viewed_posts', $id);
        }
    
        // return Inertia::render("Opp-view", [
        //     'opp_posts' => $opp_posts,
        //     'categoriesWithCounts' => $categoriesWithCounts,
        //     'similarPosts' => $similarPosts,
        //     'total_comments' => $total_comments,
        // ]);

        return Inertia::render("Tool-view", [
            'tool_data' => $tool_data,
            'similarPosts' => $similarPosts,
        ]);
        
    }




/**
 * Store or update a product
 *
 * @param \Illuminate\Http\Request $request
 * @return \Illuminate\Http\JsonResponse
 */

public function store(Request $request)
{
    // Define custom validation rules...
    $rules = [
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'direct_link' => 'nullable|url|max:255',
        'youtube_link' => 'nullable|url|max:255',
        'meta_description' => 'nullable|string',
        'meta_keywords' => 'nullable|string',
        'post_id' => 'nullable|integer|exists:products,id',
        'signature' => 'nullable|string',
        'cover_img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'categories' => 'nullable',
        'brand_labels' => 'nullable',
        'tags' => 'nullable',
        'countries' => 'nullable',
        'continents' => 'nullable',
    ];

    // Validate the request...
    $validator = Validator::make($request->all(), $rules);

    if($validator->fails()){
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

    $op = $postId ? Product::findOrFail($postId) : new Product();

    // Check user authorization for existing posts
    if ($postId && $op->u_id !== Auth::id()) {
        $isEditing = true;
        return response()->json([
            "success" => false, 
            "message" => "Unauthorized Access"
        ], 403);
    }

    // Handle file upload
    if ($request->hasFile('cover_img') && $request->file('cover_img')->isValid()) {
        $file = $request->file('cover_img');
        $hashedFileName = $this->generateUniqueFileName($file);
        $file->storeAs('public/uploads/prod', $hashedFileName, 'public');
        $op->cover_img = $hashedFileName;
    }

    // Populate model attributes
    $op->u_id = Auth::id();
    $op->user_role = Auth::user()->role;
    $op->slug = $this->createSlug($request->title);

    // Store the data in the database
    $op->product_name = $request->title;
    $op->product_description = $request->description;
    $op->direct_link = $request->direct_link;
    $op->youtube_link = $request->youtube_link;
    $op->meta_description = $request->meta_description;
    $op->meta_keywords = $request->meta_keywords;

    $op->save();

    // Get the ID of the newly created or updated post
    $postId = $op->id;

    $categories = extractSelectData($request->categories);
    $brand_labels = extractSelectData($request->brand_labels);
    $tags = extractSelectData($request->tags);
    // $regions = extractSelectData($request->regions);
    $countries = extractSelectData($request->countries);
    $continents = extractSelectData($request->continents);

    // Helper function to delete and insert relational data
    $manageRelationalData = function ($table, $columnName, $data) use ($postId, $request) {
        try {
            // First, delete existing records for the post in this table
            DB::table($table)->where('post_id', $postId)->delete();
            
            // Insert new data
            if (empty($data)) {
                return;
            }
            
            // Decode JSON string and extract IDs
            $decodedData = json_decode($data, true);
            
            if (!is_array($decodedData)) {
                return;
            }
            
            $insertData = []; // Initialize the array

            foreach ($decodedData as $id) {
                if (isset($id) && !empty($id)) {
                    $insertData[] = [
                        'user_id' => $request->user()->id,
                        'post_id' => $postId,
                        $columnName => $id, // for column id Use 'id' from the new format
                        'post_type' => 'products',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
            
            if (!empty($insertData)) {
                DB::table($table)->insert($insertData);
            }
        } catch (\Exception $e) {
            // Log the error but don't break the product creation
            \Log::error("Error managing relational data for {$table}: " . $e->getMessage());
        }
    };

    // Manage relational data for each attribute
    $relationalData = [
        'category_selections' => ['category_id', $categories],
        'brand_labels_selections' => ['brand_label_id', $brand_labels],
        'tags_selections' => ['tag_id', $tags],
        'country_selections' => ['country_id', $countries],
        'continent_selections' => ['continent_id', $continents],
    ];

    // Loop through each relational data table and update it
    foreach ($relationalData as $table => $data) {
        $manageRelationalData($table, $data[0], $data[1]);
    }

    // Send notifications for new products (not for updates)
    if (!$isEditing) {
        try {
            $notificationService = new PreferenceNotificationService();
            
            // Extract IDs from the saved data
            $categoryIds = $notificationService->extractIds(null, 'category_selections', 'category_id', $postId);
            $brandIds = $notificationService->extractIds(null, 'brand_labels_selections', 'brand_label_id', $postId);
            $tagIds = $notificationService->extractIds(null, 'tags_selections', 'tag_id', $postId);
            
            // Send notifications to users with matching preferences
            $notificationService->notifyProductMatch($op, $categoryIds, $brandIds, $tagIds);
        } catch (\Exception $e) {
            // Log error but don't break the product creation flow
            \Log::error("Error sending product notifications: " . $e->getMessage());
        }
    }

    if($isEditing){
        $post_message = "Product Updated";
    }else{
        $post_message = "Product Created";
    }
    return response()->json([
        "success" => true,
        "message" => $post_message,
    ], 200);
}



    // Helper function to generate a unique file name
    private function generateUniqueFileName($file)
    {
        $originalFileName = $file->getClientOriginalName();
        $fileExtension = $file->getClientOriginalExtension();
        $uniqueHash = hash('sha256', $originalFileName . time());
        return $uniqueHash . '.' . $fileExtension;
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

    // Display all products for admin
    public function showProducts(Request $request){
        $search = $request->get('search');
        $perPage = $request->get('per_page', 12);
        $category = $request->get('category');
        $status = $request->get('status');
        
        // Build query similar to OpportunityController pattern
        $productsQuery = DB::table('products')
            ->leftJoin('category_selections', function($join) {
                $join->on('category_selections.post_id', '=', 'products.id')
                     ->where('category_selections.post_type', '=', 'products');
            })
            ->leftJoin('product_categories', 'product_categories.id', '=', 'category_selections.category_id')
            ->leftJoin('brand_labels_selections', function($join) {
                $join->on('brand_labels_selections.post_id', '=', 'products.id')
                     ->where('brand_labels_selections.post_type', '=', 'products');
            })
            ->leftJoin('brand_labels', 'brand_labels.id', '=', 'brand_labels_selections.brand_label_id')
            ->leftJoin('continent_selections', function($join) {
                $join->on('continent_selections.post_id', '=', 'products.id')
                     ->where('continent_selections.post_type', '=', 'products');
            })
            ->leftJoin('continents', 'continents.id', '=', 'continent_selections.continent_id')
            ->leftJoin('country_selections', function($join) {
                $join->on('country_selections.post_id', '=', 'products.id')
                     ->where('country_selections.post_type', '=', 'products');
            })
            ->leftJoin('countries', 'countries.id', '=', 'country_selections.country_id')
            ->leftJoin('tags_selections', function($join) {
                $join->on('tags_selections.post_id', '=', 'products.id')
                     ->where('tags_selections.post_type', '=', 'products');
            })
            ->leftJoin('tags', 'tags.id', '=', 'tags_selections.tag_id')
            ->leftJoin('users', 'users.id', '=', 'products.u_id')
            ->select([
                'products.id', 
                'products.u_id', 
                'products.user_role', 
                'products.product_name', 
                'products.product_description', 
                'products.cover_img', 
                'products.source_url', 
                'products.direct_link', 
                'products.slug', 
                'products.views', 
                'products.comments', 
                'products.ratings', 
                'products.deleted', 
                'products.created_at', 
                'products.updated_at', 
                'products.deleted_at',
                'users.name as user_name',
                'users.email as user_email',
                DB::raw('GROUP_CONCAT(DISTINCT product_categories.id) as category_ids'),
                DB::raw('GROUP_CONCAT(DISTINCT product_categories.name) as categories'),
                DB::raw('GROUP_CONCAT(DISTINCT product_categories.slug) as category_slugs'),
                DB::raw('GROUP_CONCAT(DISTINCT brand_labels.id) as brand_label_ids'),
                DB::raw('GROUP_CONCAT(DISTINCT brand_labels.name) as brand_labels'),
                DB::raw('GROUP_CONCAT(DISTINCT brand_labels.slug) as brand_label_slugs'),
                DB::raw('GROUP_CONCAT(DISTINCT continents.id) as continent_ids'),
                DB::raw('GROUP_CONCAT(DISTINCT continents.name) as continents'),
                DB::raw('GROUP_CONCAT(DISTINCT continents.slug) as continent_slugs'),
                DB::raw('GROUP_CONCAT(DISTINCT countries.id) as country_ids'),
                DB::raw('GROUP_CONCAT(DISTINCT countries.name) as countries'),
                DB::raw('GROUP_CONCAT(DISTINCT countries.slug) as country_slugs'),
                DB::raw('GROUP_CONCAT(DISTINCT tags.id) as tag_ids'),
                DB::raw('GROUP_CONCAT(DISTINCT tags.name) as tags'),
                DB::raw('GROUP_CONCAT(DISTINCT tags.slug) as tag_slugs')
            ])
            ->groupBy([
                'products.id', 
                'products.u_id', 
                'products.user_role', 
                'products.product_name', 
                'products.product_description', 
                'products.cover_img', 
                'products.source_url', 
                'products.direct_link', 
                'products.slug', 
                'products.views', 
                'products.comments', 
                'products.ratings', 
                'products.deleted', 
                'products.created_at', 
                'products.updated_at', 
                'products.deleted_at',
                'users.name',
                'users.email'
            ]);
            
        // Apply search filter (following OpportunityController pattern)
        if ($search) {
            $productsQuery->where(function($query) use ($search) {
                $query->where('products.product_name', 'LIKE', "%{$search}%")
                      ->orWhere('products.product_description', 'LIKE', "%{$search}%")
                      ->orWhere('users.name', 'LIKE', "%{$search}%");
            });
        }
        
        // Apply category filter (following polymorphic pattern)
        if ($category) {
            $productsQuery->whereIn('product_categories.id', explode(',', $category));
        }
        
        // Apply status filter (handle dual deletion system like opportunities)
        if ($status) {
            if ($status === 'active') {
                $productsQuery->where('products.deleted', '!=', 1)
                             ->whereNull('products.deleted_at');
            } elseif ($status === 'deleted') {
                $productsQuery->where(function($query) {
                    $query->where('products.deleted', '=', 1)
                          ->orWhereNotNull('products.deleted_at');
                });
            }
        }
        
        $products = $productsQuery->orderBy('products.created_at', 'desc')
                                 ->paginate($perPage);
        
        // Get statistics using the same dual deletion approach
        $statistics = [
            'total_products' => DB::table('products')->count(),
            'active_products' => DB::table('products')
                                   ->where('deleted', '!=', 1)
                                   ->whereNull('deleted_at')
                                   ->count(),
            'deleted_products' => DB::table('products')
                                    ->where(function($query) {
                                        $query->where('deleted', '=', 1)
                                              ->orWhereNotNull('deleted_at');
                                    })
                                    ->count(),
            'total_views' => DB::table('products')->sum('views') ?: 0,
            'recent_products' => Product::where('created_at', '>=', now()->subDays(30))
                                      ->where('deleted', 0)
                                      ->whereNull('deleted_at')
                                      ->count(),
            'today_products' => Product::whereDate('created_at', today())
                                     ->where('deleted', 0)
                                     ->whereNull('deleted_at')
                                     ->count(),
        ];
        
        // Get categories for filtering (using ProductCategory model)
        $categories = ProductCategory::select('id', 'name')->get();
        
        return Inertia::render('Admin/AllProducts', [
            'products' => $products,
            'statistics' => $statistics,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
                'category' => $category,
                'status' => $status
            ]
        ]);
    }

    /**
     * Fetch all products for AJAX requests (similar to fetchAllOpportunities)
     */
    public function fetchAllProducts(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 20);
        $category = $request->get('category');
        $status = $request->get('status');
        
        // Build query similar to showProducts but for API response
        $productsQuery = DB::table('products')
            ->leftJoin('category_selections', function($join) {
                $join->on('category_selections.post_id', '=', 'products.id')
                     ->where('category_selections.post_type', '=', 'products');
            })
            ->leftJoin('product_categories', 'product_categories.id', '=', 'category_selections.category_id')
            ->leftJoin('users', 'users.id', '=', 'products.u_id')
            ->select([
                'products.id', 
                'products.u_id', 
                'products.product_name', 
                'products.product_description', 
                'products.cover_img', 
                'products.source_url', 
                'products.direct_link', 
                'products.slug', 
                'products.views', 
                'products.deleted', 
                'products.created_at', 
                'products.updated_at', 
                'products.deleted_at',
                'users.name as user_name',
                'users.email as user_email',
                DB::raw('GROUP_CONCAT(DISTINCT product_categories.name) as categories')
            ])
            ->groupBy([
                'products.id', 'products.u_id', 'products.product_name', 
                'products.product_description', 'products.cover_img', 
                'products.source_url', 'products.direct_link', 'products.slug', 
                'products.views', 'products.deleted', 'products.created_at', 
                'products.updated_at', 'products.deleted_at', 'users.name', 'users.email'
            ]);
            
        // Apply search filter
        if ($search) {
            $productsQuery->where(function($query) use ($search) {
                $query->where('products.product_name', 'LIKE', "%{$search}%")
                      ->orWhere('products.product_description', 'LIKE', "%{$search}%")
                      ->orWhere('users.name', 'LIKE', "%{$search}%");
            });
        }
        
        // Apply category filter
        if ($category) {
            $productsQuery->whereIn('product_categories.id', explode(',', $category));
        }
        
        // Apply status filter
        if ($status) {
            if ($status === 'active') {
                $productsQuery->where('products.deleted', '!=', 1)
                             ->whereNull('products.deleted_at');
            } elseif ($status === 'deleted') {
                $productsQuery->where(function($query) {
                    $query->where('products.deleted', '=', 1)
                          ->orWhereNotNull('products.deleted_at');
                });
            }
        }
        
        $products = $productsQuery->orderBy('products.created_at', 'desc')
                                 ->paginate($perPage);
        
        return response()->json($products);
    }

    /**
     * Show the product edit form
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        try {
            // Find the product
            $product = Product::findOrFail($id);
            
            // Check if user has permission to edit this product
            if ($product->u_id !== Auth::id() && Auth::user()->role !== 'admin') {
                abort(403, 'Unauthorized');
            }

            // Get all the necessary data for the form
            $categories = ProductCategory::all();
            $brand_label = BrandLabel::all();
            $tags = Tag::all();
            $countries = Country::all();
            $continents = Continent::all();

            // Get selected data for the product
            $selectedData = $this->getSelectedDataForProduct($id);

            return Inertia::render("Admin/CreateProduct", [
                "edits" => $product,
                "categories" => $categories,
                "brand_label" => $brand_label,
                "tags" => $tags,
                "countries" => $countries,
                "continents" => $continents,
                "selectedData" => $selectedData,
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.all_products')->with('error', 'Product not found');
        }
    }

    /**
     * Get selected taxonomies for a product
     *
     * @param int $productId
     * @return array
     */
    private function getSelectedDataForProduct($productId)
    {
        $selectedData = [];

        // Get categories
        $categories = DB::table('category_selections')
            ->join('product_categories', 'product_categories.id', '=', 'category_selections.category_id')
            ->where('category_selections.post_id', $productId)
            ->where('category_selections.post_type', 'products')
            ->select('product_categories.id', 'product_categories.name')
            ->get();
        $selectedData['category'] = $categories->toArray();

        // Get brand labels
        $brandLabels = DB::table('brand_labels_selections')
            ->join('brand_labels', 'brand_labels.id', '=', 'brand_labels_selections.brand_label_id')
            ->where('brand_labels_selections.post_id', $productId)
            ->where('brand_labels_selections.post_type', 'products')
            ->select('brand_labels.id', 'brand_labels.name')
            ->get();
        $selectedData['brand_labels'] = $brandLabels->toArray();

        // Get tags
        $tags = DB::table('tag_selections')
            ->join('tags', 'tags.id', '=', 'tag_selections.tag_id')
            ->where('tag_selections.post_id', $productId)
            ->where('tag_selections.post_type', 'products')
            ->select('tags.id', 'tags.name')
            ->get();
        $selectedData['tags'] = $tags->toArray();

        // Get countries
        $countries = DB::table('country_selections')
            ->join('countries', 'countries.id', '=', 'country_selections.country_id')
            ->where('country_selections.post_id', $productId)
            ->where('country_selections.post_type', 'products')
            ->select('countries.id', 'countries.name')
            ->get();
        $selectedData['country'] = $countries->toArray();

        // Get continents
        $continents = DB::table('continent_selections')
            ->join('continents', 'continents.id', '=', 'continent_selections.continent_id')
            ->where('continent_selections.post_id', $productId)
            ->where('continent_selections.post_type', 'products')
            ->select('continents.id', 'continents.name')
            ->get();
        $selectedData['continent'] = $continents->toArray();

        return $selectedData;
    }

    /**
     * Rate a product
     */
    public function rateProduct(Request $request, $id)
    {
        if (!Auth::check()) {
            return response()->json(['success' => false, 'message' => 'Please login to rate products']);
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        $product = Product::findOrFail($id);
        $userId = Auth::id();

        // Check if user already rated this product
        $existingRating = $product->ratings()->where('user_id', $userId)->first();

        if ($existingRating) {
            // Update existing rating
            $existingRating->update([
                'rating' => $request->rating,
                'comment' => $request->comment
            ]);
            $message = 'Rating updated successfully';
        } else {
            // Create new rating
            $product->ratings()->create([
                'user_id' => $userId,
                'rating' => $request->rating,
                'comment' => $request->comment
            ]);
            $message = 'Rating submitted successfully';
        }

        return response()->json([
            'success' => true, 
            'message' => $message,
            'average_rating' => round($product->ratings()->avg('rating'), 1),
            'total_ratings' => $product->ratings()->count()
        ]);
    }

    /**
     * Comment on a product
     */
    public function commentProduct(Request $request, $id)
    {
        if (!Auth::check()) {
            return response()->json(['success' => false, 'message' => 'Please login to comment']);
        }

        $request->validate([
            'comment' => 'required|string|max:2000'
        ]);

        $product = Product::findOrFail($id);

        $comment = $product->comments()->create([
            'user_id' => Auth::id(),
            'comment' => $request->comment,
            'is_approved' => true
        ]);

        $comment->load('user');

        return response()->json([
            'success' => true, 
            'message' => 'Comment posted successfully',
            'comment' => $comment
        ]);
    }

    /**
     * Reply to a comment
     */
    public function replyToComment(Request $request, $id)
    {
        if (!Auth::check()) {
            return response()->json(['success' => false, 'message' => 'Please login to reply']);
        }

        $request->validate([
            'comment' => 'required|string|max:2000'
        ]);

        $parentComment = Comment::findOrFail($id);

        $reply = Comment::create([
            'user_id' => Auth::id(),
            'commentable_type' => $parentComment->commentable_type,
            'commentable_id' => $parentComment->commentable_id,
            'parent_id' => $parentComment->id,
            'comment' => $request->comment,
            'is_approved' => true
        ]);

        $reply->load('user');

        return response()->json([
            'success' => true, 
            'message' => 'Reply posted successfully',
            'reply' => $reply
        ]);
    }

    /**
     * Get comments for a product
     */
    public function getComments($id)
    {
        $product = Product::findOrFail($id);
        
        $comments = $product->comments()
            ->approved()
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'comments' => $comments
        ]);
    }

    /**
     * Get ratings for a product
     */
    public function getRatings($id)
    {
        $product = Product::findOrFail($id);
        
        $ratings = $product->ratings()->with('user')->latest()->get();
        $averageRating = $product->ratings()->avg('rating');
        $totalRatings = $product->ratings()->count();
        
        // Get rating distribution
        $distribution = [];
        for ($i = 1; $i <= 5; $i++) {
            $count = $product->ratings()->where('rating', $i)->count();
            $percentage = $totalRatings > 0 ? ($count / $totalRatings) * 100 : 0;
            $distribution[$i] = [
                'count' => $count,
                'percentage' => round($percentage, 1)
            ];
        }

        return response()->json([
            'success' => true,
            'ratings' => $ratings,
            'average_rating' => round($averageRating, 1),
            'total_ratings' => $totalRatings,
            'distribution' => $distribution
        ]);
    }

   


}
