<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Oppty;

class  Continent extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "continents";
    

    protected $fillable = [
        'name',
        'slug',
        'description',
        'deleted',
    ];

    
    public function Oppty()
    {
        return $this->belongsToMany(Oppty::class, 'continent_selections', 'continent_id', 'post_id');
    }
}
