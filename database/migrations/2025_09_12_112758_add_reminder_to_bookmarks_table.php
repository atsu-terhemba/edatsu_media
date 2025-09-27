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
            $table->timestamp('reminder_date')->nullable()->after('deleted');
            $table->boolean('reminder_sent')->default(false)->after('reminder_date');
            $table->index('reminder_date');
        });
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
