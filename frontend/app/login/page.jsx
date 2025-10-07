"use client"; 
import React, { useState } from 'react';
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false); // <-- state for password

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-10">
      <div className="flex w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Left Section */}
        <div className="w-1/2 bg-gradient-to-br from-yellow-600 to-yellow-800 flex flex-col justify-start items-center p-10 text-white relative">
          <div className="absolute top-8 left-8 flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-yellow-400" />
            <span className="text-2xl font-bold">BookHub</span>
          </div>

          <div className="w-full flex justify-center mt-12">
            <div className="w-80 h-80 relative rounded-full overflow-hidden">
              <Image
                src="/login.png"
                alt="Book illustration"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <h2 className="text-3xl font-semibold mt-8 text-center leading-snug">
            Online Community For <br /> Readers
          </h2>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-1/2 flex flex-col justify-center items-center p-10 bg-white">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
              Welcome Back to <br /> BookHub Community
            </h1>

            <div className="mb-6">
              <input
                type="text"
                id="email"
                placeholder="Email"
                className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-purple-500 text-lg"
              />
            </div>

            {/* Password Input with toggle */}
            <div className="mb-6 relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-purple-500 text-lg pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 3.172a4 4 0 015.656 0L10 4.343l1.172-1.171a4 4 0 115.656 5.656L14.828 10l1.656 1.657a4 4 0 01-5.656 5.656L10 15.657l-1.172 1.171a4 4 0 01-5.656-5.656L5.172 10 3.172 8.343a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between mb-8">
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="form-checkbox text-yellow-600 mr-2 rounded" defaultChecked />
                Remember me
              </label>
              <button className="bg-yellow-600 hover:bg-yellow-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                Log In
              </button>
            </div>

            <div className="flex justify-center space-x-4 mb-8">
              <button className="flex items-center border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                <img src="/google-logo.svg" alt="Google" className="w-5 h-5 mr-2" />
                Log In with Google
              </button>
              <button className="flex items-center border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                <img src="/github-logo.svg" alt="GitHub" className="w-5 h-5 mr-2" />
                Log In with GitHub
              </button>
            </div>

            <p className="text-center text-gray-600">
              No account yet?{" "}
              <Link href="/register" className="text-yellow-600 font-semibold hover:underline">
                SIGN UP
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
