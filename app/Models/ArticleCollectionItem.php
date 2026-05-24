<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleCollectionItem extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'collection_id',
        'saved_article_id',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function collection()
    {
        return $this->belongsTo(ArticleCollection::class, 'collection_id');
    }

    public function article()
    {
        return $this->belongsTo(SavedFeedArticle::class, 'saved_article_id');
    }
}
