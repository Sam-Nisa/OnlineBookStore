"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu, BookOpen } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [cartCount] = useState(3);

  return (
    <header className="sticky top-0 z-50 w-full px-32 bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200">
      <div className=" mx-auto px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-20 h-20 relative rounded-full overflow-hidden">
              <Image
                src="/logo.png" // Replace with your logo path
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

       {/* Desktop Navigation */}
<nav className="hidden md:flex items-center gap-8 font-inter text-gray-700">
  <Link
    href="/browse"
    className="text-md font-medium py-6 hover:text-yellow-600 transition-colors duration-300"
  >
    Browse
  </Link>
  <Link
    href="/categories"
    className="text-md font-medium py-6 hover:text-yellow-600 transition-colors duration-300"
  >
    Categories
  </Link>
  <Link
    href="/bestsellers"
    className="text-md font-medium py-6 hover:text-yellow-600 transition-colors duration-300"
  >
    Bestsellers
  </Link>
  <Link
    href="/authors"
    className="text-md font-medium py-6 hover:text-yellow-600 transition-colors duration-300"
  >
    Authors
  </Link>
</nav>





          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-12">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search books, authors, genres..."
                className="pl-12 pr-4 py-2 w-full rounded-xl border border-gray-300 bg-gray-50 shadow-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5">
            {/* Search (Mobile) */}
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 lg:hidden">
              <Search className="h-5 w-5" />
            </button>

{/* Login */}
<Link
  href="/login"
  className="p-2 bg-yellow-600 py-2 px-4 text-white rounded-lg hover:bg-yellow-800 transition-all duration-200  font-medium"
>
  Login
</Link>


            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-yellow-600 py-2 px-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu */}
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 md:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
