<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('user_news_feeds')) return;

        Schema::create('user_news_feeds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('feed_url', 500);
            $table->string('site_url', 500);
            $table->string('feed_title')->nullable();
            $table->string('feed_favicon', 500)->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'feed_url'], 'user_feed_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_news_feeds');
    }
};
