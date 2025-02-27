<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Oppty;

class Country extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $table = "countries";

    protected $fillable = [
        'name',
        'slug',
        'description',
        'deleted',
    ];

    
    public function Oppty()
    {
        return $this->belongsToMany(Oppty::class, 'country_selections', 'country_id', 'post_id');
    }
}
