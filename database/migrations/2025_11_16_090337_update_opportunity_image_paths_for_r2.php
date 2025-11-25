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
     * This migration updates image paths in the opportunities table to work with R2 storage.
     * It removes the old 'storage/public/uploads/opp/' prefix, leaving just the filename
     * or username/filename format.
     */
    public function up(): void
    {
        // Update opportunities table - remove old path prefix
        DB::table('opportunities')
            ->whereNotNull('cover_img')
            ->where('cover_img', 'like', 'storage/public/uploads/opp/%')
            ->update([
                'cover_img' => DB::raw("REPLACE(cover_img, 'storage/public/uploads/opp/', '')")
            ]);
            
        // Also handle any paths that might have 'uploads/opp/' without the storage/public prefix
        DB::table('opportunities')
            ->whereNotNull('cover_img')
            ->where('cover_img', 'like', 'uploads/opp/%')
            ->update([
                'cover_img' => DB::raw("REPLACE(cover_img, 'uploads/opp/', '')")
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add back the old path prefix
        DB::table('opportunities')
            ->whereNotNull('cover_img')
            ->whereNotLike('cover_img', 'storage/public/uploads/opp/%')
            ->update([
                'cover_img' => DB::raw("CONCAT('storage/public/uploads/opp/', cover_img)")
            ]);
    }
};
