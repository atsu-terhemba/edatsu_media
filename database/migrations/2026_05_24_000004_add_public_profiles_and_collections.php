<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('users') && !Schema::hasColumn('users', 'profile_slug')) {
            Schema::table('users', function (Blueprint $table) {
                // Short on purpose — keeps MyISAM key length safe (memory notes
                // call out the 1000-byte index limit on this DB).
                $table->string('profile_slug', 80)->nullable()->after('email');
                $table->unique('profile_slug', 'users_profile_slug_uniq');
            });
        }

        if (Schema::hasTable('article_collections')) {
            Schema::table('article_collections', function (Blueprint $table) {
                if (!Schema::hasColumn('article_collections', 'is_public')) {
                    $table->boolean('is_public')->default(false)->after('color');
                }
                if (!Schema::hasColumn('article_collections', 'slug')) {
                    $table->string('slug', 80)->nullable()->after('is_public');
                }
            });
            // A given user can't have two collections with the same slug.
            // Existing rows have NULL slug so this index allows multiple NULLs.
            if (!collect(\Illuminate\Support\Facades\DB::select(
                "SHOW INDEX FROM article_collections WHERE Key_name = 'collection_user_slug_uniq'"
            ))->count()) {
                Schema::table('article_collections', function (Blueprint $table) {
                    $table->unique(['user_id', 'slug'], 'collection_user_slug_uniq');
                });
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('article_collections')) {
            Schema::table('article_collections', function (Blueprint $table) {
                if (Schema::hasColumn('article_collections', 'slug')) {
                    $table->dropUnique('collection_user_slug_uniq');
                    $table->dropColumn('slug');
                }
                if (Schema::hasColumn('article_collections', 'is_public')) {
                    $table->dropColumn('is_public');
                }
            });
        }
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'profile_slug')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropUnique('users_profile_slug_uniq');
                $table->dropColumn('profile_slug');
            });
        }
    }
};
