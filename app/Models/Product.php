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
    ];

    protected $casts = [
        'deleted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
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

}
