<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('comments')) return;

        Schema::create('comments', function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('commentable_id');
            $table->string('commentable_type', 191)->nullable();
            $table->text('comment');
            $table->boolean('is_approved')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id', 'opp_comments_user_id_foreign');
            $table->index(['commentable_id', 'commentable_type'], 'opp_comments_commentable_id_commentable_type_index');
            $table->index(['commentable_type', 'commentable_id'], 'idx_comments_commentable');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
