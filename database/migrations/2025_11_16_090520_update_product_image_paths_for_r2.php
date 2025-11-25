<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration updates image paths in the products table to work with R2 storage.
     * It removes the old 'storage/public/uploads/prod/' prefix, leaving just the filename
     * or username/filename format.
     */
    public function up(): void
    {
        // Update products table - remove old path prefix
        DB::table('products')
            ->whereNotNull('cover_img')
            ->where('cover_img', 'like', 'storage/public/uploads/prod/%')
            ->update([
                'cover_img' => DB::raw("REPLACE(cover_img, 'storage/public/uploads/prod/', '')")
            ]);
            
        // Also handle any paths that might have 'uploads/prod/' without the storage/public prefix
        DB::table('products')
            ->whereNotNull('cover_img')
            ->where('cover_img', 'like', 'uploads/prod/%')
            ->update([
                'cover_img' => DB::raw("REPLACE(cover_img, 'uploads/prod/', '')")
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add back the old path prefix
        DB::table('products')
            ->whereNotNull('cover_img')
            ->whereNotLike('cover_img', 'storage/public/uploads/prod/%')
            ->update([
                'cover_img' => DB::raw("CONCAT('storage/public/uploads/prod/', cover_img)")
            ]);
    }
};
