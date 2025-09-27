<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Models\User;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'type',
        'action_url',
        'is_read',
        'read_at',
        'data'
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
        'data' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Mark as read
    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => Carbon::now()
        ]);
    }

    // Scope for unread notifications
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    // Scope for read notifications
    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }
}
