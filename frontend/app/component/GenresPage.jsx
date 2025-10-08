"use client";
import { useEffect } from "react";
import { useGenreStore } from "../store/useGenreStore";

export default function GenresList() {
  const { genres, fetchGenres, loading, error } = useGenreStore();

  useEffect(() => {
    fetchGenres(); // fetch all genres
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Book Categories</h2>
      <ul className="list-disc pl-5">
        {genres.map((genre) => (
          <li key={genre.id} className="mb-1">
            {genre.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
