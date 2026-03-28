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
        if (Schema::hasTable('messages')) return;
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sender_id')->nullable(); // null for system messages
            $table->unsignedBigInteger('recipient_id');
            $table->string('subject');
            $table->text('message');
            $table->string('message_type', 50)->default('user'); // user, system, admin
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->boolean('is_deleted_by_sender')->default(false);
            $table->boolean('is_deleted_by_recipient')->default(false);
            $table->json('attachments')->nullable(); // File attachments as JSON
            $table->timestamps();
            
            // Indexes
            $table->index(['recipient_id', 'is_read']);
            $table->index(['sender_id', 'is_deleted_by_sender']);
            $table->index('created_at');
            
            // Foreign keys
            $table->foreign('sender_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('recipient_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
