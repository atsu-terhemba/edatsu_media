<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subscription_id',
        'reference',
        'provider_reference',
        'payment_provider',
        'payment_method',
        'amount',
        'currency',
        'status',
        'type',
        'description',
        'provider_response',
        'paid_at',
    ];

    protected $casts = [
        'provider_response' => 'array',
        'paid_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    protected $hidden = [
        'provider_response',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function isSuccessful()
    {
        return $this->status === 'successful';
    }
}
