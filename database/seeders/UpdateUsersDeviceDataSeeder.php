<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Faker\Factory as Faker;

class UpdateUsersDeviceDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        
        $deviceTypes = ['desktop', 'mobile', 'tablet'];
        $browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
        $operatingSystems = ['Windows', 'macOS', 'Linux', 'Android', 'iOS'];
        
        User::chunk(50, function ($users) use ($faker, $deviceTypes, $browsers, $operatingSystems) {
            foreach ($users as $user) {
                $deviceType = $faker->randomElement($deviceTypes);
                $browser = $faker->randomElement($browsers);
                $os = $faker->randomElement($operatingSystems);
                
                // Adjust OS based on device type
                if ($deviceType === 'mobile') {
                    $os = $faker->randomElement(['Android', 'iOS']);
                } elseif ($deviceType === 'tablet') {
                    $os = $faker->randomElement(['Android', 'iOS', 'Windows']);
                } else {
                    $os = $faker->randomElement(['Windows', 'macOS', 'Linux']);
                }
                
                // Randomly set some users as online (20% chance)
                $isOnline = $faker->boolean(20);
                
                $user->update([
                    'device_type' => $deviceType,
                    'browser' => $browser,
                    'operating_system' => $os,
                    'device_name' => $os . ' - ' . $browser,
                    'last_seen_at' => $isOnline ? now() : $faker->dateTimeBetween('-7 days', 'now'),
                    'is_online' => $isOnline,
                    'last_ip_address' => $faker->ipv4(),
                ]);
            }
        });
        
        $this->command->info('Updated device data for all users.');
    }
}
