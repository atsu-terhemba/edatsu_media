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
            if (!Schema::hasColumn('users', 'last_seen_at')) {
                $table->timestamp('last_seen_at')->nullable();
            }
            if (!Schema::hasColumn('users', 'device_type')) {
                $table->string('device_type')->nullable();
            }
            if (!Schema::hasColumn('users', 'browser')) {
                $table->string('browser')->nullable();
            }
            if (!Schema::hasColumn('users', 'operating_system')) {
                $table->string('operating_system')->nullable();
            }
            if (!Schema::hasColumn('users', 'device_name')) {
                $table->string('device_name')->nullable();
            }
            if (!Schema::hasColumn('users', 'last_ip_address')) {
                $table->ipAddress('last_ip_address')->nullable();
            }
            if (!Schema::hasColumn('users', 'user_agent')) {
                $table->string('user_agent')->nullable();
            }
            if (!Schema::hasColumn('users', 'is_online')) {
                $table->boolean('is_online')->default(false);
            }
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
