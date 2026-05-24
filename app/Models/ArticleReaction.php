<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleReaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_link_hash',
        'article_link',
        'article_title',
        'feed_title',
        'feed_favicon',
        'feed_url',
        'reaction_type',
        'user_id',
    ];

    public const TYPE_LIKE = 'like';
    public const TYPE_INSIGHTFUL = 'insightful';
    public const TYPE_FIRE = 'fire';

    public const TYPES = [
        self::TYPE_LIKE,
        self::TYPE_INSIGHTFUL,
        self::TYPE_FIRE,
    ];
}
