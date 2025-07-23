<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\BrandLabel;
use App\Models\Tag;
use App\Models\Region;
use App\Models\Continent;
use App\Models\Country;
use App\Models\ProductCategory;
use App\Models\ProductFunctionality;
use App\Models\ProductPricing;
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
            $product_categories = ProductCategory::all();
            $brand_label = BrandLabel::all();
            $tags = Tag::all();
            $countries = Country::all();
            $continents = Continent::all();

            return Inertia::render("Admin/CreateProduct", [
                "categories" => $product_categories,
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
        'program_status' => 'nullable',
        'categories' => 'nullable',
        'continents' => 'nullable',
        'countries' => 'nullable',
        'brands' => 'nullable',
        'datePosted' => 'nullable',
        'month' => 'nullable',
        'year' => 'nullable',
        'search_keyword' => 'nullable'
    ]);
    
    // Extract filter data
    $filters = [
        'program_status' => extractSelectData($validatedData['program_status'] ?? ''),
        'categories' => extractSelectData($validatedData['categories'] ?? ''),
        'continents' => extractSelectData($validatedData['continents'] ?? ''),
        'countries' => extractSelectData($validatedData['countries'] ?? ''),
        'brands' => extractSelectData($validatedData['brands'] ?? ''),
        'date_posted' => extractSelectData($validatedData['datePosted'] ?? ''),
        'month' => extractSelectData($validatedData['month'] ?? ''),
        'year' => extractSelectData($validatedData['year'] ?? ''),
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
            'products.product_description',
            'products.cover_img',
            \DB::raw('GROUP_CONCAT(DISTINCT continents.name SEPARATOR ", ") as continent_name'),
            \DB::raw('CASE WHEN bookmarks.id IS NOT NULL AND bookmarks.removed != 1 THEN 1 ELSE 0 END as is_bookmarked')
        ])
        ->where('products.deleted', '!=', 1)
        ->leftJoin('continent_selections', 'continent_selections.post_id', '=', 'products.id')
        ->leftJoin('continents', 'continents.id', '=', 'continent_selections.continent_id')
        ->leftJoin('bookmarks', function ($join) use ($user_id) {
            $join->on('bookmarks.post_id', '=', 'products.id')
                ->where('bookmarks.post_type', '=', 'opp')
                ->where('bookmarks.user_id', '=', $user_id);
        })
        ->groupBy([
            'products.id', 
            'products.product_name', 
            // 'products.deadline',
            'products.slug',
            'products.product_description',
            'products.cover_img',
            'bookmarks.id',
            'bookmarks.removed',
            \DB::raw('CASE WHEN bookmarks.id IS NOT NULL AND bookmarks.removed != 1 THEN 1 ELSE 0 END')
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
    $post_type = 'opportunity';
    
    // Apply brands filter
    if (!empty($filters['brands'])) {
        $brandIds = json_decode($filters['brands'], true);
        if (is_array($brandIds) && count($brandIds) > 0) {
            $query = $this->applyTaxonomyFilter($query, 'brand_labels_selections', 'brand_label_id', $brandIds, $post_type);
        }
    }
    
    // Apply countries filter
    if (!empty($filters['countries'])) {
        $countryIds = json_decode($filters['countries'], true);
        if (is_array($countryIds) && count($countryIds) > 0) {
            $query = $this->applyTaxonomyFilter($query, 'country_selections', 'country_id', $countryIds, $post_type);
        }
    }
    
    // Apply categories filter
    if (!empty($filters['categories'])) {
        $categoryIds = json_decode($filters['categories'], true);
        if (is_array($categoryIds) && count($categoryIds) > 0) {
            $query = $this->applyTaxonomyFilter($query, 'category_selections', 'category_id', $categoryIds, $post_type);
        }
    }
    
    // Apply continents filter
    if (!empty($filters['continents'])) {
        $continentIds = json_decode($filters['continents'], true);
        if (is_array($continentIds) && count($continentIds) > 0) {
            $query = $this->applyTaxonomyFilter($query, 'continent_selections', 'continent_id', $continentIds, $post_type);
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
    if (!empty($filters['month'])) {
        $query->whereMonth('products.created_at', Carbon::parse($filters['month'])->month);
    }
    
    // Apply year filter
    if (!empty($filters['year'])) {
        $query->whereYear('products.created_at', $filters['year']);
    }
    
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

    
    // function store(Request $request)
    // {
    //     // Define custom validation rules
    //     $rules = [
    //         'product_name' => 'required|string|max:255',
    //         'product_description' => 'required|string',
    //         'source_url' => 'required|url|max:255',
    //         'country' => 'nullable|string',
    //         'continent' => 'nullable|string',
    //         'category' => 'nullable|string',
    //         'meta_description' => 'nullable|string',
    //         'meta_keywords' => 'nullable|string',
    //         'post_type' => 'nullable|string',
    //         'cover_img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    //         'post_id' => 'nullable|integer|exists:products,id',
    //         'signature' => 'required_with:post_id|string'
    //     ];

    //     // Validate the request
    //     $validator = Validator::make($request->all(), $rules);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => $validator->errors()->first()
    //         ], 422);
    //     }

    //     $postId = $request->input('post_id');
    //     $signature = $request->input('signature');
    //     $isEditing = false;

    //     // Verify the HMAC signature if post_id is provided
    //     if ($postId && !hash_equals($signature, hash_hmac('sha256', $postId, config('app.key')))) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Invalid signature'
    //         ], 422);
    //     }

    //     $op = $postId ? Product::findOrFail($postId) : new Product();

    //     // Check user authorization for existing posts
    //     if ($postId && $op->u_id !== Auth::id()) {
    //         $isEditing = true;
    //         return response()->json(["success" => false, "message" => "Unauthorized Access"], 403);
    //     }

    //     // Handle file upload
    //     if ($request->hasFile('cover_img') && $request->file('cover_img')->isValid()) {
    //         $file = $request->file('cover_img');
    //         $hashedFileName = $this->generateUniqueFileName($file);
    //         $file->storeAs('public/uploads/channels', $hashedFileName);
    //         $op->cover_img = $hashedFileName;
    //     }

    //     // Populate model attributes
    //     $op->u_id = Auth::id();
    //     $op->user_role = Auth::user()->role;
    //     $op->slug = $this->createSlug($request->product_name);

    //     // Store the data in the database
    //     $op->u_id = $request->user()->id;
    //     $op->user_role = $request->user()->role;
    //     $op->product_name = $request->product_name;
    //     $op->product_description = $request->product_description;
    //     $op->source_url = $request->source_url;
    //     $op->meta_description = $request->meta_description;
    //     $op->meta_keywords = $request->meta_keywords;
    //     $op->post_type = $request->post_type;

    //     $op->save();

    //     // Get the ID of the newly created or updated post
    //     $postId = $op->id;

    //     // Helper function to delete and insert relational data
    //     $manageRelationalData = function ($table, $columnName, $data) use ($postId, $request) {
    //         // First, delete existing records for the post in this table
    //         DB::table($table)->where('post_id', $postId)->delete();

    //         // Insert new data
    //         if (empty($data)) return;

    //         // Decode JSON string and extract IDs
    //         $decodedData = json_decode($data, true);
    //         $insertData = [];
    //         foreach ($decodedData as $item) {
    //             if (isset($item['id']) && !empty($item['id'])) {
    //                 $insertData[] = [
    //                     'user_id' => $request->user()->id,
    //                     'post_id' => $postId,
    //                     $columnName => $item['id'], // Use 'id' from the new format
    //                     'post_type' => 'products',
    //                     'created_at' => now(),
    //                     'updated_at' => now(),
    //                 ];
    //             }
    //         }
    //         if (!empty($insertData)) {
    //             DB::table($table)->insert($insertData);
    //         }
    //     };

    //     // Manage relational data for each attribute
    //     $relationalData = [
    //         'category_selections' => ['category_id', $request->input('category')],
    //         'brand_labels_selections' => ['brand_label_id', $request->input('brand_labels')],
    //         'tags_selections' => ['tag_id', $request->input('tags')],
    //         'region_selections' => ['region_id', $request->input('region')],
    //         'country_selections' => ['country_id', $request->input('country')],
    //         'continent_selections' => ['continent_id', $request->input('continent')],
    //         'product_func_selections' => ['product_func_id', $request->input('product-functionality')],
    //         'product_pricing_selections' => ['pricing_id', $request->input('product-pricing')],
    //     ];

    //     // Loop through each relational data table and update it
    //     foreach ($relationalData as $table => $data) {
    //         $manageRelationalData($table, $data[0], $data[1]);
    //     }

    //     if($isEditing){
    //         $post_message = "Post Updated Successful";
    //     }else{
    //         $post_message = "Post Successful";
    //     }
    //     return response()->json([
    //         "success" => true,
    //         "message" => $post_message,
    //     ]);
    // }


    
function store(Request $request)
{

    //return response()->json($request);
    
    // Define custom validation rules...
    $rules = [
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'source_url' => 'required|url|max:255',
        'deadline' => 'nullable|date|after_or_equal:today',
        'meta_description' => 'nullable|string',
        'meta_keywords' => 'nullable|string',
        'post_id' => 'nullable|integer|exists:products,id',
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
    $op->source_url = $request->source_url;
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

   


}
