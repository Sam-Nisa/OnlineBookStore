"use client";

import Link from "next/link";
import { useWishlistStore } from "../store/useWishlistStore";
import { useAuthStore } from "../store/authStore";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

export default function BookCard({ book }) {
  const { token } = useAuthStore();
  const { wishlists, addWishlist, removeWishlist, isWishlisted } = useWishlistStore();

  const handleToggleWishlist = async (e) => {
    e.stopPropagation(); // prevent card click
    e.preventDefault();
    if (!token) return;
    if (isWishlisted(book.id)) {
      await removeWishlist(book.id);
    } else {
      await addWishlist(book.id);
    }
  };

  return (
    <Link href={`/book/${book.id}`} className="relative">
      <div className="border p-4 rounded shadow hover:shadow-lg transition cursor-pointer relative">
        {book.cover_image && (
          <img src={book.cover_image} alt={book.title} className="w-full h-48 object-cover mb-2 rounded" />
        )}
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <p className="text-sm text-gray-500">{book.genre?.name || "No genre"}</p>
        <p className="text-sm">Price: ${book.price}</p>
        <p className="text-sm">Stock: {book.stock}</p>
        <p className="text-sm">Status: {book.status}</p>

        {/* Wishlist button only if logged in */}
        {token && (
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 p-1 rounded-full"
          >
            {isWishlisted(book.id) ? (
              <HeartSolid className="w-6 h-6 text-red-500" />
            ) : (
              <HeartOutline className="w-6 h-6 text-gray-400" />
            )}
          </button>
        )}
      </div>
    </Link>
  );
}
