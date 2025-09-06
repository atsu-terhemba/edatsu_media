<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductFunctionality extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "product_functionalities";

    protected $fillable = [
        'name',
        'slug',
        'description',
        'deleted',
    ];
}
