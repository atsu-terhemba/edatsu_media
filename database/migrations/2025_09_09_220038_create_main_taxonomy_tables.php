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
        // Categories table
        if (!Schema::hasTable('categories')) {
            Schema::create('categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug', 191)->unique(); // Limit slug length for MySQL key constraint
                $table->text('description')->nullable();
                $table->string('cover_img')->nullable();
                $table->timestamps();
            });
        }

        // Product Categories table (separate from opportunities categories)
        if (!Schema::hasTable('product_categories')) {
            Schema::create('product_categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug', 191)->unique(); // Limit slug length for MySQL key constraint
                $table->text('description')->nullable();
                $table->string('cover_img')->nullable();
                $table->timestamps();
                $table->softDeletes();
            });
        }

        // Tags table
        if (!Schema::hasTable('tags')) {
            Schema::create('tags', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug', 191)->unique(); // Limit slug length for MySQL key constraint
                $table->text('description')->nullable();
                $table->timestamps();
            });
        }

        // Regions table
        if (!Schema::hasTable('regions')) {
            Schema::create('regions', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug', 191)->unique(); // Limit slug length for MySQL key constraint
                $table->text('description')->nullable();
                $table->timestamps();
            });
        }

        // Countries table
        if (!Schema::hasTable('countries')) {
            Schema::create('countries', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug', 191)->unique(); // Limit slug length for MySQL key constraint
                $table->text('description')->nullable();
                $table->timestamps();
            });
        }

        // Continents table
        if (!Schema::hasTable('continents')) {
            Schema::create('continents', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug', 191)->unique(); // Limit slug length for MySQL key constraint
                $table->text('description')->nullable();
                $table->timestamps();
            });
        }

        // Brand Labels table
        if (!Schema::hasTable('brand_labels')) {
            Schema::create('brand_labels', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug', 191)->unique(); // Limit slug length for MySQL key constraint
                $table->text('description')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('brand_labels');
        Schema::dropIfExists('continents');
        Schema::dropIfExists('countries');
        Schema::dropIfExists('regions');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('product_categories');
        Schema::dropIfExists('categories');
    }
};
