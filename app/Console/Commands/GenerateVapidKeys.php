<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateVapidKeys extends Command
{
    protected $signature = 'webpush:vapid';
    protected $description = 'Generate VAPID keys for web push notifications';

    public function handle()
    {
        $this->info('Generate VAPID keys using: npx web-push generate-vapid-keys');
        $this->newLine();
        $this->info('Then add these to your .env file:');
        $this->line('VAPID_PUBLIC_KEY=<your-public-key>');
        $this->line('VAPID_PRIVATE_KEY=<your-private-key>');

        return 0;
    }
}
