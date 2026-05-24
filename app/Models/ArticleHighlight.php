<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleHighlight extends Model
{
    use HasFactory;

    protected $fillable = [
        'saved_article_id',
        'text',
        'color',
    ];

    public function article()
    {
        return $this->belongsTo(SavedFeedArticle::class, 'saved_article_id');
    }
}
