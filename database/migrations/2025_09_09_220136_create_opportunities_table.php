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
        if (!Schema::hasTable('opportunities')) {
            Schema::create('opportunities', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('u_id'); // user_id
                $table->string('user_role', 100)->nullable();
                $table->string('title');
                $table->text('description');
                $table->text('meta_description')->nullable();
                $table->text('meta_keywords')->nullable();
                $table->string('cover_img')->nullable();
                $table->string('slug', 191)->unique(); // Limit slug length for MySQL key constraint
                $table->text('embeded_html')->nullable();
                $table->bigInteger('views')->default(0);
                $table->integer('comments')->default(0);
                $table->decimal('ratings', 3, 2)->default(0);
                $table->date('deadline')->nullable();
                $table->string('apply_link')->nullable();
                $table->string('source_url')->nullable();
                $table->boolean('deleted')->default(0);
                $table->string('post_type', 100)->default('opportunities'); // Limit length for index
                $table->softDeletes();
                $table->timestamps();
                
                // Indexes
                $table->index('u_id');
                $table->index('deleted');
                $table->index('post_type');
                $table->index('slug');
                $table->index('deadline');
                
                // Foreign key
                $table->foreign('u_id')->references('id')->on('users')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opportunities');
    }
};
