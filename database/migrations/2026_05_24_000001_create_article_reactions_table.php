<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('article_reactions')) return;

        Schema::create('article_reactions', function (Blueprint $table) {
            $table->id();
            $table->char('article_link_hash', 64);
            $table->string('article_link', 500);
            $table->string('article_title');
            $table->string('feed_title')->nullable();
            $table->string('feed_favicon', 500)->nullable();
            $table->string('feed_url', 500)->nullable();
            $table->string('reaction_type', 16);
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->unique(['user_id', 'article_link_hash', 'reaction_type'], 'reaction_uniq_idx');
            $table->index(['article_link_hash', 'reaction_type'], 'reaction_hash_type_idx');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('article_reactions');
    }
};
