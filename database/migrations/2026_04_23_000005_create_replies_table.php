<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('replies')) {
            return;
        }

        Schema::create('replies', function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->id();
            $table->unsignedBigInteger('comment_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('guest_name', 191)->nullable();
            $table->text('content');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('commentable_type', 191);
            $table->unsignedBigInteger('commentable_id');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['commentable_type', 'commentable_id']);
            $table->index('comment_id', 'replies_comment_id_foreign');
            $table->index('user_id', 'replies_user_id_foreign');
            $table->index('parent_id', 'replies_parent_id_foreign');
            $table->index(['commentable_id', 'commentable_type']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('replies');
    }
};
