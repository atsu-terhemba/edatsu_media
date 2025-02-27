<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedsCategory extends Model
{
    use HasFactory;

    protected $table  = "feeds_categories";


    protected $fillable = [
        'publisher_id',
        'category_image',
        'category_name',
        'category_description',
        'category_url'
    ];


}
