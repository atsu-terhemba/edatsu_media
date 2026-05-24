<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('article_collections')) {
            Schema::create('article_collections', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->string('name', 80);
                $table->string('color', 16)->nullable();
                $table->timestamps();

                $table->unique(['user_id', 'name'], 'collection_user_name_uniq');
                $table->index('user_id');
            });
        }

        if (!Schema::hasTable('article_collection_items')) {
            Schema::create('article_collection_items', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('collection_id');
                $table->unsignedBigInteger('saved_article_id');
                $table->timestamp('created_at')->nullable();

                $table->unique(['collection_id', 'saved_article_id'], 'collection_item_uniq');
                $table->index('saved_article_id');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('article_collection_items');
        Schema::dropIfExists('article_collections');
    }
};
