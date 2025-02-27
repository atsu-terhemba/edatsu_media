<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reply extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $table = 'replies';

    protected $fillable = [
        'user_id',        // For authenticated users
        'guest_name',     // For guest users
        'comment_id',     // Parent comment reference
        'parent_id',      // For nested replies
        'content',        // The reply content
        'is_approved',    // For moderation
        'commentable_type', 
        'commentable_id'
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    protected $appends = [
        'can_edit',       // Dynamic attribute to check if user can edit
        'time_ago'        // Human readable time
    ];

    protected $with = ['user']; // Always load user relationship

    // Accessors
    public function getCanEditAttribute()
    {
        if (!auth()->check()) return false;
        return auth()->id() === $this->user_id || auth()->user()->isAdmin();
    }

    public function getTimeAgoAttribute()
    {
        return $this->created_at->diffForHumans();
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comment()
    {
        return $this->belongsTo(Comment::class);
    }

    public function parent()
    {
        return $this->belongsTo(Reply::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(Reply::class, 'parent_id');
    }
}
