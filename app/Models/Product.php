<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "products";

    protected $fillable = [
        'u_id',
        'user_role',
        'product_name',
        'product_description',
        'source_url',
        'embeded_html',
        'views',
        'comments',
        'ratings',
        'deleted',
    ];

}
