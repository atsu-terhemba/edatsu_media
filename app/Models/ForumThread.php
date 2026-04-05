<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForumThread extends Model
{
    use HasFactory;

    protected $table = 'forum_threads';

    protected $fillable = [
        'user_id',
        'title',
        'body',
        'article_link',
        'article_link_hash',
        'article_title',
        'article_source',
        'posts_count',
        'is_hidden',
        'last_activity_at',
    ];

    protected $casts = [
        'last_activity_at' => 'datetime',
        'is_hidden' => 'boolean',
    ];

    public function mutes()
    {
        return $this->hasMany(ForumThreadMute::class, 'thread_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function posts()
    {
        return $this->hasMany(ForumPost::class, 'thread_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'forum_thread_category', 'thread_id', 'category_id');
    }
}
