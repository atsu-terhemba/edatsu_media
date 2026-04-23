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
        Schema::table('mail_subscribers', function (Blueprint $table) {
            if (! Schema::hasColumn('mail_subscribers', 'first_name')) {
                $table->string('first_name')->after('id');
            }
            if (! Schema::hasColumn('mail_subscribers', 'last_name')) {
                $table->string('last_name')->after('first_name');
            }
            if (! Schema::hasColumn('mail_subscribers', 'email')) {
                $table->string('email')->unique()->after('last_name');
            }
            if (! Schema::hasColumn('mail_subscribers', 'created_at')) {
                $table->timestamps();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op: the columns are owned by the original create migration now.
    }
};
