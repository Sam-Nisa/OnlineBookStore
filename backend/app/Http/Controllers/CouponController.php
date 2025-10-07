<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class CouponController extends Controller
{
    // Admin can create a coupon
    public function store(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'code' => 'required|unique:coupons,code',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'expiry_date' => 'required|date',
            'usage_limit' => 'required|integer|min:1',
        ]);

        $coupon = Coupon::create($request->all());

        return response()->json([
            'message' => 'Coupon created successfully',
            'coupon' => $coupon
        ]);
    }

    // Get all coupons (all roles can view)
    public function index()
    {
        $coupons = Coupon::all();
        return response()->json($coupons);
    }

    // Get single coupon
    public function show($id)
    {
        $coupon = Coupon::find($id);
        if (!$coupon) {
            return response()->json(['error' => 'Coupon not found'], 404);
        }
        return response()->json($coupon);
    }

    // Admin can delete a coupon
    public function destroy($id)
    {
        $user = JWTAuth::parseToken()->authenticate();

        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $coupon = Coupon::find($id);
        if (!$coupon) {
            return response()->json(['error' => 'Coupon not found'], 404);
        }

        $coupon->delete();
        return response()->json(['message' => 'Coupon deleted successfully']);
    }
}
