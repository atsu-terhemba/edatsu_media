<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $taxonomies = ['categories', 'tags', 'regions', 'countries', 'continents', 'brand_labels'];

        foreach ($taxonomies as $name) {
            if (Schema::hasTable($name)) continue;

            Schema::create($name, function (Blueprint $table) {
                $table->engine = 'MyISAM';
                $table->charset = 'utf8mb4';
                $table->collation = 'utf8mb4_unicode_ci';

                $table->id();
                $table->string('name', 191);
                $table->text('slug')->nullable();
                $table->string('description', 191)->nullable();
                $table->boolean('deleted')->default(false);
                $table->timestamps();
                $table->softDeletes();
            });
        }

        if (! Schema::hasTable('product_categories')) {
            Schema::create('product_categories', function (Blueprint $table) {
                $table->engine = 'MyISAM';
                $table->charset = 'utf8mb4';
                $table->collation = 'utf8mb4_unicode_ci';

                $table->id();
                $table->string('name');
                $table->string('slug', 191);
                $table->text('description')->nullable();
                $table->string('cover_img')->nullable();
                $table->timestamps();
                $table->softDeletes();

                $table->index('slug');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('brand_labels');
        Schema::dropIfExists('continents');
        Schema::dropIfExists('countries');
        Schema::dropIfExists('regions');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('product_categories');
        Schema::dropIfExists('categories');
    }
};
