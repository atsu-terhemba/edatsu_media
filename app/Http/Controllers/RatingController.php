<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rating;
use App\Models\Product;

class RatingController extends Controller
{


    public function getUserRating($userId, $rateableType, $rateableId)
    {
        return Rating::where('user_id', $userId)
            ->where('rateable_type', $rateableType)
            ->where('rateable_id', $rateableId)
            ->first();
    }

    public function rateProduct(Request $request, $id)
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Please login to rate this product'
            ], 401);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        try {
            $existingRating = Rating::where('user_id', auth()->id())
                ->where('rateable_type', Product::class)
                ->where('rateable_id', $id)
                ->first();

            if ($existingRating) {
                $existingRating->update([
                    'rating' => $validated['rating'],
                    'comment' => $validated['comment']
                ]);
                $message = 'Rating updated successfully';
            } else {
                Rating::create([
                    'user_id' => auth()->id(),
                    'rating' => $validated['rating'],
                    'comment' => $validated['comment'],
                    'rateable_type' => Product::class,
                    'rateable_id' => $id
                ]);
                $message = 'Rating submitted successfully';
            }

            return response()->json([
                'success' => true,
                'message' => $message
            ]);
        } catch (\Exception $e) {
            \Log::error('Error saving rating: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error saving rating: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getRatings($id)
    {
        try {
            $ratings = Rating::where('rateable_type', Product::class)
                ->where('rateable_id', $id)
                ->with('user:id,name')
                ->orderBy('created_at', 'desc')
                ->get();

            $averageRating = $ratings->avg('rating') ?? 0;
            $totalRatings = $ratings->count();

            // Calculate distribution
            $distribution = [];
            for ($i = 1; $i <= 5; $i++) {
                // Use filter instead of where for exact numeric comparison
                $count = $ratings->filter(function($rating) use ($i) {
                    return (int)$rating->rating === $i;
                })->count();
                
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
        } catch (\Exception $e) {
            \Log::error('Error getting ratings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching ratings: ' . $e->getMessage()
            ], 500);
        }
    }

    //
    public function store(Request $request)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'rateable_type' => 'required|string',
            'rateable_id' => 'required|integer'
        ]);

        $commentableMap = [
        'opp' => \App\Models\Oppty::class,
        ];

        $ratableType = $commentableMap[$request->rateable_type];

        try {

            $existingRating = $this->getUserRating(
                auth()->id(),
                $ratableType,
                $validated['rateable_id']
            );

            if ($existingRating) {
                // Update existing rating
                $existingRating->update([
                    'rating' => $validated['rating'],
                    'comment' => $validated['comment']
                ]);

                $rating = $existingRating;
                $message = 'Rating updated successfully';
            } else {

                $rating = Rating::create([
                    'user_id' => auth()->id(),
                    'rating' => $validated['rating'],
                    'comment' => $validated['comment'],
                    'rateable_type' => $ratableType,
                    'rateable_id' => $validated['rateable_id']
                ]);

                $message = 'Rating saved successfully' ;

            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'rating' => $rating
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error saving rating'
            ], 500);
        }
    }
}
