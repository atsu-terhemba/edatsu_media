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
        Schema::create('ad_settings', function (Blueprint $table) {
            $table->id();
            $table->string('slot_name', 100)->unique(); // Reduced from 255 to 100
            $table->string('page', 50)->nullable();
            $table->string('position', 50);
            $table->string('size', 50)->default('responsive');
            $table->text('ad_code')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Global settings table for site-wide ad control
        Schema::create('ad_global_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('ads_enabled')->default(false); // Master switch for all ads
            $table->string('adsense_publisher_id')->nullable(); // ca-pub-XXXXXXXXXXXXXXXX
            $table->timestamps();
        });

        // Insert default global settings
        DB::table('ad_global_settings')->insert([
            'ads_enabled' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_settings');
        Schema::dropIfExists('ad_global_settings');
    }
};
