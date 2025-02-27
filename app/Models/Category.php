<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Oppty;

class Category extends Model
{
    use HasFactory;

    use SoftDeletes;
    protected $table = "categories";

    protected $fillable = [
        'name',
        'slug',
        'description',
        'deleted',
    ];

    // app/Models/Category.php
    public function Oppty()
    {
        return $this->belongsToMany(Oppty::class, 'category_selections', 'category_id', 'post_id');
    }

    
}
