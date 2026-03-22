<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->nullable()->constrained()->onDelete('set null');
            $table->string('reference', 100)->unique();      // internal tx reference
            $table->string('provider_reference')->nullable(); // flutterwave tx_ref / tx_id
            $table->string('payment_provider');               // flutterwave, stablecoin
            $table->string('payment_method')->nullable();     // card, bank_transfer, ussd
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3);
            $table->enum('status', ['pending', 'successful', 'failed', 'refunded'])->default('pending');
            $table->enum('type', ['subscription', 'renewal', 'upgrade', 'refund'])->default('subscription');
            $table->text('description')->nullable();
            $table->json('provider_response')->nullable();   // full response from provider
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('reference');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
