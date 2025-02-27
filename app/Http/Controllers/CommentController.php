<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Comment;
use App\Models\Reply;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    //

        public function store(Request $request)
    {

        // dd($request->input());
        // Validation rules
        $validator = Validator::make($request->all(), [
            'guest' => 'nullable|string|max:255',
            'comment' => 'required|string|min:5|max:1000',
        ], [
            'comment.required' => 'Comment field is required.',
            'comment.min' => 'Comment must be at least 5 characters.',
            'comment.max' => 'Comment may not be greater than 1000 characters.',
        ]);

        // Return JSON errors if validation fails
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()->first()
            ], 400);
        }

        try {
            // Store the comment in the database
            $comment = Comment::create([
                'user_id' => auth()->id(),
                'guest_name' => auth()->guest() ? $request->guest_name : null,
                'commentable_id' => $request->input('commentable_id'),
                'commentable_type' => 'App\\Models\\Oppty',
                'content' => clean($request->input('comment'))
            ]);

            // Return success response
            return response()->json([
                'status' => 'success',
                'message' => 'Posted successfully!'
            ], 201);

        } catch (\Exception $e) {
            // Return server error in case of failure
            return response()->json([
                'status' => 'error',
                'message' => 'There was an error posting the comment.'
            ], 500);
        }
    }





// public function getComments(Request $request, $postId)
// {

//     $perPage = 5;
//     $page = $request->input('page', 1);

//     $comments = DB::table('comments')
//         ->leftJoin('users', 'users.id', '=', 'comments.user_id')
//         ->select(
//         'comments.*',
//         DB::raw('IFNULL(users.name, comments.guest_name) as commenter_name')
//         )
//         ->where('comments.commentable_id', $postId)
//         ->where('comments.commentable_type',  '=', 'App\\Models\\Oppty')
//         ->orderBy('comments.created_at', 'desc')
//         ->paginate($perPage);

//     $commentIds = $comments->pluck('id')->toArray();

//     // Raw query for recursive CTE
//     $rawQuery = "
//         WITH RECURSIVE replies_recursive AS (
//             SELECT
//                 id,
//                 comment_id,
//                 user_id,
//                 guest_name,
//                 content,
//                 parent_id,
//                 commentable_id,
//                 commentable_type,
//                 created_at,
//                 updated_at,
//                 0 as depth
//             FROM replies
//             WHERE comment_id IN (" . implode(',', $commentIds) . ") AND parent_id IS NULL

//             UNION ALL

//             SELECT
//                 r.id,
//                 r.comment_id,
//                 r.user_id,
//                 r.guest_name,
//                 r.content,
//                 r.parent_id,
//                 r.commentable_id,
//                 r.commentable_type,
//                 r.created_at,
//                 r.updated_at,
//                 replies_recursive.depth + 1
//             FROM replies r
//             JOIN replies_recursive ON replies_recursive.id = r.parent_id
//         )
//         SELECT
//             replies_recursive.*,
//             IFNULL(users.name, replies_recursive.guest_name) as replier_name
//         FROM replies_recursive
//         LEFT JOIN users ON users.id = replies_recursive.user_id
//         ORDER BY replies_recursive.created_at ASC
//     ";

//     $replies = DB::select($rawQuery);

//     // Group replies by comment_id
//     $groupedReplies = collect($replies)->groupBy('comment_id');

//     // Attach replies to their respective comments
//     foreach ($comments as $comment) {
//         $comment->replies = $this->buildNestedReplies($groupedReplies->get($comment->id, collect()));
//     }

//     return response()->json($comments);
// }





// Helper function to build nested reply structure
// private function buildNestedReplies($replies)
// {
//     $nestedReplies = [];
//     $replyMap = [];

//     foreach ($replies as $reply) {
//         $reply = (array) $reply;
//         $reply['replies'] = [];
//         $replyMap[$reply['id']] = $reply;

//         if ($reply['parent_id'] === null) {
//             $nestedReplies[] = &$replyMap[$reply['id']];
//         } else {
//             $replyMap[$reply['parent_id']]['replies'][] = &$replyMap[$reply['id']];
//         }
//     }

//     return $nestedReplies;
// }



/**
 * Get paginated comments with nested replies for a post
 *
 * @param Request $request
 * @param int $postId
 * @return JsonResponse
 */
public function getComments(Request $request, $postId)
{
    $perPage = 5;
    
    // Get paginated comments
    $comments = DB::table('comments')
        ->leftJoin('users', 'users.id', '=', 'comments.user_id')
        ->select([
            'comments.*',
            DB::raw('COALESCE(users.name, comments.guest_name) as commenter_name')
        ])
        ->where([
            ['comments.commentable_id', '=', $postId],
            ['comments.commentable_type', '=', 'App\\Models\\Oppty']
        ])
        ->orderByDesc('comments.created_at')
        ->paginate($perPage);

    // Early return if no comments
    if ($comments->isEmpty()) {
        return response()->json($comments);
    }

    $commentIds = $comments->pluck('id')->toArray();
    
    // Get nested replies using CTE
    $replies = DB::select("
        WITH RECURSIVE replies_recursive AS (
            -- Base case: top-level replies
            SELECT
                id, comment_id, user_id, guest_name, content,
                parent_id, commentable_id, commentable_type,
                created_at, updated_at, 0 as depth
            FROM replies
            WHERE comment_id IN (" . implode(',', $commentIds) . ")
            AND parent_id IS NULL

            UNION ALL

            -- Recursive case: nested replies
            SELECT
                r.id, r.comment_id, r.user_id, r.guest_name, r.content,
                r.parent_id, r.commentable_id, r.commentable_type,
                r.created_at, r.updated_at, rr.depth + 1
            FROM replies r
            INNER JOIN replies_recursive rr ON rr.id = r.parent_id
        )
        SELECT
            replies_recursive.*,
            COALESCE(users.name, replies_recursive.guest_name) as replier_name
        FROM replies_recursive
        LEFT JOIN users ON users.id = replies_recursive.user_id
        ORDER BY replies_recursive.created_at ASC
    ");

    // Group and attach replies to comments
    $groupedReplies = collect($replies)->groupBy('comment_id');
    foreach ($comments as $comment) {
        $comment->replies = $this->buildNestedReplies(
            $groupedReplies->get($comment->id, collect())
        );
    }

    return response()->json($comments);
}

/**
 * Build nested reply structure from flat replies array
 *
 * @param Collection $replies
 * @return array
 */
private function buildNestedReplies($replies): array
{
    $replyMap = [];
    $nestedReplies = [];

    foreach ($replies as $reply) {
        $replyData = (array) $reply;
        $replyData['replies'] = [];
        $replyMap[$reply->id] = $replyData;

        if (is_null($reply->parent_id)) {
            $nestedReplies[] = &$replyMap[$reply->id];
        } else {
            $replyMap[$reply->parent_id]['replies'][] = &$replyMap[$reply->id];
        }
    }

    return $nestedReplies;
}



    public function storeReply(Request $request)
{

    // dd($request->all());

    $validator = Validator::make($request->all(), [
        'guest_name' => ['nullable', 'string', 'max:255'],
        'reply' => ['required', 'string', 'max:1000'],
        'parent_id' => ['nullable', 'exists:replies,id'],
        'comment_id' => ['required', 'exists:comments,id'],
        'commentable_id' => ['required', 'integer'],
        'commentable_type' => ['required', 'string', 'in:post,opp'], // Explicitly define allowed types
    ], [
        'reply.required' => 'Reply field is required.',
        'reply.min' => 'Reply must be at least 5 characters.',
        'reply.max' => 'Reply may not be greater than 1000 characters.',
        'commentable_type.in' => 'Invalid commentable type provided.',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'errors' => $validator->errors()->first()
        ], 422); // Using 422 for validation errors instead of 400
    }

    try {
        // Map the commentable type to its full class name
        // $commentableMap = [
        //     'post' => \App\Models\Post::class,
        //     'opp' => \App\Models\Opp::class,
        // ];

        // $commentableType = $commentableMap['opp'] 
        //     ?? throw new \InvalidArgumentException('Invalid commentable type');

        $commentableType = 'App\Models\Oppty';

        $reply = Reply::create([
            'comment_id' => $request->comment_id,
            'content' => $request->reply,
            'parent_id' => $request->parent_id ?? null,
            'user_id' => auth()->id(),
            'guest_name' => auth()->guest() ? $request->guest_name : null,
            'commentable_id' => $request->commentable_id ?? $request->post_id,
            'commentable_type' => $commentableType,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Reply posted successfully',
            'data' => $reply->load('user')
        ], 201);

    } catch (\Exception $e) {
        report($e);
        
        return response()->json([
            'status' => 'error',
            'message' => 'An error occurred while saving your reply'
        ], 500);
    }
}



}
