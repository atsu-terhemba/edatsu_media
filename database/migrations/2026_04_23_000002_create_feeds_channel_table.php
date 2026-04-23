<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('feeds_channel')) {
            return;
        }

        Schema::create('feeds_channel', function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->id();
            $table->bigInteger('publisher_id');
            $table->string('channel_image', 191);
            $table->string('channel_name', 191);
            $table->text('channel_description')->nullable();
            $table->string('country', 191);
            $table->string('region', 191);
            $table->string('channel_url', 191);
            $table->tinyInteger('is_deleted')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feeds_channel');
    }
};
