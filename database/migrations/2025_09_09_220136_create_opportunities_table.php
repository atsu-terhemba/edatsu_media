<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('opportunities')) return;

        Schema::create('opportunities', function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->id();
            $table->unsignedBigInteger('u_id');
            $table->string('user_role', 191);
            $table->string('cover_img', 191)->nullable();
            $table->string('title', 191);
            $table->string('slug', 151)->nullable();
            $table->text('description')->nullable();
            $table->string('deadline', 191)->nullable();
            $table->text('source_url');
            $table->string('direct_link', 191)->nullable();
            $table->text('category')->nullable();
            $table->string('region', 191)->nullable();
            $table->string('country', 191)->nullable();
            $table->string('continent', 191)->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->string('post_type', 151)->nullable();
            $table->integer('views')->default(0);
            $table->enum('status', ['draft', 'published', 'archived'])->default('published');
            $table->tinyInteger('deleted')->default(0);
            $table->timestamps();

            $table->index('u_id', 'opportunity_u_id_foreign');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('opportunities');
    }
};
