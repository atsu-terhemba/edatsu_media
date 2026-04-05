<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('user_preferences') && !Schema::hasColumn('user_preferences', 'forum_notifications')) {
            Schema::table('user_preferences', function (Blueprint $table) {
                $table->boolean('forum_notifications')->default(true)->after('product_notifications');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('user_preferences', 'forum_notifications')) {
            Schema::table('user_preferences', function (Blueprint $table) {
                $table->dropColumn('forum_notifications');
            });
        }
    }
};
