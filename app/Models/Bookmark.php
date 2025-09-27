<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Oppty;
use App\Models\Events;
use App\Models\Product;

class Bookmark extends Model
{
    use HasFactory;

    protected $table = "bookmarks";

    protected $fillable = [
        'user_id',
        'post_id',
        'post_type',
        'reminder_date',
        'reminder_sent'
    ];

    protected $casts = [
        'reminder_date' => 'datetime',
        'reminder_sent' => 'boolean',
    ];

    // Scope for bookmarks with pending reminders
    public function scopePendingReminders($query)
    {
        return $query->whereNotNull('reminder_date')
                    ->where('reminder_sent', false)
                    ->where('reminder_date', '<=', now());
    }

    // Check if reminder is due
    public function isReminderDue()
    {
        return $this->reminder_date && 
               !$this->reminder_sent && 
               $this->reminder_date <= now();
    }

    // Mark reminder as sent
    public function markReminderSent()
    {
        $this->update(['reminder_sent' => true]);
    }

    public function opportunity(){
        return $this->belongsTo(Oppty::class, 'post_id', 'id');
    }

    public function event(){
        return $this->belongsTo(Events::class, 'post_id', 'id');
    }

    public function product(){
        return $this->belongsTo(Product::class, 'post_id', 'id');
    }

    
}
