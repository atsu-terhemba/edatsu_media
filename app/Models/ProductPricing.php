<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductPricing extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "product_pricings";

    protected $fillable = [
        'name',
        'slug',
        'description',
        'deleted',
    ];
}
