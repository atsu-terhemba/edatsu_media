<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\ForumPost;
use App\Models\ForumReport;
use App\Models\ForumThread;
use App\Models\ForumThreadMute;
use App\Models\Notification;
use App\Models\UserPreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ForumController extends Controller
{
    /**
     * Forum index — list non-hidden threads newest first.
     */
    public function index()
    {
        $threads = ForumThread::with(['user:id,name,profile_photo_path', 'categories:id,name,slug'])
            ->where('is_hidden', false)
            ->orderByDesc('last_activity_at')
            ->orderByDesc('created_at')
            ->limit(100)
            ->get()
            ->map(fn ($t) => $this->formatThread($t));

        return Inertia::render('Forum', [
            'threads' => $threads,
        ]);
    }

    /**
     * Show a single thread with its posts.
     */
    public function show($id)
    {
        $thread = ForumThread::with(['user:id,name,profile_photo_path', 'categories:id,name,slug'])
            ->where('is_hidden', false)
            ->findOrFail($id);

        $posts = ForumPost::with('user:id,name,profile_photo_path')
            ->where('thread_id', $thread->id)
            ->where('is_hidden', false)
            ->orderBy('created_at')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'parent_id' => $p->parent_id,
                'body' => $p->body,
                'created_at' => $p->created_at?->diffForHumans(),
                'user' => $p->user ? [
                    'id' => $p->user->id,
                    'name' => $p->user->name,
                    'profile_photo' => $p->user->profile_photo_path,
                ] : null,
            ]);

        $isMuted = false;
        if (Auth::check()) {
            $isMuted = ForumThreadMute::where('user_id', Auth::id())
                ->where('thread_id', $thread->id)
                ->exists();
        }

        return Inertia::render('ForumThread', [
            'thread' => $this->formatThread($thread),
            'posts' => $posts,
            'isMuted' => $isMuted,
        ]);
    }

    /**
     * Return category list for the "start a discussion" modal.
     */
    public function categories()
    {
        $categories = Category::where('deleted', 0)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return response()->json(['categories' => $categories]);
    }

    /**
     * Create a new forum thread anchored to an article.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'nullable|string|max:10000',
            'article_link' => 'nullable|string|max:500',
            'article_title' => 'nullable|string|max:255',
            'article_source' => 'nullable|string|max:255',
            'category_ids' => 'required|array|min:1|max:3',
            'category_ids.*' => 'integer|exists:categories,id',
            'force' => 'nullable|boolean',
        ]);

        // Duplicate-article detection: if another thread exists for this article
        // within the last 30 days, return 409 unless force=true.
        $articleHash = null;
        if (!empty($validated['article_link'])) {
            $articleHash = hash('sha256', $validated['article_link']);
            if (empty($validated['force'])) {
                $existing = ForumThread::where('article_link_hash', $articleHash)
                    ->where('is_hidden', false)
                    ->where('created_at', '>=', now()->subDays(30))
                    ->orderByDesc('created_at')
                    ->first();

                if ($existing) {
                    return response()->json([
                        'duplicate' => true,
                        'thread' => [
                            'id' => $existing->id,
                            'title' => $existing->title,
                            'posts_count' => $existing->posts_count,
                        ],
                        'message' => 'A discussion for this article already exists',
                    ], 409);
                }
            }
        }

        $thread = DB::transaction(function () use ($validated, $articleHash) {
            $thread = ForumThread::create([
                'user_id' => Auth::id(),
                'title' => $validated['title'],
                'body' => $validated['body'] ?? null,
                'article_link' => $validated['article_link'] ?? null,
                'article_link_hash' => $articleHash,
                'article_title' => $validated['article_title'] ?? null,
                'article_source' => $validated['article_source'] ?? null,
                'posts_count' => 0,
                'last_activity_at' => now(),
            ]);

            $thread->categories()->sync($validated['category_ids']);

            return $thread;
        });

        $this->notifyMatchingUsers($thread, $validated['category_ids']);

        return response()->json([
            'thread' => [
                'id' => $thread->id,
                'title' => $thread->title,
            ],
            'message' => 'Discussion started',
        ], 201);
    }

    /**
     * Reply to a thread.
     */
    public function reply(Request $request, $id)
    {
        $validated = $request->validate([
            'body' => 'required|string|max:10000',
            'parent_id' => 'nullable|integer',
        ]);

        $thread = ForumThread::where('is_hidden', false)->findOrFail($id);

        // If replying to a specific post, verify it belongs to this thread.
        if (!empty($validated['parent_id'])) {
            $parentBelongs = ForumPost::where('id', $validated['parent_id'])
                ->where('thread_id', $thread->id)
                ->exists();
            if (!$parentBelongs) {
                return response()->json(['error' => 'Invalid parent post'], 422);
            }
        }

        $post = DB::transaction(function () use ($thread, $validated) {
            $post = ForumPost::create([
                'thread_id' => $thread->id,
                'parent_id' => $validated['parent_id'] ?? null,
                'user_id' => Auth::id(),
                'body' => $validated['body'],
            ]);

            $thread->increment('posts_count');
            $thread->update(['last_activity_at' => now()]);

            return $post;
        });

        $this->notifyOnReply($thread, $post);

        return response()->json([
            'post' => [
                'id' => $post->id,
                'parent_id' => $post->parent_id,
                'body' => $post->body,
                'created_at' => $post->created_at->diffForHumans(),
                'user' => [
                    'id' => Auth::user()->id,
                    'name' => Auth::user()->name,
                    'profile_photo' => Auth::user()->profile_photo_path,
                ],
            ],
        ], 201);
    }

    /**
     * Mute a thread (stop reply notifications for this user).
     */
    public function mute($id)
    {
        $thread = ForumThread::findOrFail($id);
        ForumThreadMute::firstOrCreate([
            'user_id' => Auth::id(),
            'thread_id' => $thread->id,
        ]);
        return response()->json(['muted' => true]);
    }

    public function unmute($id)
    {
        ForumThreadMute::where('user_id', Auth::id())
            ->where('thread_id', $id)
            ->delete();
        return response()->json(['muted' => false]);
    }

    /**
     * Report a thread or post.
     */
    public function report(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:thread,post',
            'id' => 'required|integer',
            'reason' => 'nullable|string|max:500',
        ]);

        // Verify the target exists
        if ($validated['type'] === 'thread') {
            ForumThread::findOrFail($validated['id']);
        } else {
            ForumPost::findOrFail($validated['id']);
        }

        ForumReport::create([
            'reportable_type' => $validated['type'],
            'reportable_id' => $validated['id'],
            'user_id' => Auth::id(),
            'reason' => $validated['reason'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json(['message' => 'Report submitted']);
    }

    /* ─────── Admin moderation ─────── */

    public function adminReports(Request $request)
    {
        $status = $request->query('status', 'pending');
        $valid = ['pending', 'actioned', 'dismissed', 'all'];
        if (!in_array($status, $valid, true)) $status = 'pending';

        $query = ForumReport::with('user:id,name')
            ->orderByDesc('created_at')
            ->limit(200);

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $counts = [
            'pending' => ForumReport::where('status', 'pending')->count(),
            'actioned' => ForumReport::where('status', 'actioned')->count(),
            'dismissed' => ForumReport::where('status', 'dismissed')->count(),
        ];
        $counts['all'] = $counts['pending'] + $counts['actioned'] + $counts['dismissed'];

        $reports = $query->get()
            ->map(function ($r) {
                $target = $r->reportable_type === 'thread'
                    ? ForumThread::find($r->reportable_id)
                    : ForumPost::find($r->reportable_id);

                return [
                    'id' => $r->id,
                    'type' => $r->reportable_type,
                    'target_id' => $r->reportable_id,
                    'reason' => $r->reason,
                    'created_at' => $r->created_at?->diffForHumans(),
                    'reporter' => $r->user?->name,
                    'target_preview' => $target ? mb_strimwidth(
                        $r->reportable_type === 'thread' ? $target->title : $target->body,
                        0, 140, '…'
                    ) : '[deleted]',
                    'target_hidden' => $target?->is_hidden ?? false,
                ];
            });

        return Inertia::render('Admin/ForumReports', [
            'reports' => $reports,
            'status' => $status,
            'counts' => $counts,
        ]);
    }

    public function adminHide(Request $request)
    {
        $validated = $request->validate([
            'report_id' => 'required|integer',
            'action' => 'required|in:hide,unhide,dismiss',
        ]);

        $report = ForumReport::findOrFail($validated['report_id']);

        if ($validated['action'] === 'hide' || $validated['action'] === 'unhide') {
            $target = $report->reportable_type === 'thread'
                ? ForumThread::find($report->reportable_id)
                : ForumPost::find($report->reportable_id);
            if ($target) {
                $target->update(['is_hidden' => $validated['action'] === 'hide']);
            }
            $report->update([
                'status' => $validated['action'] === 'hide' ? 'actioned' : 'pending',
            ]);
        } else {
            $report->update(['status' => 'dismissed']);
        }

        return response()->json(['ok' => true]);
    }

    /**
     * All-threads admin view — shows hidden threads too.
     */
    public function adminThreads(Request $request)
    {
        $filter = $request->query('filter', 'all'); // all|visible|hidden
        $query = ForumThread::with(['user:id,name', 'categories:id,name'])
            ->orderByDesc('created_at')
            ->limit(200);

        if ($filter === 'visible') $query->where('is_hidden', false);
        if ($filter === 'hidden') $query->where('is_hidden', true);

        $threads = $query->get()->map(fn ($t) => [
            'id' => $t->id,
            'title' => $t->title,
            'posts_count' => $t->posts_count,
            'is_hidden' => (bool) $t->is_hidden,
            'created_at' => $t->created_at?->diffForHumans(),
            'user' => $t->user ? ['id' => $t->user->id, 'name' => $t->user->name] : null,
            'categories' => $t->categories->map(fn ($c) => ['id' => $c->id, 'name' => $c->name])->values(),
        ]);

        return Inertia::render('Admin/ForumThreads', [
            'threads' => $threads,
            'filter' => $filter,
        ]);
    }

    /**
     * Hide/unhide a thread directly (no report required).
     */
    public function adminThreadAction(Request $request, $id)
    {
        $validated = $request->validate([
            'action' => 'required|in:hide,unhide',
        ]);

        $thread = ForumThread::findOrFail($id);
        $thread->update(['is_hidden' => $validated['action'] === 'hide']);

        return response()->json(['ok' => true, 'is_hidden' => $thread->is_hidden]);
    }

    /**
     * Permanently delete a thread and all its children.
     */
    public function adminDeleteThread($id)
    {
        $thread = ForumThread::findOrFail($id);

        DB::transaction(function () use ($thread) {
            ForumPost::where('thread_id', $thread->id)->delete();
            DB::table('forum_thread_category')->where('thread_id', $thread->id)->delete();
            DB::table('forum_thread_mutes')->where('thread_id', $thread->id)->delete();
            ForumReport::where('reportable_type', 'thread')
                ->where('reportable_id', $thread->id)
                ->delete();
            $thread->delete();
        });

        return response()->json(['ok' => true]);
    }

    /* ─────── Internal helpers ─────── */

    private function formatThread(ForumThread $t): array
    {
        return [
            'id' => $t->id,
            'title' => $t->title,
            'body' => $t->body,
            'article_link' => $t->article_link,
            'article_title' => $t->article_title,
            'article_source' => $t->article_source,
            'posts_count' => $t->posts_count,
            'created_at' => $t->created_at?->diffForHumans(),
            'last_activity_at' => $t->last_activity_at?->diffForHumans(),
            'user' => $t->user ? [
                'id' => $t->user->id,
                'name' => $t->user->name,
                'profile_photo' => $t->user->profile_photo_path,
            ] : null,
            'categories' => $t->categories->map(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
            ])->values(),
        ];
    }

    /**
     * Notify users whose preferences overlap with the thread's categories.
     * Respects forum_notifications toggle.
     */
    private function notifyMatchingUsers(ForumThread $thread, array $categoryIds): void
    {
        try {
            $categoryIds = array_map('intval', $categoryIds);
            $creatorId = $thread->user_id;

            $candidates = UserPreference::where('user_id', '!=', $creatorId)
                ->where('forum_notifications', true)
                ->get(['user_id', 'opportunity_categories', 'product_categories']);

            $matchedUserIds = [];
            foreach ($candidates as $pref) {
                $userCats = array_merge(
                    is_array($pref->opportunity_categories) ? $pref->opportunity_categories : [],
                    is_array($pref->product_categories) ? $pref->product_categories : []
                );
                $userCats = array_map('intval', $userCats);

                if (array_intersect($userCats, $categoryIds)) {
                    $matchedUserIds[] = $pref->user_id;
                }
            }

            $matchedUserIds = array_unique($matchedUserIds);
            if (empty($matchedUserIds)) return;

            $title = 'New discussion in your interests';
            $preview = mb_strimwidth($thread->title, 0, 100, '…');
            $url = '/forum/' . $thread->id;

            foreach ($matchedUserIds as $uid) {
                Notification::create([
                    'user_id' => $uid,
                    'title' => $title,
                    'message' => $preview,
                    'type' => 'info',
                    'action_url' => $url,
                    'is_read' => false,
                    'data' => [
                        'type' => 'forum_thread',
                        'thread_id' => $thread->id,
                        'category_ids' => $categoryIds,
                    ],
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('Forum notification error: ' . $e->getMessage());
        }
    }

    /**
     * Notify thread author + prior participants when someone replies.
     * Excludes the replier and anyone who has muted the thread or disabled forum notifications.
     */
    private function notifyOnReply(ForumThread $thread, ForumPost $post): void
    {
        try {
            $replierId = $post->user_id;

            // Candidates: thread author + all prior participants + parent post author
            $participantIds = ForumPost::where('thread_id', $thread->id)
                ->where('user_id', '!=', $replierId)
                ->pluck('user_id')
                ->toArray();

            $parentAuthorId = null;
            if ($post->parent_id) {
                $parentAuthorId = ForumPost::where('id', $post->parent_id)->value('user_id');
            }

            $candidates = array_unique(array_merge(
                [$thread->user_id],
                $participantIds,
                $parentAuthorId ? [$parentAuthorId] : []
            ));
            $candidates = array_filter($candidates, fn ($id) => $id !== $replierId);

            if (empty($candidates)) return;

            // Remove users who muted this thread
            $muted = ForumThreadMute::where('thread_id', $thread->id)
                ->whereIn('user_id', $candidates)
                ->pluck('user_id')
                ->toArray();

            // Remove users with forum_notifications disabled
            $optedOut = UserPreference::whereIn('user_id', $candidates)
                ->where('forum_notifications', false)
                ->pluck('user_id')
                ->toArray();

            $recipients = array_diff($candidates, $muted, $optedOut);
            if (empty($recipients)) return;

            $replierName = $post->user?->name ?? 'Someone';
            $preview = mb_strimwidth($thread->title, 0, 100, '…');
            $url = '/forum/' . $thread->id;

            foreach ($recipients as $uid) {
                Notification::create([
                    'user_id' => $uid,
                    'title' => "{$replierName} replied",
                    'message' => $preview,
                    'type' => 'info',
                    'action_url' => $url,
                    'is_read' => false,
                    'data' => [
                        'type' => 'forum_reply',
                        'thread_id' => $thread->id,
                        'post_id' => $post->id,
                    ],
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('Forum reply notification error: ' . $e->getMessage());
        }
    }
}
