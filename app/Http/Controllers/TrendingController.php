<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\TrendingService;
use App\Models\Oppty;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class TrendingController extends Controller
{
    protected $trendingService;

    public function __construct(TrendingService $trendingService)
    {
        $this->trendingService = $trendingService;
    }

    /**
     * Get trending opportunities
     */
    public function getTrendingOpportunities(Request $request)
    {
        $limit = $request->get('limit', 10);
        $opportunities = $this->trendingService->getTrendingOpportunities($limit);
        
        return response()->json([
            'success' => true,
            'data' => $opportunities,
            'count' => $opportunities->count()
        ]);
    }

    /**
     * Get trending products
     */
    public function getTrendingProducts(Request $request)
    {
        $limit = $request->get('limit', 10);
        $products = $this->trendingService->getTrendingProducts($limit);
        
        return response()->json([
            'success' => true,
            'data' => $products,
            'count' => $products->count()
        ]);
    }

    /**
     * Manually set trending status (Admin only)
     */
    public function setTrendingStatus(Request $request)
    {
        // Check if user is admin
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $request->validate([
            'type' => 'required|in:opportunity,product',
            'id' => 'required|integer',
            'trending' => 'required|boolean'
        ]);

        $type = $request->input('type');
        $id = $request->input('id');
        $trending = $request->input('trending');

        if ($type === 'opportunity') {
            $model = Oppty::find($id);
            $modelType = 'opportunity';
        } else {
            $model = Product::find($id);
            $modelType = 'product';
        }

        if (!$model) {
            return response()->json([
                'success' => false,
                'message' => ucfirst($type) . ' not found'
            ], 404);
        }

        $updatedModel = $this->trendingService->setTrending($model, $modelType, $trending);

        return response()->json([
            'success' => true,
            'message' => ucfirst($type) . ' trending status updated successfully',
            'data' => [
                'id' => $updatedModel->id,
                'is_trending' => $updatedModel->is_trending,
                'trending_since' => $updatedModel->trending_since,
                'trending_score' => $updatedModel->trending_score
            ]
        ]);
    }

    /**
     * Update trending status via API (Admin only)
     */
    public function updateTrendingStatus(Request $request)
    {
        // Check if user is admin
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $type = $request->get('type', 'all');

        try {
            switch ($type) {
                case 'opportunities':
                    $this->trendingService->updateOpportunitiesTrending();
                    break;
                case 'products':
                    $this->trendingService->updateProductsTrending();
                    break;
                case 'all':
                default:
                    $this->trendingService->updateAllTrending();
                    break;
            }

            return response()->json([
                'success' => true,
                'message' => 'Trending status updated successfully',
                'trending_opportunities' => $this->trendingService->getTrendingOpportunities(5)->count(),
                'trending_products' => $this->trendingService->getTrendingProducts(5)->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating trending status: ' . $e->getMessage()
            ], 500);
        }
    }
}
