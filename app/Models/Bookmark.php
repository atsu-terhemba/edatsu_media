<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Oppty;
use App\Models\Events;

class Bookmark extends Model
{
    use HasFactory;

    protected $table = "bookmarks";

    protected $fillable = [
        'user_id',
        'post_id',
        'post_type',
    ];

    public function opportunity(){
        return $this->belongsTo(Oppty::class, 'opportunity_id', );
    }

    public function event(){
        return $this->belongsTo(Events::class, 'event_id');
    }

    
}
