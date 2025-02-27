<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Oppty;

class Region extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "regions";
    

    protected $fillable = [
        'name',
        'slug',
        'description',
        'deleted',
    ];

    
    public function Oppty()
    {
        return $this->belongsToMany(Oppty::class, 'region_selections', 'region_id', 'post_id');
    }
}
