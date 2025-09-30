<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "products";

    protected $fillable = [
        'u_id',
        'user_role',
        'product_name',
        'product_description',
        'source_url',
        'direct_link',
        'youtube_link',
        'meta_description',
        'meta_keywords',
        'cover_img',
        'slug',
        'embeded_html',
        'views',
        'comments',
        'ratings',
        'deleted',
        'post_type',
        'is_trending',
        'trending_since',
        'trending_score',
    ];

    protected $casts = [
        'deleted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'is_trending' => 'boolean',
        'trending_since' => 'datetime',
    ];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'u_id');
    }

    // Get product status (handles both deleted column and deleted_at)
    public function getStatusAttribute()
    {
        if ($this->deleted == 1 || $this->deleted_at) {
            return 'deleted';
        }
        return 'active';
    }

    // Check if product is active
    public function isActive()
    {
        return $this->deleted == 0 && !$this->deleted_at;
    }

    // Format views count
    public function getFormattedViewsAttribute()
    {
        if ($this->views >= 1000000) {
            return round($this->views / 1000000, 1) . 'M';
        } elseif ($this->views >= 1000) {
            return round($this->views / 1000, 1) . 'K';
        }
        return $this->views ?: 0;
    }

    // Scope for active products
    public function scopeActive($query)
    {
        return $query->where('deleted', 0)->whereNull('deleted_at');
    }

    // Scope for deleted products
    public function scopeDeleted($query)
    {
        return $query->where(function($q) {
            $q->where('deleted', 1)->orWhereNotNull('deleted_at');
        });
    }

    // Polymorphic relationship with ratings
    public function ratings()
    {
        return $this->morphMany(Rating::class, 'rateable');
    }

    // Polymorphic relationship with comments
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    // Get average rating
    public function getAverageRatingAttribute()
    {
        return round($this->ratings()->avg('rating'), 1);
    }

    // Get total ratings count
    public function getTotalRatingsAttribute()
    {
        return $this->ratings()->count();
    }

    // Get total comments count (approved only)
    public function getTotalCommentsAttribute()
    {
        return $this->comments()->where('is_approved', true)->count();
    }

    // Get rating distribution
    public function getRatingDistribution()
    {
        $distribution = [];
        for ($i = 1; $i <= 5; $i++) {
            $count = $this->ratings()->where('rating', $i)->count();
            $percentage = $this->total_ratings > 0 ? ($count / $this->total_ratings) * 100 : 0;
            $distribution[$i] = [
                'count' => $count,
                'percentage' => round($percentage, 1)
            ];
        }
        return $distribution;
    }

}
