<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Oppty;

class Tag extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $table = "tags";

    protected $fillable = [
        'name',
        'slug',
        'description',
        'deleted',
    ];

    
    public function Oppty()
    {
        return $this->belongsToMany(Oppty::class, 'tag_selections', 'tag_id', 'post_id');
    }
}
