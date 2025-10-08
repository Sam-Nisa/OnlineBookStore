"use client";

import { useEffect } from "react";
import { useBookStore } from "../store/useBookStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useAuthStore } from "../store/authStore";
import BookCard from "../component/BookCard";

export default function WishlistPage() {
  const { books, loading: booksLoading, error: booksError, fetchBooks } = useBookStore();
  const { wishlists, fetchWishlists, loading: wishlistLoading, error: wishlistError } = useWishlistStore();
  const { token } = useAuthStore();

  useEffect(() => {
    fetchBooks();
    if (token) fetchWishlists();
  }, [token]);

  // Filter books that are in the user's wishlist
  const wishlistBooks = books.filter(book => wishlists.includes(book.id));

  if (!token) {
    return <p className="p-6 text-red-500">You need to be logged in to view your wishlist.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>

      {(booksLoading || wishlistLoading) && <p>Loading wishlist...</p>}
      {booksError && <p className="text-red-500">{booksError}</p>}
      {wishlistError && <p className="text-red-500">{wishlistError}</p>}

      {wishlistBooks.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
