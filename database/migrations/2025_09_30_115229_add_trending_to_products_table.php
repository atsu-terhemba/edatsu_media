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
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'is_trending')) {
                $table->boolean('is_trending')->default(false)->after('updated_at');
            }
            if (!Schema::hasColumn('products', 'trending_since')) {
                $table->timestamp('trending_since')->nullable()->after('is_trending');
            }
            if (!Schema::hasColumn('products', 'trending_score')) {
                $table->integer('trending_score')->default(0)->after('trending_since');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['is_trending', 'trending_since', 'trending_score']);
        });
    }
};
