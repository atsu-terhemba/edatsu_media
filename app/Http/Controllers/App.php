<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Oppty;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class App extends Controller
{
    //...
    function searchOpportunities(Request $request)
    {

    $user_id = null;
    if(Auth::check()){
        $user_id = Auth::id();
    }

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
    
    // Extract validated data
    $program_status = extractSelectData($validatedData['program_status'] ?? '');
    $categories = extractSelectData($validatedData['categories'] ?? '');
    $continents = extractSelectData($validatedData['continents'] ?? '');
    $countries = extractSelectData($validatedData['countries'] ?? '');
    $brands = extractSelectData($validatedData['brands'] ?? '');
    $date_posted = extractSelectData($validatedData['datePosted'] ?? '');
    $month = extractSelectData($validatedData['month'] ?? '');
    $year = extractSelectData($validatedData['year'] ?? '');
    $searchKeyword = $validatedData['search_keyword'] ?? '';
    
    $query = Oppty::query()
    ->select('opportunities.id', 
            'opportunities.title', 
            'opportunities.deadline',
            'opportunities.slug',
            'opportunities.description',
            'opportunities.cover_img',
            // Add other specific columns you need
            \DB::raw('GROUP_CONCAT(DISTINCT continents.name SEPARATOR ", ") as continent_name'),
            \DB::raw('CASE WHEN bookmarks.id IS NOT NULL AND bookmarks.removed != 1 THEN 1 ELSE 0 END as is_bookmarked')
    )
    ->where('opportunities.deleted', '!=', 1)
    ->where('opportunities.deadline', '>', Carbon::today())
    ->leftJoin('continent_selections', 'continent_selections.post_id', '=', 'opportunities.id')
    ->leftJoin('continents', 'continents.id', '=', 'continent_selections.continent_id')
    ->leftJoin('bookmarks', function ($join) use ($user_id) {
        $join->on('bookmarks.post_id', '=', 'opportunities.id')
            ->where('bookmarks.post_type', '=', 'opp')
            ->where('bookmarks.user_id', '=', $user_id);
    })
    ->groupBy('opportunities.id', 
            'opportunities.title', 
            'opportunities.deadline',
            'opportunities.slug',
            'opportunities.description',
            'opportunities.cover_img',
            \DB::raw('CASE WHEN bookmarks.id IS NOT NULL AND bookmarks.removed != 1 THEN 1 ELSE 0 END')
    );

    // Optimized search keyword logic
    if (!empty($searchKeyword)) {
        $words = preg_split('/\s+/', $searchKeyword, -1, PREG_SPLIT_NO_EMPTY);

        $query->where(function ($q) use ($searchKeyword, $words) {
            $q->whereRaw("MATCH(opportunities.title, opportunities.description) AGAINST(? IN BOOLEAN MODE)", [$searchKeyword . '*']);
            foreach ($words as $word) {
                $q->orWhereRaw("MATCH(opportunities.title, opportunities.description) AGAINST(? IN BOOLEAN MODE)", [$word . '*']);
            }
        });

        $results = $query->paginate($request->input('per_page', 20))->withQueryString();

        if ($results->isEmpty()) {
            $query->orWhere(function ($q) use ($searchKeyword, $words) {
                $q->where('opportunities.title', 'LIKE', "%$searchKeyword%")
                ->orWhere('opportunities.description', 'LIKE', "%$searchKeyword%");

                foreach ($words as $word) {
                    $q->orWhere('opportunities.title', 'LIKE', "%$word%")
                    ->orWhere('opportunities.description', 'LIKE', "%$word%");
                }
            });

            $results = $query->paginate($request->input('per_page', 20))->withQueryString();

            if ($results->isEmpty()) {
                $query->orWhere(function ($q) use ($searchKeyword, $words) {
                    $q->whereRaw('SOUNDEX(opportunities.title) = SOUNDEX(?)', [$searchKeyword])
                    ->orWhereRaw('SOUNDEX(opportunities.description) = SOUNDEX(?)', [$searchKeyword]);

                    foreach ($words as $word) {
                        $q->orWhereRaw('SOUNDEX(opportunities.title) = SOUNDEX(?)', [$word])
                        ->orWhereRaw('SOUNDEX(opportunities.description) = SOUNDEX(?)', [$word]);
                    }
                });
            }
        }
    }

    $post_type = 'opportunity';

    if(!empty($brands)) {
            $brandIds = json_decode($brands, true);
            if (count($brandIds) > 0) {
                //$countryIds = array_column($countryIds, 'id');
                $query->whereExists(function ($subquery) use ($brandIds, $post_type) {
                    $subquery->select(DB::raw(1))
                        ->from('brand_labels_selections')
                        ->where('post_type', $post_type)
                        ->whereRaw('brand_labels_selections.post_id = opportunities.id')
                        ->whereIn('brand_labels_selections.brand_label_id', $brandIds);
                });
            }
        }

    if (!empty($countries)) {
        $countryIds = json_decode($countries, true);
        if (count($countryIds) > 0) {
            //$countryIds = array_column($countryIds, 'id');
            $query->whereExists(function ($subquery) use ($countryIds, $post_type) {
                $subquery->select(DB::raw(1))
                    ->from('country_selections')
                    ->where('post_type', $post_type)
                    ->whereRaw('country_selections.post_id = opportunities.id')
                    ->whereIn('country_selections.country_id', $countryIds);
            });
        }
    }

    if (!empty($categories)) {
        $categoryIds = json_decode($categories, true);
        if (count($categoryIds) > 0) {
         //   $categoryIds = array_column($categoryIds, 'id');
            $query->whereExists(function ($subquery) use ($categoryIds, $post_type) {
                $subquery->select(DB::raw(1))
                    ->from('category_selections')
                    ->where('post_type', $post_type)
                    ->whereRaw('category_selections.post_id = opportunities.id')
                    ->whereIn('category_selections.category_id', $categoryIds);
            });
        }
    }

    if (!empty($continents)) {
        $continentIds = json_decode($continents, true);
        if (count($continentIds) > 0) {
            //$continentIds = array_column($continentIds, 'id');
            $query->whereExists(function ($subquery) use ($continentIds, $post_type) {
                $subquery->select(DB::raw(1))
                    ->from('continent_selections')
                    ->where('post_type', $post_type)
                    ->whereRaw('continent_selections.post_id = opportunities.id')
                    ->whereIn('continent_selections.continent_id', $continentIds);
            });
        }
    }


    if (!empty($month)) {
        $query->whereMonth('opportunities.created_at', Carbon::parse($month)->month);
    }

    if (!empty($year)) {
        $query->whereYear('opportunities.created_at', $year);
    }

    if ($program_status === 'on_going') {
        $query->whereDate('opportunities.deadline', '>=', now());
    } elseif ($program_status === 'up_coming') {
        $query->whereDate('opportunities.deadline', '>', now())->orderBy('opportunities.deadline', 'asc');
    }

    if (!empty($date_posted)) {
        switch ($date_posted) {
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
    

    return $query->distinct()->orderByDesc('opportunities.id')->paginate($request->input('per_page', 20))->withQueryString();
}
















}
