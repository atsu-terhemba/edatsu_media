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
        if (!Schema::hasTable('bookmarks')) {
            Schema::create('bookmarks', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('post_id');
                $table->string('post_type', 100); // 'opportunities', 'products', 'tool', 'ts', etc.
                $table->boolean('removed')->default(0);
                $table->boolean('deleted')->default(0);
                $table->timestamps();
                
                // Indexes
                $table->index(['user_id', 'post_id', 'post_type']);
                $table->index('removed');
                $table->index('deleted');
                
                // Foreign key
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookmarks');
    }
};
