<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('user_activity')) {
            return;
        }

        Schema::create('user_activity', function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('session_id', 191)->nullable();
            $table->string('ip_address', 191)->nullable();
            $table->string('location', 191)->nullable();
            $table->string('device_type', 191)->nullable();
            $table->string('browser', 191)->nullable();
            $table->string('operating_system', 191)->nullable();
            $table->string('referral_url', 191)->nullable();
            $table->string('current_page_url', 191);
            $table->integer('time_spent')->nullable();
            $table->integer('scroll_depth')->nullable();
            $table->boolean('engaged')->default(false);
            $table->json('clicked_links')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('session_id');
            $table->index('current_page_url');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_activity');
    }
};
