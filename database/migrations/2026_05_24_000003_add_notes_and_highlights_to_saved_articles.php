<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('saved_feed_articles') && !Schema::hasColumn('saved_feed_articles', 'note')) {
            Schema::table('saved_feed_articles', function (Blueprint $table) {
                $table->text('note')->nullable()->after('feed_favicon');
            });
        }

        if (!Schema::hasTable('article_highlights')) {
            Schema::create('article_highlights', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('saved_article_id');
                $table->text('text');
                $table->string('color', 16)->default('yellow');
                $table->timestamps();

                $table->index('saved_article_id');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('article_highlights');

        if (Schema::hasTable('saved_feed_articles') && Schema::hasColumn('saved_feed_articles', 'note')) {
            Schema::table('saved_feed_articles', function (Blueprint $table) {
                $table->dropColumn('note');
            });
        }
    }
};
