<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserNewsFeed extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'feed_url',
        'site_url',
        'feed_title',
        'feed_favicon',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
