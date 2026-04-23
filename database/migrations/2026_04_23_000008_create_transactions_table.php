<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('transactions')) {
            return;
        }

        Schema::create('transactions', function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('subscription_id')->nullable();
            $table->string('reference', 100)->unique();
            $table->string('provider_reference')->nullable();
            $table->string('payment_provider');
            $table->string('payment_method')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3);
            $table->enum('status', ['pending', 'successful', 'failed', 'refunded'])->default('pending');
            $table->enum('type', ['subscription', 'renewal', 'upgrade', 'refund'])->default('subscription');
            $table->text('description')->nullable();
            $table->json('provider_response')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->unique(['provider_reference'], 'transactions_provider_reference_unique');
            $table->index('subscription_id', 'transactions_subscription_id_foreign');
            $table->index(['user_id', 'status'], 'transactions_user_id_status_index');
            $table->index('reference', 'transactions_reference_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
