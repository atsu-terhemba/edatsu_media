<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'slot_name',
        'page',
        'position',
        'size',
        'ad_code',
        'ad_type',
        'image_url',
        'link_url',
        'link_target',
        'is_active',
        'is_visible',
        'order'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_visible' => 'boolean',
        'order' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeVisible($query)
    {
        return $query->where('is_visible', true);
    }

    public function scopeForPage($query, $page)
    {
        return $query->where(function($q) use ($page) {
            $q->where('page', $page)->orWhere('page', 'all');
        });
    }

    public function scopeAtPosition($query, $position)
    {
        return $query->where('position', $position);
    }
}

