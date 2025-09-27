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
        if (!Schema::hasTable('ratings')) {
            Schema::create('ratings', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->string('rateable_type', 100); // Limit length for index
                $table->unsignedBigInteger('rateable_id');
                $table->integer('rating')->comment('Rating from 1 to 5');
                $table->text('comment')->nullable();
                $table->timestamps();
                
                // Indexes for performance
                $table->index(['rateable_type', 'rateable_id']);
                $table->index('user_id');
                
                // Unique constraint to prevent duplicate ratings from same user
                $table->unique(['user_id', 'rateable_type', 'rateable_id'], 'unique_user_rating');
                
                // Foreign key constraint
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
