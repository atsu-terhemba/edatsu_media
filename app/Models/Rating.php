<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'rating',
        'comment',
        'rateable_type',
        'rateable_id'
    ];

    protected $casts = [
        'rating' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Polymorphic relationship to the rateable model (Product, etc.)
    public function rateable()
    {
        return $this->morphTo();
    }

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scope for specific rating values
    public function scopeWithRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    // Validation rules for rating
    public static function rules()
    {
        return [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'user_id' => 'required|exists:users,id',
            'rateable_type' => 'required|string',
            'rateable_id' => 'required|integer',
        ];
    }
}
