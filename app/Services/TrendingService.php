<?php

namespace App\Services;

use App\Models\Oppty;
use App\Models\Product;
use App\Models\Bookmark;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TrendingService
{
    // Scoring weights
    const AGE_WEIGHT = 0.3;
    const BOOKMARKS_WEIGHT = 0.25;
    const VIEWS_WEIGHT = 0.25;
    const COMMENTS_WEIGHT = 0.2;

    // Trending thresholds
    const MINIMUM_SCORE = 10;
    const HOURS_TO_CONSIDER = 168; // 7 days

    /**
     * Calculate trending score for a model
     */
    public function calculateTrendingScore($model, $modelType)
    {
        $createdAt = Carbon::parse($model->created_at);
        $hoursOld = $createdAt->diffInHours(now());

        // Age score (newer is better, decays over time)
        $ageScore = max(0, (self::HOURS_TO_CONSIDER - $hoursOld) / self::HOURS_TO_CONSIDER * 100);

        // Bookmark score
        $bookmarkCount = 0;
        if ($modelType === 'opportunity') {
            $bookmarkCount = Bookmark::where('post_id', $model->id)
                ->where('post_type', 'opp')
                ->count();
        } elseif ($modelType === 'product') {
            $bookmarkCount = Bookmark::where('post_id', $model->id)
                ->where('post_type', 'product')
                ->count();
        }
        $bookmarkScore = min(100, $bookmarkCount * 10);

        // Views score (if available)
        $viewScore = 0;
        if (isset($model->views)) {
            $viewScore = min(100, $model->views / 10);
        }

        // Comments score (if available)
        $commentScore = 0;
        if (isset($model->comments_count)) {
            $commentScore = min(100, $model->comments_count * 15);
        }

        // Calculate weighted score
        $totalScore = 
            ($ageScore * self::AGE_WEIGHT) +
            ($bookmarkScore * self::BOOKMARKS_WEIGHT) +
            ($viewScore * self::VIEWS_WEIGHT) +
            ($commentScore * self::COMMENTS_WEIGHT);

        return round($totalScore, 2);
    }

    /**
     * Update trending status for opportunities
     */
    public function updateOpportunitiesTrending()
    {
        $opportunities = Oppty::where('created_at', '>=', now()->subHours(self::HOURS_TO_CONSIDER))
            ->get();

        foreach ($opportunities as $opportunity) {
            $score = $this->calculateTrendingScore($opportunity, 'opportunity');
            
            $opportunity->trending_score = $score;
            
            if ($score >= self::MINIMUM_SCORE && !$opportunity->is_trending) {
                $opportunity->is_trending = true;
                $opportunity->trending_since = now();
            } elseif ($score < self::MINIMUM_SCORE && $opportunity->is_trending) {
                $opportunity->is_trending = false;
                $opportunity->trending_since = null;
            }
            
            $opportunity->save();
        }

        // Also check older trending items to see if they should stop trending
        $oldTrending = Oppty::where('is_trending', true)
            ->where('created_at', '<', now()->subHours(self::HOURS_TO_CONSIDER))
            ->get();

        foreach ($oldTrending as $opportunity) {
            $opportunity->is_trending = false;
            $opportunity->trending_since = null;
            $opportunity->trending_score = 0;
            $opportunity->save();
        }
    }

    /**
     * Update trending status for products
     */
    public function updateProductsTrending()
    {
        $products = Product::where('created_at', '>=', now()->subHours(self::HOURS_TO_CONSIDER))
            ->get();

        foreach ($products as $product) {
            $score = $this->calculateTrendingScore($product, 'product');
            
            $product->trending_score = $score;
            
            if ($score >= self::MINIMUM_SCORE && !$product->is_trending) {
                $product->is_trending = true;
                $product->trending_since = now();
            } elseif ($score < self::MINIMUM_SCORE && $product->is_trending) {
                $product->is_trending = false;
                $product->trending_since = null;
            }
            
            $product->save();
        }

        // Also check older trending items to see if they should stop trending
        $oldTrending = Product::where('is_trending', true)
            ->where('created_at', '<', now()->subHours(self::HOURS_TO_CONSIDER))
            ->get();

        foreach ($oldTrending as $product) {
            $product->is_trending = false;
            $product->trending_since = null;
            $product->trending_score = 0;
            $product->save();
        }
    }

    /**
     * Update trending status for all types
     */
    public function updateAllTrending()
    {
        $this->updateOpportunitiesTrending();
        $this->updateProductsTrending();
    }

    /**
     * Manually set trending status for a model
     */
    public function setTrending($model, $modelType, $trending = true)
    {
        if ($trending) {
            $model->is_trending = true;
            if (!$model->trending_since) {
                $model->trending_since = Carbon::now();
            }
            // Calculate score based on current metrics
            $model->trending_score = $this->calculateTrendingScore($model, $modelType);
        } else {
            $model->is_trending = false;
            $model->trending_since = null;
            $model->trending_score = 0;
        }
        
        $model->save();
        return $model;
    }

    /**
     * Get trending opportunities with relationships
     */
    public function getTrendingOpportunities($limit = 10)
    {
        return Oppty::where('is_trending', true)
            ->orderBy('trending_score', 'desc')
            ->orderBy('trending_since', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get trending products with relationships
     */
    public function getTrendingProducts($limit = 10)
    {
        return Product::where('is_trending', true)
            ->orderBy('trending_score', 'desc')
            ->orderBy('trending_since', 'desc')
            ->limit($limit)
            ->get();
    }
}