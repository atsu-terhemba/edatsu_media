<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Live `messages` table is a stub (id only) — the DM feature was never built out.
 * Migration matches reality. When the feature ships, add columns via a new alter migration.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('messages')) return;

        Schema::create('messages', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->integer('id')->autoIncrement()->primary();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
