<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('profiles')) {
            return;
        }

        Schema::create('profiles', function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->longText('profile_picture')->nullable();
            $table->string('full_name', 191)->nullable();
            $table->string('email', 191)->nullable()->unique();
            $table->text('about')->nullable();
            $table->string('phone_no', 191)->nullable();
            $table->string('gender', 191)->nullable();
            $table->string('date_of_birth', 191)->nullable();
            $table->text('location')->nullable();
            $table->text('linkedin_profile')->nullable();
            $table->timestamps();

            $table->index('user_id', 'profiles_user_id_foreign');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
