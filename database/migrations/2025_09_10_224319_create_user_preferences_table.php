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
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            
            // Opportunity preferences
            $table->json('opportunity_categories')->nullable(); // Array of category IDs
            $table->json('opportunity_countries')->nullable(); // Array of country IDs
            $table->json('opportunity_regions')->nullable(); // Array of region IDs
            $table->json('opportunity_brands')->nullable(); // Array of brand IDs
            
            // Product/Toolshed preferences
            $table->json('product_categories')->nullable(); // Array of category IDs
            $table->json('product_tags')->nullable(); // Array of tag IDs
            $table->json('product_brands')->nullable(); // Array of brand IDs
            
            // Notification preferences
            $table->boolean('email_notifications')->default(false);
            $table->boolean('opportunity_notifications')->default(true);
            $table->boolean('product_notifications')->default(true);
            
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique('user_id'); // One preference record per user
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
    }
};
