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
        if (Schema::hasTable('saved_feed_articles')) return;

        Schema::create('saved_feed_articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('article_title');
            $table->string('article_link', 500);
            $table->string('article_link_hash', 64);
            $table->text('article_description')->nullable();
            $table->string('article_date')->nullable();
            $table->string('feed_title')->nullable();
            $table->string('feed_favicon', 500)->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'article_link_hash'], 'user_article_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saved_feed_articles');
    }
};
