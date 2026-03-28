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
        Schema::table('mail_subscribers', function (Blueprint $table) {
            if (!Schema::hasColumn('mail_subscribers', 'subscription_type')) {
                $table->string('subscription_type', 50)->nullable()->after('email');
            }
        });
    }

    public function down(): void
    {
        Schema::table('mail_subscribers', function (Blueprint $table) {
            $table->dropColumn('subscription_type');
        });
    }
};
