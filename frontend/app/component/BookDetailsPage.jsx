"use client";

import { useState, useEffect } from "react";
import { useBookStore } from "../store/useBookStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useOrderStore } from "../store/useOrderStore"; // <-- import order store
import { useAuthStore } from "../store/authStore";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

export default function BookDetails({ bookId }) {
  const { token } = useAuthStore();
  const { wishlists, addWishlist, removeWishlist, isWishlisted } = useWishlistStore();
  const { fetchBook, books } = useBookStore();
  const { createOrder, fetchOrders } = useOrderStore(); // <-- order functions

  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadBook = async () => {
      await fetchBook(bookId);
      const b = books.find((b) => b.id === bookId);
      setBook(b || null);
    };
    loadBook();
  }, [bookId, books]);

  if (!book) return <p>Loading book details...</p>;

  const handleToggleWishlist = async () => {
    if (!token) return;
    if (isWishlisted(book.id)) {
      await removeWishlist(book.id);
    } else {
      await addWishlist(book.id);
    }
  };

  const handleAddToOrder = async () => {
    if (!token) return alert("Please log in to place an order.");

    const payload = {
      book_id: book.id,
      quantity: quantity,
      price: book.price,
    };

    try {
      await createOrder(payload); // create a new order
      alert("Order created successfully!");
      fetchOrders(); // refresh user orders
    } catch (err) {
      console.error("Failed to create order:", err);
      alert("Failed to create order");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={book.cover_image || "/images/default-cover.png"}
          alt={book.title}
          className="w-full md:w-1/3 h-64 object-cover rounded"
          onError={(e) => { e.currentTarget.src = "/images/default-cover.png"; }}
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
          <p className="text-gray-500 mb-2">{book.genre?.name || "No genre"}</p>
          <p className="mb-1">Price: ${book.price}</p>
          <p className="mb-1">Stock: {book.stock}</p>
          <p className="mb-2">Status: {book.status}</p>
          <p className="mb-4">{book.description}</p>

          {token && (
            <>
              <button
                onClick={handleToggleWishlist}
                className={`px-4 py-2 rounded flex items-center gap-2 mb-2 ${
                  isWishlisted(book.id)
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {isWishlisted(book.id) ? <HeartSolid className="w-5 h-5" /> : <HeartOutline className="w-5 h-5" />}
                {isWishlisted(book.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border p-1 rounded w-16"
                />
                <button
                  onClick={handleAddToOrder}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add to Order
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
