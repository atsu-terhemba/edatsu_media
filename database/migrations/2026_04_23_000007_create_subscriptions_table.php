<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('subscriptions')) {
            return;
        }

        Schema::create('subscriptions', function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('subscription_plan_id');
            $table->enum('billing_period', ['monthly', 'yearly']);
            $table->string('currency', 3)->default('NGN');
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['active', 'cancelled', 'expired', 'pending'])->default('pending');
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->string('payment_provider')->nullable();
            $table->string('provider_subscription_id')->nullable();
            $table->boolean('auto_renew')->default(true);
            $table->timestamps();

            $table->index('subscription_plan_id', 'subscriptions_subscription_plan_id_foreign');
            $table->index(['user_id', 'status'], 'subscriptions_user_id_status_index');
            $table->index(['user_id', 'status', 'ends_at'], 'subscriptions_user_status_ends_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
