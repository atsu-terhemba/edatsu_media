<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pro_gating_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('enabled')->default(false);
            $table->unsignedInteger('bookmarks_max')->default(10);
            $table->unsignedInteger('saved_articles_max')->default(20);
            $table->unsignedInteger('reminders_max')->default(3);
            $table->unsignedInteger('custom_feeds_max')->default(5);
            $table->boolean('bulk_export_pro_only')->default(true);
            $table->boolean('web_push_pro_only')->default(true);
            $table->timestamps();
        });

        DB::table('pro_gating_settings')->insert([
            'enabled' => false,
            'bookmarks_max' => 10,
            'saved_articles_max' => 20,
            'reminders_max' => 3,
            'custom_feeds_max' => 5,
            'bulk_export_pro_only' => true,
            'web_push_pro_only' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('pro_gating_settings');
    }
};
