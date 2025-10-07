<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;
use Tymon\JWTAuth\Facades\JWTAuth;

class BookController extends Controller
{
    // ✅ List all books (any logged-in user)
    public function index()
    {
        $books = Book::with(['author', 'genre'])->get();
        return response()->json($books);
    }

    // ✅ Get a single book (any logged-in user)
    public function show($id)
    {
        $book = Book::with(['author', 'genre'])->find($id);
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }
        return response()->json($book);
    }

    // ✅ Create book (admin or author)
    public function store(Request $request)
    {
        $currentUser = JWTAuth::parseToken()->authenticate();
        if (!in_array($currentUser->role, ['admin', 'author'])) {
            return response()->json(['error' => 'Unauthorized. Only admin or author can create books.'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'genre_id' => 'required|exists:genres,id',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'cover_image' => 'sometimes|image|mimes:jpg,jpeg,png,gif|max:2048',
            'description' => 'sometimes|string',
            'status' => 'sometimes|in:pending,approved,rejected'
        ]);

        $bookData = $request->only(['title', 'genre_id', 'price', 'stock', 'description', 'status']);
        $bookData['author_id'] = $currentUser->id;

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            $file = $request->file('cover_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('books', $filename, 'public');
            $bookData['cover_image'] = '/storage/' . $path;
        }

        $book = Book::create($bookData);

        return response()->json([
            'message' => 'Book created successfully',
            'book' => $book
        ]);
    }

    // ✅ Update book (admin can update any book, author only their books)
    public function update(Request $request, $id)
    {
        $currentUser = JWTAuth::parseToken()->authenticate();
        $book = Book::find($id);

        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        if ($currentUser->role !== 'admin' && $book->author_id !== $currentUser->id) {
            return response()->json(['error' => 'Unauthorized. Only admin or book author can update.'], 403);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'genre_id' => 'sometimes|required|exists:genres,id',
            'price' => 'sometimes|required|numeric',
            'stock' => 'sometimes|required|integer',
            'cover_image' => 'sometimes|image|mimes:jpg,jpeg,png,gif|max:2048',
            'description' => 'sometimes|string',
            'status' => 'sometimes|in:pending,approved,rejected'
        ]);

        $bookData = $request->only(['title', 'genre_id', 'price', 'stock', 'description', 'status']);

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            $file = $request->file('cover_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('books', $filename, 'public');
            $bookData['cover_image'] = '/storage/' . $path;
        }

        $book->update($bookData);

        return response()->json([
            'message' => 'Book updated successfully',
            'book' => $book
        ]);
    }

    // ✅ Delete book (admin can delete any book, author only their books)
    public function destroy($id)
    {
        $currentUser = JWTAuth::parseToken()->authenticate();
        $book = Book::find($id);

        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        if ($currentUser->role !== 'admin' && $book->author_id !== $currentUser->id) {
            return response()->json(['error' => 'Unauthorized. Only admin or book author can delete.'], 403);
        }

        $book->delete();

        return response()->json([
            'message' => 'Book deleted successfully'
        ]);
    }
}
