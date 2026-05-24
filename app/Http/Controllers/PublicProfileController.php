<?php

namespace App\Http\Controllers;

use App\Models\ArticleCollection;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicProfileController extends Controller
{
    /**
     * Public profile page — shows the author's public collections only.
     */
    public function show(string $profileSlug)
    {
        $user = User::where('profile_slug', $profileSlug)->firstOrFail();

        $collections = ArticleCollection::query()
            ->where('user_id', $user->id)
            ->where('is_public', true)
            ->whereNotNull('slug')
            ->withCount('items')
            ->orderBy('name')
            ->get(['id', 'name', 'color', 'slug', 'created_at']);

        return Inertia::render('PublicProfile', [
            'profile' => $this->serializeUser($user),
            'collections' => $collections->map(fn ($c) => [
                'name'       => $c->name,
                'slug'       => $c->slug,
                'color'      => $c->color,
                'item_count' => (int) $c->items_count,
                'updated_at' => $c->created_at?->toIso8601String(),
            ])->values(),
        ]);
    }

    /**
     * Public collection page — read-only article list.
     * Notes and highlights are PRIVATE and never included here.
     */
    public function showCollection(string $profileSlug, string $collectionSlug)
    {
        $user = User::where('profile_slug', $profileSlug)->firstOrFail();

        $collection = ArticleCollection::query()
            ->where('user_id', $user->id)
            ->where('slug', $collectionSlug)
            ->where('is_public', true)
            ->firstOrFail();

        $articles = $collection->articles()
            ->orderByDesc('article_collection_items.created_at')
            ->get([
                'saved_feed_articles.id',
                'saved_feed_articles.article_title',
                'saved_feed_articles.article_link',
                'saved_feed_articles.article_description',
                'saved_feed_articles.article_date',
                'saved_feed_articles.feed_title',
                'saved_feed_articles.feed_favicon',
                'saved_feed_articles.created_at',
            ])
            ->map(fn ($a) => [
                'id'                 => $a->id,
                'title'              => $a->article_title,
                'link'               => $a->article_link,
                'description'        => $a->article_description,
                'article_date'       => $a->article_date,
                'feed_title'         => $a->feed_title,
                'feed_favicon'       => $a->feed_favicon,
                'added_at'           => $a->pivot?->created_at?->toIso8601String() ?? $a->created_at?->toIso8601String(),
            ])
            ->values();

        return Inertia::render('PublicCollection', [
            'profile' => $this->serializeUser($user),
            'collection' => [
                'name'  => $collection->name,
                'slug'  => $collection->slug,
                'color' => $collection->color,
                'count' => $articles->count(),
            ],
            'articles' => $articles,
        ]);
    }

    protected function serializeUser(User $u): array
    {
        return [
            'name'         => $u->name,
            'profile_slug' => $u->profile_slug,
            'avatar'       => $u->avatar ?: ($u->profile_photo_path ?: null),
        ];
    }
}
