<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password_hash' => Hash::make('12345678'),
            'role' => 'admin',
            'avatar' => 'https://example.com/avatars/default.png',
        ]);
    }
}
