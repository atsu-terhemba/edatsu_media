<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add FULLTEXT index for search functionality (MATCH AGAINST)
        $indexExists = collect(DB::select("SHOW INDEX FROM opportunities WHERE Key_name = 'opportunities_title_description_fulltext'"))->isNotEmpty();

        if (!$indexExists) {
            DB::statement('ALTER TABLE opportunities ADD FULLTEXT INDEX opportunities_title_description_fulltext (title, description)');
        }

        // Ensure direct_link column exists (may be missing if table predates migration)
        if (!Schema::hasColumn('opportunities', 'direct_link')) {
            Schema::table('opportunities', function (Blueprint $table) {
                $table->string('direct_link')->nullable()->after('source_url');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $indexExists = collect(DB::select("SHOW INDEX FROM opportunities WHERE Key_name = 'opportunities_title_description_fulltext'"))->isNotEmpty();

        if ($indexExists) {
            Schema::table('opportunities', function (Blueprint $table) {
                $table->dropIndex('opportunities_title_description_fulltext');
            });
        }

        if (Schema::hasColumn('opportunities', 'direct_link')) {
            Schema::table('opportunities', function (Blueprint $table) {
                $table->dropColumn('direct_link');
            });
        }
    }
};
