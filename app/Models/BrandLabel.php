<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BrandLabel extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "brand_labels";
    

    protected $fillable = [
        'name',
        'slug',
        'description',
        'deleted',
    ];
}
