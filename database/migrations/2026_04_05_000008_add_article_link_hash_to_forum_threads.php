<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('forum_threads') && !Schema::hasColumn('forum_threads', 'article_link_hash')) {
            Schema::table('forum_threads', function (Blueprint $table) {
                $table->string('article_link_hash', 64)->nullable()->after('article_link');
                $table->index('article_link_hash');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('forum_threads', 'article_link_hash')) {
            Schema::table('forum_threads', function (Blueprint $table) {
                $table->dropIndex(['article_link_hash']);
                $table->dropColumn('article_link_hash');
            });
        }
    }
};
