<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdGlobalSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'ads_enabled',
        'show_placeholders',
        'adsense_publisher_id'
    ];

    protected $casts = [
        'ads_enabled' => 'boolean',
        'show_placeholders' => 'boolean',
    ];

    public static function getSetting()
    {
        return self::firstOrCreate(
            ['id' => 1],
            [
                'ads_enabled' => false,
                'show_placeholders' => true
            ]
        );
    }
}

