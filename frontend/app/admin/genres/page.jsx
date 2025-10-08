"use client";
import { useEffect, useState } from "react";
import { useGenreStore } from "../../store/useGenreStore";

export default function GenresPage() {
  const { genres, loading, error, fetchGenres, createGenre, updateGenre, deleteGenre } = useGenreStore();
  const [newGenre, setNewGenre] = useState("");
  const [editingGenreId, setEditingGenreId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleAddGenre = async () => {
    if (!newGenre.trim()) return;
    await createGenre({ name: newGenre });
    setNewGenre("");
  };

  const handleEdit = (genre) => {
    setEditingGenreId(genre.id);
    setEditingName(genre.name);
  };

  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;
    await updateGenre(id, { name: editingName });
    setEditingGenreId(null);
    setEditingName("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this genre?")) return;
    await deleteGenre(id);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Genres Management</h2>

      {/* Add new genre */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="New genre name"
          value={newGenre}
          onChange={(e) => setNewGenre(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleAddGenre}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Genres list */}
      {loading ? (
        <p>Loading genres...</p>
      ) : (
        <ul className="space-y-2">
          {genres.map((genre) => (
            <li
              key={genre.id}
              className="flex justify-between items-center bg-white p-2 rounded shadow"
            >
              {editingGenreId === genre.id ? (
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="border p-1 rounded flex-1 mr-2"
                />
              ) : (
                <span>{genre.name}</span>
              )}

              <div className="flex gap-2">
                {editingGenreId === genre.id ? (
                  <button
                    onClick={() => handleUpdate(genre.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(genre)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => handleDelete(genre.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
