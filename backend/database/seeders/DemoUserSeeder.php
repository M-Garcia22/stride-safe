<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Demo Trainer
        User::updateOrCreate(
            ['email' => 'trainer@demo.com'],
            [
                'name' => 'Demo Trainer',
                'password' => Hash::make('demo123'),
                'user_type' => 'trainer',
                'organization' => 'Demo Stables',
            ]
        );

        // Demo Track Official
        User::updateOrCreate(
            ['email' => 'track@demo.com'],
            [
                'name' => 'Demo Track Official',
                'password' => Hash::make('demo123'),
                'user_type' => 'track',
                'organization' => 'Demo Racetrack',
            ]
        );

        // Demo Veterinarian
        User::updateOrCreate(
            ['email' => 'vet@demo.com'],
            [
                'name' => 'Dr. Demo Vet',
                'password' => Hash::make('demo123'),
                'user_type' => 'vet',
                'organization' => 'Demo Veterinary Clinic',
                'license_number' => 'VET-12345',
            ]
        );

        $this->command->info('Demo users created successfully!');
        $this->command->info('  - trainer@demo.com / demo123');
        $this->command->info('  - track@demo.com / demo123');
        $this->command->info('  - vet@demo.com / demo123');
    }
}

