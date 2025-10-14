<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Book;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    // ✅ Get user's cart with items
    public function index()
    {
        $user = Auth::user();

        $cart = Cart::with('items.book')
            ->where('user_id', $user->id)
            ->first();

        if (!$cart) {
            return response()->json(['message' => 'Cart is empty'], 200);
        }

        return response()->json($cart);
    }

    // ✅ Add book to cart
    public function addToCart(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'book_id' => 'required|exists:books,id',
            'quantity' => 'required|integer|min:1'
        ]);

        // Get or create a cart for the user
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // Check if the item already exists
        $item = CartItem::where('cart_id', $cart->id)
                        ->where('book_id', $request->book_id)
                        ->first();

        if ($item) {
            // Update quantity if already exists
            $item->quantity += $request->quantity;
            $item->save();
        } else {
            // Create new cart item
            CartItem::create([
                'cart_id' => $cart->id,
                'book_id' => $request->book_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json(['message' => 'Book added to cart successfully']);
    }

    // ✅ Update quantity
    public function updateQuantity(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $item = CartItem::findOrFail($itemId);
        $item->quantity = $request->quantity;
        $item->save();

        return response()->json(['message' => 'Quantity updated']);
    }

    // ✅ Remove item from cart
    public function removeItem($itemId)
    {
        $item = CartItem::findOrFail($itemId);
        $item->delete();

        return response()->json(['message' => 'Item removed from cart']);
    }

    // ✅ Clear the entire cart
    public function clearCart()
    {
        $user = Auth::user();

        $cart = Cart::where('user_id', $user->id)->first();

        if ($cart) {
            $cart->items()->delete();
        }

        return response()->json(['message' => 'Cart cleared successfully']);
    }
}
