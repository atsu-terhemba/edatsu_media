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
            $table->unsignedBigInteger('user_id');
            $table->string('feed_url', 255);
            $table->string('site_url', 255);
            $table->string('feed_title', 255)->nullable();
            $table->string('feed_favicon', 255)->nullable();
            $table->timestamps();

            $table->index('user_id', 'user_news_feeds_user_id_foreign');
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
