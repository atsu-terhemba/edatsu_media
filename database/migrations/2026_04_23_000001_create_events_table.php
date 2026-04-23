<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('events')) {
            return;
        }

        Schema::create('events', function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->id();
            $table->unsignedBigInteger('u_id');
            $table->string('user_role', 191);
            $table->string('title', 191);
            $table->text('description');
            $table->string('event_type', 191)->nullable();
            $table->text('location')->nullable();
            $table->string('event_date', 191);
            $table->string('event_time', 191)->nullable();
            $table->text('alternate_dates')->nullable();
            $table->string('source_url', 191);
            $table->text('category')->nullable();
            $table->string('country', 191);
            $table->string('region', 191)->nullable();
            $table->string('continent', 191)->nullable();
            $table->integer('views')->default(0);
            $table->tinyInteger('deleted')->default(0);
            $table->timestamps();

            $table->index('u_id', 'events_u_id_foreign');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
