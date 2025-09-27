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
        // This column is already included in the create_products_table migration
        // No action needed as source_url is created with the products table
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No action needed
    }
};
