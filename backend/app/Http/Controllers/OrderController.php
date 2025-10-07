<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class OrderController extends Controller
{
    // Get all orders for current user
    public function index()
    {
        $user = JWTAuth::parseToken()->authenticate();
        $orders = Order::with('items')->where('user_id', $user->id)->get();

        return response()->json($orders);
    }

    // Create a new order
    public function store(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $request->validate([
            'total_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cod,paypal,stripe,bank',
        ]);

        $order = Order::create([
            'user_id' => $user->id,
            'total_amount' => $request->total_amount,
            'status' => 'pending',
            'payment_method' => $request->payment_method,
        ]);

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order
        ]);
    }

    // View single order
    public function show($id)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $order = Order::with('items')->where('id', $id)->where('user_id', $user->id)->first();

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        return response()->json($order);
    }
}
