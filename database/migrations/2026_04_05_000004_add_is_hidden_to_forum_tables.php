<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('forum_threads') && !Schema::hasColumn('forum_threads', 'is_hidden')) {
            Schema::table('forum_threads', function (Blueprint $table) {
                $table->boolean('is_hidden')->default(false)->after('posts_count');
            });
        }

        if (Schema::hasTable('forum_posts') && !Schema::hasColumn('forum_posts', 'is_hidden')) {
            Schema::table('forum_posts', function (Blueprint $table) {
                $table->boolean('is_hidden')->default(false)->after('body');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('forum_threads', 'is_hidden')) {
            Schema::table('forum_threads', function (Blueprint $table) {
                $table->dropColumn('is_hidden');
            });
        }
        if (Schema::hasColumn('forum_posts', 'is_hidden')) {
            Schema::table('forum_posts', function (Blueprint $table) {
                $table->dropColumn('is_hidden');
            });
        }
    }
};
