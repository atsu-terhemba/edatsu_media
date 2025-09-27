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
        // Category selections (for both opportunities and products)
        if (!Schema::hasTable('category_selections')) {
            Schema::create('category_selections', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('post_id');
                $table->unsignedBigInteger('category_id');
                $table->string('post_type', 100); // 'opportunities' or 'products'
                $table->timestamps();
                
                $table->index(['post_id', 'post_type']);
                $table->index('category_id');
                $table->index('user_id');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
        }

        // Tag selections
        if (!Schema::hasTable('tags_selections')) {
            Schema::create('tags_selections', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('post_id');
                $table->unsignedBigInteger('tag_id');
                $table->string('post_type', 100);
                $table->timestamps();
                
                $table->index(['post_id', 'post_type']);
                $table->index('tag_id');
                $table->index('user_id');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');
            });
        }

        // Brand label selections
        if (!Schema::hasTable('brand_labels_selections')) {
            Schema::create('brand_labels_selections', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('post_id');
                $table->unsignedBigInteger('brand_label_id');
                $table->string('post_type', 100);
                $table->timestamps();
                
                $table->index(['post_id', 'post_type']);
                $table->index('brand_label_id');
                $table->index('user_id');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('brand_label_id')->references('id')->on('brand_labels')->onDelete('cascade');
            });
        }

        // Region selections
        if (!Schema::hasTable('region_selections')) {
            Schema::create('region_selections', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('post_id');
                $table->unsignedBigInteger('region_id');
                $table->string('post_type', 100);
                $table->timestamps();
                
                $table->index(['post_id', 'post_type']);
                $table->index('region_id');
                $table->index('user_id');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('region_id')->references('id')->on('regions')->onDelete('cascade');
            });
        }

        // Country selections
        if (!Schema::hasTable('country_selections')) {
            Schema::create('country_selections', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('post_id');
                $table->unsignedBigInteger('country_id');
                $table->string('post_type', 100);
                $table->timestamps();
                
                $table->index(['post_id', 'post_type']);
                $table->index('country_id');
                $table->index('user_id');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('country_id')->references('id')->on('countries')->onDelete('cascade');
            });
        }

        // Continent selections
        if (!Schema::hasTable('continent_selections')) {
            Schema::create('continent_selections', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('post_id');
                $table->unsignedBigInteger('continent_id');
                $table->string('post_type', 100);
                $table->timestamps();
                
                $table->index(['post_id', 'post_type']);
                $table->index('continent_id');
                $table->index('user_id');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('continent_id')->references('id')->on('continents')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('continent_selections');
        Schema::dropIfExists('country_selections');
        Schema::dropIfExists('region_selections');
        Schema::dropIfExists('brand_labels_selections');
        Schema::dropIfExists('tags_selections');
        Schema::dropIfExists('category_selections');
    }
};
