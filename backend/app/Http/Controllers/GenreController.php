<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Genre;
use Tymon\JWTAuth\Facades\JWTAuth;

class GenreController extends Controller
{
    // ✅ List all genres (all logged-in users)
    public function index()
    {
        $genres = Genre::with('subgenres')->get();
        return response()->json($genres);
    }

    // ✅ Get a single genre (all logged-in users)
    public function show($id)
    {
        $genre = Genre::with('subgenres')->find($id);
        if (!$genre) {
            return response()->json(['error' => 'Genre not found'], 404);
        }
        return response()->json($genre);
    }

    // ✅ Admin creates a genre
    public function store(Request $request)
    {
        $currentUser = JWTAuth::parseToken()->authenticate();
        if ($currentUser->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized. Only admin can create genres.'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:genres,id'
        ]);

        $genre = Genre::create([
            'name' => $request->name,
            'parent_id' => $request->parent_id
        ]);

        return response()->json([
            'message' => 'Genre created successfully',
            'genre' => $genre
        ]);
    }

    // ✅ Admin updates a genre
    public function update(Request $request, $id)
    {
        $currentUser = JWTAuth::parseToken()->authenticate();
        if ($currentUser->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized. Only admin can update genres.'], 403);
        }

        $genre = Genre::find($id);
        if (!$genre) {
            return response()->json(['error' => 'Genre not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'parent_id' => 'nullable|exists:genres,id'
        ]);

        $genre->update($request->only(['name', 'parent_id']));

        return response()->json([
            'message' => 'Genre updated successfully',
            'genre' => $genre
        ]);
    }

    // ✅ Admin deletes a genre
    public function destroy($id)
    {
        $currentUser = JWTAuth::parseToken()->authenticate();
        if ($currentUser->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized. Only admin can delete genres.'], 403);
        }

        $genre = Genre::find($id);
        if (!$genre) {
            return response()->json(['error' => 'Genre not found'], 404);
        }

        $genre->delete();

        return response()->json([
            'message' => 'Genre deleted successfully'
        ]);
    }
}
