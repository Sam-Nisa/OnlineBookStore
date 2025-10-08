<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Check if admin already exists
        if (User::where('email', env('ADMIN_EMAIL', 'admin@example.com'))->exists()) {
            return;
        }

        User::create([
            'name' => env('ADMIN_NAME', 'Admin User'),
            'email' => env('ADMIN_EMAIL', 'admin@example.com'),
            'password_hash' => Hash::make(env('ADMIN_PASSWORD', '12345678')),
            'role' => env('ADMIN_ROLE', 'admin'),
            'avatar' => env('ADMIN_AVATAR', 'https://example.com/avatars/default.png'),
        ]);
    }
}
