<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'opportunity_categories',
        'opportunity_countries',
        'opportunity_regions',
        'opportunity_brands',
        'product_categories',
        'product_tags',
        'product_brands',
        'email_notifications',
        'opportunity_notifications',
        'product_notifications',
        'forum_notifications',
    ];

    protected $casts = [
        'opportunity_categories' => 'array',
        'opportunity_countries' => 'array',
        'opportunity_regions' => 'array',
        'opportunity_brands' => 'array',
        'product_categories' => 'array',
        'product_tags' => 'array',
        'product_brands' => 'array',
        'email_notifications' => 'boolean',
        'opportunity_notifications' => 'boolean',
        'product_notifications' => 'boolean',
        'forum_notifications' => 'boolean',
    ];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Get categories for opportunities
    public function opportunityCategories()
    {
        return $this->belongsToMany(Category::class, null, 'user_id', 'id')
            ->whereIn('categories.id', $this->opportunity_categories ?? []);
    }

    // Get countries for opportunities
    public function opportunityCountries()
    {
        return $this->belongsToMany(Country::class, null, 'user_id', 'id')
            ->whereIn('countries.id', $this->opportunity_countries ?? []);
    }

    // Get regions for opportunities
    public function opportunityRegions()
    {
        return $this->belongsToMany(Region::class, null, 'user_id', 'id')
            ->whereIn('regions.id', $this->opportunity_regions ?? []);
    }

    // Get brands for opportunities
    public function opportunityBrands()
    {
        return $this->belongsToMany(BrandLabel::class, null, 'user_id', 'id')
            ->whereIn('brand_labels.id', $this->opportunity_brands ?? []);
    }

    // Get categories for products
    public function productCategories()
    {
        return $this->belongsToMany(Category::class, null, 'user_id', 'id')
            ->whereIn('categories.id', $this->product_categories ?? []);
    }

    // Get tags for products
    public function productTags()
    {
        return $this->belongsToMany(Tag::class, null, 'user_id', 'id')
            ->whereIn('tags.id', $this->product_tags ?? []);
    }

    // Get brands for products
    public function productBrands()
    {
        return $this->belongsToMany(BrandLabel::class, null, 'user_id', 'id')
            ->whereIn('brand_labels.id', $this->product_brands ?? []);
    }
}
