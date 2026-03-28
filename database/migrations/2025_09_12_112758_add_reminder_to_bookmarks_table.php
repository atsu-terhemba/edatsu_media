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
        Schema::table('bookmarks', function (Blueprint $table) {
            if (!Schema::hasColumn('bookmarks', 'reminder_date')) {
                $table->timestamp('reminder_date')->nullable()->after('deleted');
            }
            if (!Schema::hasColumn('bookmarks', 'reminder_sent')) {
                $table->boolean('reminder_sent')->default(false)->after('reminder_date');
            }
        });

        // Add index separately to avoid issues if columns already exist
        if (Schema::hasColumn('bookmarks', 'reminder_date')) {
            try {
                Schema::table('bookmarks', function (Blueprint $table) {
                    $table->index('reminder_date');
                });
            } catch (\Exception $e) {
                // Index may already exist
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookmarks', function (Blueprint $table) {
            $table->dropIndex(['reminder_date']);
            $table->dropColumn(['reminder_date', 'reminder_sent']);
        });
    }
};
