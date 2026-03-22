<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price_monthly_usd',
        'price_yearly_usd',
        'price_monthly_ngn',
        'price_yearly_ngn',
        'features',
        'limitations',
        'is_active',
        'is_popular',
        'sort_order',
    ];

    protected $casts = [
        'features' => 'array',
        'limitations' => 'array',
        'is_active' => 'boolean',
        'is_popular' => 'boolean',
        'price_monthly_usd' => 'decimal:2',
        'price_yearly_usd' => 'decimal:2',
        'price_monthly_ngn' => 'decimal:2',
        'price_yearly_ngn' => 'decimal:2',
    ];

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function getPrice($billingPeriod, $currency)
    {
        $column = "price_{$billingPeriod}_" . strtolower($currency);
        return $this->{$column} ?? 0;
    }
}
