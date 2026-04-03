<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedFeedArticle extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'article_title',
        'article_link',
        'article_link_hash',
        'article_description',
        'article_date',
        'feed_title',
        'feed_favicon',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
