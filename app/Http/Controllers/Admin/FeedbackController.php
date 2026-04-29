<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    public function index(Request $request)
    {
        $statusFilter = $request->query('status');
        $categoryFilter = $request->query('category');
        $search = $request->query('q');

        $stats = [
            'total'    => Feedback::count(),
            'new'      => Feedback::where('status', 'new')->count(),
            'reviewed' => Feedback::where('status', 'reviewed')->count(),
            'resolved' => Feedback::where('status', 'resolved')->count(),
        ];

        $feedbacks = Feedback::query()
            ->with(['user:id,name,email', 'reviewer:id,name'])
            ->when($statusFilter && in_array($statusFilter, Feedback::STATUSES, true),
                fn ($q) => $q->where('status', $statusFilter))
            ->when($categoryFilter && in_array($categoryFilter, ['bug', 'feature', 'general', 'other'], true),
                fn ($q) => $q->where('category', $categoryFilter))
            ->when($search, function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('subject', 'LIKE', "%{$search}%")
                       ->orWhere('message', 'LIKE', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn ($f) => [
                'id'         => $f->id,
                'category'   => $f->category,
                'subject'    => $f->subject,
                'message'    => $f->message,
                'status'     => $f->status,
                'admin_note' => $f->admin_note,
                'user'       => $f->user ? [
                    'id'    => $f->user->id,
                    'name'  => $f->user->name,
                    'email' => $f->user->email,
                ] : null,
                'reviewer'    => $f->reviewer ? ['id' => $f->reviewer->id, 'name' => $f->reviewer->name] : null,
                'reviewed_at' => $f->reviewed_at?->toIso8601String(),
                'created_at'  => $f->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/Feedback', [
            'feedbacks' => $feedbacks,
            'stats'     => $stats,
            'filters'   => [
                'status'   => $statusFilter,
                'category' => $categoryFilter,
                'q'        => $search,
            ],
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status'     => 'required|string|in:new,reviewed,resolved',
            'admin_note' => 'nullable|string|max:5000',
        ]);

        $feedback = Feedback::findOrFail($id);
        $feedback->status = $validated['status'];
        if (array_key_exists('admin_note', $validated)) {
            $feedback->admin_note = $validated['admin_note'];
        }

        if ($validated['status'] !== 'new') {
            $feedback->reviewed_by = Auth::id();
            $feedback->reviewed_at = now();
        } else {
            $feedback->reviewed_by = null;
            $feedback->reviewed_at = null;
        }

        $feedback->save();

        return back();
    }
}
