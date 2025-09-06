<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class UpdateUserOnlineStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:update-online-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update user online status based on last activity';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Mark users as offline if they haven't been active for more than 5 minutes
        $offlineUsers = User::where('is_online', true)
            ->where(function($query) {
                $query->whereNull('last_seen_at')
                      ->orWhere('last_seen_at', '<', now()->subMinutes(5));
            })
            ->update(['is_online' => false]);

        $this->info("Updated {$offlineUsers} users to offline status.");
        
        return 0;
    }
}
