<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\OrderCouponController;
use App\Http\Controllers\InventoryLogController;

// Public routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Protected routes (JWT)
Route::middleware(['jwt.auth'])->group(function () {

    // Auth
    Route::get('profile', [AuthController::class, 'profile']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);

    // Users
    Route::get('users', [UserController::class, 'index']);
    Route::get('users/{id}', [UserController::class, 'show']);
    Route::put('users/{id}', [UserController::class, 'update']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);
    Route::put('users/{id}/approve', [UserController::class, 'approveToAuthor']);

     // Genres CRUD
    Route::get('genres', [GenreController::class, 'index']);       // All logged-in users
    Route::get('genres/{id}', [GenreController::class, 'show']);   // All logged-in users
    Route::post('genres', [GenreController::class, 'store']);      // Admin only
    Route::put('genres/{id}', [GenreController::class, 'update']); // Admin only
    Route::delete('genres/{id}', [GenreController::class, 'destroy']); // Admin only

    // Books CRUD
    Route::get('books', [BookController::class, 'index']);       // All logged-in users
    Route::get('books/{id}', [BookController::class, 'show']);   // All logged-in users
    Route::post('books', [BookController::class, 'store']);      // Admin or author
    Route::put('books/{id}', [BookController::class, 'update']); // Admin or book author
    Route::delete('books/{id}', [BookController::class, 'destroy']); // Admin or book author

    // Reviews
    Route::get('reviews', [ReviewController::class, 'index']);
    Route::post('reviews', [ReviewController::class, 'store']);
    Route::delete('reviews/{id}', [ReviewController::class, 'destroy']); // Owner/Admin

    // Wishlist
    Route::get('wishlists', [WishlistController::class, 'index']);
    Route::post('wishlists', [WishlistController::class, 'add']);
    Route::delete('wishlists/{book_id}', [WishlistController::class, 'remove']);

    // Orders
    Route::get('orders', [OrderController::class, 'index']);
    Route::post('orders', [OrderController::class, 'store']);
    Route::get('orders/{id}', [OrderController::class, 'show']);

    // Order Items
    Route::post('order-items', [OrderItemController::class, 'store']);
    Route::get('order-items/{order_id}', [OrderItemController::class, 'index']);

    // Coupons
    Route::post('coupons', [CouponController::class, 'store']); // Admin only
    Route::get('coupons', [CouponController::class, 'index']); // All users
    Route::get('coupons/{id}', [CouponController::class, 'show']);
    Route::delete('coupons/{id}', [CouponController::class, 'destroy']); // Admin only

    // Order Coupons
    Route::post('order-coupons', [OrderCouponController::class, 'store']);
    Route::get('order-coupons', [OrderCouponController::class, 'index']); // Admin only
    Route::get('order-coupons/{id}', [OrderCouponController::class, 'show']);
    Route::delete('order-coupons/{id}', [OrderCouponController::class, 'destroy']); // Admin only

    // Inventory Logs
    Route::get('inventory-logs', [InventoryLogController::class, 'index']);
    Route::post('inventory-logs', [InventoryLogController::class, 'store']);
    Route::get('inventory-logs/{id}', [InventoryLogController::class, 'show']);
    Route::delete('inventory-logs/{id}', [InventoryLogController::class, 'destroy']);
});
