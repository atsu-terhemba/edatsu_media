<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('article_engagements')) return;

        Schema::create('article_engagements', function (Blueprint $table) {
            $table->id();
            $table->string('article_link_hash', 64);
            $table->string('article_link', 500);
            $table->string('article_title');
            $table->text('article_description')->nullable();
            $table->string('article_date')->nullable();
            $table->string('feed_title')->nullable();
            $table->string('feed_favicon', 500)->nullable();
            $table->string('feed_url', 500)->nullable();
            $table->string('event_type', 16);
            $table->unsignedBigInteger('user_id')->nullable();
            $table->timestamps();

            $table->index(['article_link_hash', 'created_at'], 'engage_hash_time_idx');
            $table->index('event_type');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('article_engagements');
    }
};
