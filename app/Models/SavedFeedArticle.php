<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'note',
    ];

    protected static function booted(): void
    {
        // Cascade-clean pivot rows + highlights when a saved article is
        // deleted, so nothing dangles when the parent goes away.
        static::deleting(function (self $article) {
            ArticleCollectionItem::where('saved_article_id', $article->id)->delete();
            ArticleHighlight::where('saved_article_id', $article->id)->delete();
        });
    }

    public function highlights(): HasMany
    {
        return $this->hasMany(ArticleHighlight::class, 'saved_article_id')->orderByDesc('created_at');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(
            ArticleCollection::class,
            'article_collection_items',
            'saved_article_id',
            'collection_id'
        )->withPivot('created_at');
    }
}
