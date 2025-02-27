<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\BrandLabel;
use App\Models\Country;
use App\Models\Category;
use App\Models\Continent;
use App\Models\Tag;
// use Laravel\Scout\Searchable;

class Oppty extends Model
{
    use HasFactory;

    protected $table = "opportunities";

    protected $fillable = [
        'u_id',
        'user_role',
        'cover_img',
        'title',
        'description',
        'deadline',
        'source_url',
        'direct_link',
    ];

      /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    // public function toSearchableArray()
    // {
    //     return [
    //         'id' => $this->id,
    //         'title' => $this->title,
    //         'description' => $this->description,
    //         'deadline' => $this->deadline,
    //         'created_at' => $this->created_at,
    //     ];
    // }

    /**
     * Get the options for indexing the model.
     *
     * @return array
     */
    // public function searchableOptions()
    // {
    //     return [
    //         'sortableAttributes' => ['deadline', 'created_at'],
    //         'rankingRules' => [
    //             'words',
    //             'typo',
    //             'proximity',
    //             'attribute',
    //             'sort',
    //             'exactness',
    //         ],
    //         'searchableAttributes' => [
    //             'title',
    //             'description',
    //         ],
    //     ];
    // }
    
    public function bookmark(){
        return $this->hasMany(Bookmark::class);
    }

    // app/Models/User.php
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_selections', 'post_id', 'category_id');
    }

    public function brands()
    {
        return $this->belongsToMany(BrandLabel::class, 'brand_labels_selections', 'post_id', 'brand_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'tags_selections', 'post_id', 'tag_id');
    }

    public function regions()
    {
        return $this->belongsToMany(Region::class, 'region_selections', 'post_id', 'region_id');
    }

    public function countries()
    {
        return $this->belongsToMany(Country::class, 'country_selections', 'post_id', 'country_id');
    }

    public function continents()
    {
        return $this->belongsToMany(Continent::class, 'continent_selections', 'post_id', 'continent_id');
    }


}
