<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedsChannel extends Model
{
    use HasFactory;

    protected $table = 'feeds_channel';

    protected $fillable = [
        'publisher_id',
        'channel_image',
        'channel_name',
        'channel_description',
        'country', 
        'region',
        'channel_url',
    ];

    
}
