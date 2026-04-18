<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProGatingSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'enabled',
        'bookmarks_max',
        'saved_articles_max',
        'reminders_max',
        'custom_feeds_max',
        'bulk_export_pro_only',
        'web_push_pro_only',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'bookmarks_max' => 'integer',
        'saved_articles_max' => 'integer',
        'reminders_max' => 'integer',
        'custom_feeds_max' => 'integer',
        'bulk_export_pro_only' => 'boolean',
        'web_push_pro_only' => 'boolean',
    ];

    public static function current(): self
    {
        return static::firstOrCreate(['id' => 1], [
            'enabled' => false,
            'bookmarks_max' => 10,
            'saved_articles_max' => 20,
            'reminders_max' => 3,
            'custom_feeds_max' => 5,
            'bulk_export_pro_only' => true,
            'web_push_pro_only' => true,
        ]);
    }
}
