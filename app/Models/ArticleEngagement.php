<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleEngagement extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_link_hash',
        'article_link',
        'article_title',
        'article_description',
        'article_date',
        'feed_title',
        'feed_favicon',
        'feed_url',
        'event_type',
        'user_id',
    ];

    public const EVENT_READ = 'read';
    public const EVENT_CLICK = 'click';
    public const EVENT_SAVE = 'save';

    public const EVENT_TYPES = [
        self::EVENT_READ,
        self::EVENT_CLICK,
        self::EVENT_SAVE,
    ];

    public const WEIGHTS = [
        self::EVENT_READ => 1,
        self::EVENT_CLICK => 2,
        self::EVENT_SAVE => 5,
    ];
}
