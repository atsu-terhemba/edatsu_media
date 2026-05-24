<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ArticleCollection extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'color',
        'is_public',
        'slug',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    /**
     * Generate a URL slug from the collection name unique within the owner's
     * collections. Used the first time a collection is made public.
     */
    public function ensureSlug(): string
    {
        if ($this->slug) return $this->slug;

        $base = \Illuminate\Support\Str::slug($this->name);
        if ($base === '') $base = 'list';
        $base = substr($base, 0, 60);

        $candidate = $base;
        $i = 2;
        while (self::where('user_id', $this->user_id)
            ->where('slug', $candidate)
            ->where('id', '!=', $this->id)
            ->exists()
        ) {
            $candidate = $base . '-' . $i++;
            if ($i > 50) {
                $candidate = $base . '-' . substr(bin2hex(random_bytes(3)), 0, 6);
                break;
            }
        }
        $this->slug = $candidate;
        $this->save();
        return $candidate;
    }

    public function items(): HasMany
    {
        return $this->hasMany(ArticleCollectionItem::class, 'collection_id');
    }

    public function articles(): BelongsToMany
    {
        // Pivot only stores created_at — see the migration for article_collection_items.
        return $this->belongsToMany(
            SavedFeedArticle::class,
            'article_collection_items',
            'collection_id',
            'saved_article_id'
        )->withPivot('created_at');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
