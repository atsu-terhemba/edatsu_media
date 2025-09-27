<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'commentable_id',
        'commentable_type',
        'parent_id',
        'comment',
        'is_approved',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Polymorphic relationship to the commentable model (Product, etc.)
    public function commentable()
    {
        return $this->morphTo();
    }

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Self-referencing relationship for threaded comments
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    // Children comments (replies)
    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id')->with('replies', 'user');
    }

    // Scope for top-level comments (no parent)
    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

    // Scope for approved comments
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    // Check if comment has replies
    public function hasReplies()
    {
        return $this->replies()->count() > 0;
    }
}
