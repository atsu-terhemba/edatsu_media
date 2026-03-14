<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Oppty;
use App\Models\Bookmark;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class App extends Controller
{
   public function bookmark(Request $request){
        // dd($request->input());
        if(Auth::check()){
            $opp_id = $request->post('id'); 
            $user_id = $request->user()->id;
            $type = $request->post('type'); //type of post, opp or ts
            //validate entries 
            $validator = Validator::make($request->all(), [
                'id' => 'required|integer', 
                "type" => "required",
            ]);
            //handle validation errors...
            if($validator->fails()){
                return response()->json(
                    ['status' => 'error', 'message'=> 'Oops! Something went wrong']
                );
            }
            //init bookmark...
            $bookmark = new Bookmark;

            $bookmarked = $bookmark->where('post_id', $opp_id)
            ->where('user_id', $user_id)
            ->where('post_type', '=', $type)
            ->exists();

            //check if post_id already exist in database. 
            if($bookmarked){
                //check if its removed, if removed, update deleted to 0 to add it back
                $is_removed = $bookmark->where('post_id', $opp_id)
                ->where('user_id', $user_id)
                ->where('post_type', '=', $type)
                ->where('removed', 1);

                if($is_removed->count() > 0){
                    //update record
                    $restore_bookmark = $bookmark->where('post_id', $opp_id)
                    ->where('user_id', $user_id)
                    ->where('post_type', '=', $type)
                    ->update(['removed' => 0]);

                    if($restore_bookmark > 0){
                        return response()->json(['status' => 'success', 'message' => "Bookmarked"]);
                    }
                }

                $remove_bookmark = $bookmark->where('post_id', $opp_id)
                ->where('user_id', $user_id)
                ->where('post_type', '=', $type)
                ->update(['removed' => 1]);
                
                if($remove_bookmark > 0){
                    return response()->json(['status' => 'warning', 'message' => 'Bookmark Removed']);
                }else{
                    return response()->json(['status' => 'error', 'message' => 'Oops! Something went wrong']);
                }

               // return response()->json(['status' => 'error', 'message'=> 'Already Bookmarked']);
            }

            //save data...
            $bookmark->user_id = $user_id;
            $bookmark->post_id = $opp_id;
            $bookmark->post_type = $type; // Use the passed type instead of hardcoded 'opp'
            $bookmark->save();

            return response()->json(['status' => 'success', 'message' => "Bookmarked"]);
        }else{
            return response()->json(['status' => 'warning', 'message' => "Login to Bookmark"]);
        }
     }

    /**
     * Initialize the home page
     * 
     * @return \Inertia\Response
     */
    public function initHomePage()
    {
        if (auth()->check()) {
            // You can change the route below to the correct dashboard route for your app
            return redirect()->route('subscriber.dashboard');
        }
        return Inertia::render('Home');
    }

    /**
     * Initialize the feedback page
     * 
     * @return \Inertia\Response
     */
    public function initFeedbackPage()
    {
        return Inertia::render('Feedback');
    }

    /**
     * Initialize the advertise page
     * 
     * @return \Inertia\Response
     */
    public function initAdvertisePage()
    {
        return Inertia::render('Advertise');
    }

    /**
     * Initialize the sponsorship page
     *
     * @return \Inertia\Response
     */
    public function initSponsorshipPage()
    {
        return Inertia::render('Sponsorship');
    }

/**
 * Search opportunities with various filters
 * 
 * @param Request $request
 * @return \Illuminate\Pagination\LengthAwarePaginator
 */
function searchOpportunities(Request $request)
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
    return $query->orderByDesc('opportunities.id')
                ->paginate($request->input('per_page', 20))
                ->withQueryString();
}

/**
 * Build the base query for opportunities
 *
 * @param int|null $user_id
 * @return \Illuminate\Database\Eloquent\Builder
 */
private function buildBaseQuery($user_id)
{
    return Oppty::query()
        ->select([
            'opportunities.id', 
            'opportunities.title', 
            'opportunities.deadline',
            'opportunities.slug',
            'opportunities.description',
            'opportunities.cover_img',
            \DB::raw('GROUP_CONCAT(DISTINCT continents.name SEPARATOR ", ") as continent_name'),
            \DB::raw('CASE WHEN bookmarks.id IS NOT NULL AND bookmarks.removed != 1 THEN 1 ELSE 0 END as is_bookmarked')
        ])
        ->where(function ($q) {
            $q->where('opportunities.deleted', '!=', 1)->orWhereNull('opportunities.deleted');
        })
        ->where('opportunities.status', 'published')
        ->where('opportunities.deadline', '>', Carbon::today())
        ->leftJoin('continent_selections', 'continent_selections.post_id', '=', 'opportunities.id')
        ->leftJoin('continents', 'continents.id', '=', 'continent_selections.continent_id')
        ->leftJoin('bookmarks', function ($join) use ($user_id) {
            $join->on('bookmarks.post_id', '=', 'opportunities.id')
                ->where('bookmarks.post_type', '=', 'opp')
                ->where('bookmarks.user_id', '=', $user_id);
        })
        ->groupBy([
            'opportunities.id', 
            'opportunities.title', 
            'opportunities.deadline',
            'opportunities.slug',
            'opportunities.description',
            'opportunities.cover_img',
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
        $q->whereRaw("MATCH(opportunities.title, opportunities.description) AGAINST(? IN BOOLEAN MODE)", [$searchKeyword . '*']);
        foreach ($words as $word) {
            $q->orWhereRaw("MATCH(opportunities.title, opportunities.description) AGAINST(? IN BOOLEAN MODE)", [$word . '*']);
        }
    });
    
    $results = $fullTextQuery->paginate(1);
    
    if (!$results->isEmpty()) {
        return $fullTextQuery;
    }
    
    // Strategy 2: LIKE search
    $likeQuery = clone $query;
    $likeQuery->where(function ($q) use ($searchKeyword, $words) {
        $q->where('opportunities.title', 'LIKE', "%$searchKeyword%")
          ->orWhere('opportunities.description', 'LIKE', "%$searchKeyword%");
          
        foreach ($words as $word) {
            $q->orWhere('opportunities.title', 'LIKE', "%$word%")
              ->orWhere('opportunities.description', 'LIKE', "%$word%");
        }
    });
    
    $results = $likeQuery->paginate(1);
    
    if (!$results->isEmpty()) {
        return $likeQuery;
    }
    
    // Strategy 3: SOUNDEX search
    $soundexQuery = clone $query;
    $soundexQuery->where(function ($q) use ($searchKeyword, $words) {
        $q->whereRaw('SOUNDEX(opportunities.title) = SOUNDEX(?)', [$searchKeyword])
          ->orWhereRaw('SOUNDEX(opportunities.description) = SOUNDEX(?)', [$searchKeyword]);
          
        foreach ($words as $word) {
            $q->orWhereRaw('SOUNDEX(opportunities.title) = SOUNDEX(?)', [$word])
              ->orWhereRaw('SOUNDEX(opportunities.description) = SOUNDEX(?)', [$word]);
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
            ->whereRaw("{$tableName}.post_id = opportunities.id")
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
        $query->whereMonth('opportunities.created_at', Carbon::parse($filters['month'])->month);
    }
    
    // Apply year filter
    if (!empty($filters['year'])) {
        $query->whereYear('opportunities.created_at', $filters['year']);
    }
    
    // Apply program status filter
    if ($filters['program_status'] === 'on_going') {
        $query->whereDate('opportunities.deadline', '>=', now());
    } elseif ($filters['program_status'] === 'up_coming') {
        $query->whereDate('opportunities.deadline', '>', now())
              ->orderBy('opportunities.deadline', 'asc');
    }
    
    // Apply date posted filter
    if (!empty($filters['date_posted'])) {
        switch ($filters['date_posted']) {
            case 'one_day':
                $query->whereDate('opportunities.created_at', '>=', now()->subDay());
                break;
            case 'one_week':
                $query->whereDate('opportunities.created_at', '>=', now()->subWeek());
                break;
            case 'two_weeks':
                $query->whereDate('opportunities.created_at', '>=', now()->subWeeks(2));
                break;
            case 'one_month':
                $query->whereDate('opportunities.created_at', '>=', now()->subMonth());
                break;
        }
    }
    
    return $query;
}












}
