<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForumThreadMute extends Model
{
    use HasFactory;

    protected $table = 'forum_thread_mutes';

    protected $fillable = [
        'user_id',
        'thread_id',
    ];
}
