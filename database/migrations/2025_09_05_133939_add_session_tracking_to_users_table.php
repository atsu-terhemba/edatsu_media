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
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('last_seen_at')->nullable();
            $table->string('device_type')->nullable(); // mobile, desktop, tablet
            $table->string('browser')->nullable();
            $table->string('operating_system')->nullable();
            $table->string('device_name')->nullable();
            $table->ipAddress('last_ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->boolean('is_online')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'last_seen_at',
                'device_type',
                'browser',
                'operating_system',
                'device_name',
                'last_ip_address',
                'user_agent',
                'is_online'
            ]);
        });
    }
};
