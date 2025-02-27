<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rating;

class RatingController extends Controller
{


    public function getUserRating($userId, $rateableType, $rateableId)
    {
        return Rating::where('user_id', $userId)
            ->where('rateable_type', $rateableType)
            ->where('rateable_id', $rateableId)
            ->first();
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
