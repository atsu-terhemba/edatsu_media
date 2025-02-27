<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserActivity extends Model
{
    use HasFactory;

     // Define the table associated with the model (optional if it's plural form)
    protected $table = 'user_activity';

     // Define the fillable attributes
    protected $fillable = [
        'user_id',
        'session_id',
        'ip_address',
        'location',
        'device_type',
        'browser',
        'operating_system',
        'referral_url',
        'current_page_url',
        'time_spent',
        'scroll_depth',
        'engaged',
        'clicked_links',
    ];
 
     // Optionally, if you want to cast 'clicked_links' to an array or JSON
    protected $casts = [
        'clicked_links' => 'array', // Cast to an array
        'engaged' => 'boolean', // Ensure boolean values are cast correctly
    ];
}
