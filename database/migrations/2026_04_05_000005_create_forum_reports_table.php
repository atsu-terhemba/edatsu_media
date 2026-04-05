<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('forum_reports')) return;

        Schema::create('forum_reports', function (Blueprint $table) {
            $table->id();
            $table->string('reportable_type', 20); // 'thread' or 'post'
            $table->unsignedBigInteger('reportable_id');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('reason', 500)->nullable();
            $table->string('status', 20)->default('pending'); // pending/reviewed/dismissed/actioned
            $table->timestamps();

            $table->index(['reportable_type', 'reportable_id']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forum_reports');
    }
};
