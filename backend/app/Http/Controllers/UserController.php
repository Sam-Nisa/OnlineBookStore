<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    // List all users (admin only)
    public function index()
    {
        $currentUser = JWTAuth::parseToken()->authenticate();

        if ($currentUser->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $users = User::all();
        return response()->json($users, 200);
    }

    // Get single user by ID
    public function show($id)
    {
        $currentUser = JWTAuth::parseToken()->authenticate();
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Only admin or the user themselves can view
        if ($currentUser->role !== 'admin' && $currentUser->id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($user, 200);
    }

    // Update user info
    public function update(Request $request, $id)
    {
        $currentUser = JWTAuth::parseToken()->authenticate();
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if ($currentUser->role !== 'admin' && $currentUser->id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:6',
            'avatar' => 'sometimes|image|mimes:jpg,jpeg,png,gif|max:2048',
            'role' => 'sometimes|in:user,admin,author'
        ]);

        if ($request->filled('name')) $user->name = $request->name;
        if ($request->filled('email')) $user->email = $request->email;
        if ($request->filled('password')) $user->password = Hash::make($request->password);

        // Handle avatar upload or URL
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('avatars', $filename, 'public');
            $user->avatar = '/storage/' . $path;
        } elseif ($request->filled('avatar')) {
            $user->avatar = $request->avatar;
        }

        // Only admin can change role
        if ($request->filled('role')) {
            if ($currentUser->role === 'admin') {
                $user->role = $request->role;
            } else {
                return response()->json(['error' => 'Only admin can change role'], 403);
            }
        }

        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ], 200);
    }

    // Delete user (admin only)
    public function destroy($id)
    {
        $currentUser = JWTAuth::parseToken()->authenticate();

        if ($currentUser->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }

    // Approve user to author (admin only)
    public function approveToAuthor($id)
    {
        $currentUser = JWTAuth::parseToken()->authenticate();

        if ($currentUser->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->role = 'author';
        $user->save();

        return response()->json([
            'message' => 'User approved as author successfully',
            'user' => $user
        ], 200);
    }
}
