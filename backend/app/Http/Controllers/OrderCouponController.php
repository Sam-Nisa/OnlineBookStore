<?php

namespace App\Http\Controllers;

use App\Models\OrderCoupon;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class OrderCouponController extends Controller
{
    // Apply coupon to an order
    public function store(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'coupon_id' => 'required|exists:coupons,id',
            'discount_applied' => 'required|numeric|min:0',
        ]);

        $orderCoupon = OrderCoupon::create($request->all());

        return response()->json([
            'message' => 'Coupon applied to order successfully',
            'order_coupon' => $orderCoupon
        ]);
    }

    // Get all applied coupons (admin only)
    public function index()
    {
        $user = JWTAuth::parseToken()->authenticate();
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $orderCoupons = OrderCoupon::with(['order', 'coupon'])->get();
        return response()->json($orderCoupons);
    }

    // Get single applied coupon
    public function show($id)
    {
        $orderCoupon = OrderCoupon::with(['order', 'coupon'])->find($id);
        if (!$orderCoupon) {
            return response()->json(['error' => 'Not found'], 404);
        }
        return response()->json($orderCoupon);
    }

    // Admin can delete applied coupon
    public function destroy($id)
    {
        $user = JWTAuth::parseToken()->authenticate();
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $orderCoupon = OrderCoupon::find($id);
        if (!$orderCoupon) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $orderCoupon->delete();
        return response()->json(['message' => 'Order coupon deleted successfully']);
    }
}
