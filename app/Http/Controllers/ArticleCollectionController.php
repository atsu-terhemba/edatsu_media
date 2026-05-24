<?php

namespace App\Http\Controllers;

use App\Models\ArticleCollection;
use App\Models\ArticleCollectionItem;
use App\Models\SavedFeedArticle;
use App\Services\FeatureGate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ArticleCollectionController extends Controller
{
    /**
     * List the current user's collections with item counts.
     */
    public function index()
    {
        $collections = ArticleCollection::query()
            ->where('user_id', Auth::id())
            ->withCount('items')
            ->orderBy('name')
            ->get(['id', 'name', 'color', 'is_public', 'slug', 'created_at']);

        return response()->json([
            'collections' => $collections->map(fn ($c) => $this->serialize($c))->values(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'  => 'required|string|min:1|max:80',
            'color' => 'nullable|string|max:16',
        ]);

        $name = trim($data['name']);

        $existing = ArticleCollection::where('user_id', Auth::id())
            ->where('name', $name)
            ->first();
        if ($existing) {
            return response()->json([
                'message'    => 'A collection with this name already exists.',
                'collection' => $this->serialize($existing),
            ], 409);
        }

        $collection = ArticleCollection::create([
            'user_id' => Auth::id(),
            'name'    => $name,
            'color'   => $data['color'] ?? null,
        ]);

        return response()->json(['collection' => $this->serialize($collection)], 201);
    }

    public function update(Request $request, int $id)
    {
        $collection = ArticleCollection::where('user_id', Auth::id())->findOrFail($id);

        $data = $request->validate([
            'name'      => 'sometimes|string|min:1|max:80',
            'color'     => 'sometimes|nullable|string|max:16',
            'is_public' => 'sometimes|boolean',
        ]);

        if (isset($data['name'])) {
            $name = trim($data['name']);
            $clash = ArticleCollection::where('user_id', Auth::id())
                ->where('name', $name)
                ->where('id', '!=', $collection->id)
                ->exists();
            if ($clash) {
                return response()->json(['message' => 'A collection with this name already exists.'], 409);
            }
            $collection->name = $name;
        }
        if (array_key_exists('color', $data)) {
            $collection->color = $data['color'] ?: null;
        }
        if (array_key_exists('is_public', $data)) {
            $newPublic = (bool) $data['is_public'];
            $wasPublic = (bool) $collection->is_public;

            // Activating publication = consuming a public-list slot. Skip the
            // check on the reverse direction (unpublishing always allowed) and
            // on a no-op flip.
            if ($newPublic && !$wasPublic) {
                $currentPublicCount = ArticleCollection::where('user_id', Auth::id())
                    ->where('is_public', true)
                    ->count();
                if (!FeatureGate::withinQuota($request->user(), 'public_lists', $currentPublicCount)) {
                    $limit = FeatureGate::quotaFor('public_lists');
                    return FeatureGate::denied(
                        'public_lists',
                        "Free plan lets you publish {$limit} reading list" . ($limit === 1 ? '' : 's')
                            . ". Upgrade to Pro to share unlimited public lists.",
                        $limit
                    );
                }
            }

            $collection->is_public = $newPublic;
            if ($collection->is_public) {
                // Ensure both user + collection have URL slugs before going public.
                Auth::user()->ensureProfileSlug();
                $collection->save(); // need an id for slug-uniqueness query
                $collection->ensureSlug();
            }
        }
        $collection->save();

        return response()->json(['collection' => $this->serialize($collection->refresh())]);
    }

    public function destroy(int $id)
    {
        $collection = ArticleCollection::where('user_id', Auth::id())->findOrFail($id);

        // Drop pivot rows first; articles themselves are untouched
        ArticleCollectionItem::where('collection_id', $collection->id)->delete();
        $collection->delete();

        return response()->json(['ok' => true]);
    }

    /**
     * Add one or more saved articles to a collection. Idempotent.
     */
    public function addItems(Request $request, int $id)
    {
        $collection = ArticleCollection::where('user_id', Auth::id())->findOrFail($id);

        $data = $request->validate([
            'saved_article_ids'   => 'required|array|min:1|max:100',
            'saved_article_ids.*' => 'integer',
        ]);

        // Only allow articles the user actually owns
        $ownedIds = SavedFeedArticle::where('user_id', Auth::id())
            ->whereIn('id', $data['saved_article_ids'])
            ->pluck('id')
            ->all();

        $now = now();
        $rows = array_map(fn ($aid) => [
            'collection_id'    => $collection->id,
            'saved_article_id' => $aid,
            'created_at'       => $now,
        ], $ownedIds);

        // insertOrIgnore relies on the unique index for idempotency
        if (!empty($rows)) {
            ArticleCollectionItem::insertOrIgnore($rows);
        }

        return response()->json([
            'ok'         => true,
            'collection' => $this->serialize($collection->refresh()),
            'added'      => count($ownedIds),
        ]);
    }

    public function removeItem(int $id, int $savedArticleId)
    {
        $collection = ArticleCollection::where('user_id', Auth::id())->findOrFail($id);

        ArticleCollectionItem::where('collection_id', $collection->id)
            ->where('saved_article_id', $savedArticleId)
            ->delete();

        return response()->json(['ok' => true]);
    }

    protected function serialize(ArticleCollection $c): array
    {
        $shareUrl = null;
        if ($c->is_public && $c->slug) {
            $owner = $c->user ?? \App\Models\User::find($c->user_id);
            if ($owner && $owner->profile_slug) {
                $shareUrl = url("/u/{$owner->profile_slug}/{$c->slug}");
            }
        }

        return [
            'id'         => $c->id,
            'name'       => $c->name,
            'color'      => $c->color,
            'is_public'  => (bool) $c->is_public,
            'slug'       => $c->slug,
            'share_url'  => $shareUrl,
            'item_count' => (int) (property_exists($c, 'items_count') && $c->items_count !== null
                ? $c->items_count
                : $c->items()->count()),
            'created_at' => $c->created_at?->toIso8601String(),
        ];
    }
}
