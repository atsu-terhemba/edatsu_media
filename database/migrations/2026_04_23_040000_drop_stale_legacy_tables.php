<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $tables = [
        'company_directory',
        'opp_comments',
        'opp_replies',
    ];

    public function up(): void
    {
        foreach ($this->tables as $table) {
            Schema::dropIfExists($table);
        }
    }

    public function down(): void
    {
        // No-op: these tables held no data and had no models or code references
        // when dropped. Restoring empty tables would not bring back functionality.
    }
};
