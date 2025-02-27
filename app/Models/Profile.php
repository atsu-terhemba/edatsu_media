<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_picture',
        'full_name',
        'email',
        'about',
        'phone_no',
        'gender',
        'date_of_birth',
        'location',
        'linkedin_profile',
    ];
}
