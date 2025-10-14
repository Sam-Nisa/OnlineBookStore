"use client";
import { useEffect, useState } from "react";
import { useGenreStore } from "../../store/useGenreStore";

export default function GenresPage() {
  const {
    genres,
    loading,
    error,
    fetchGenres,
    createGenre,
    updateGenre,
    deleteGenre,
  } = useGenreStore();

  const [newGenre, setNewGenre] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [editingGenreId, setEditingGenreId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingImage, setEditingImage] = useState(null);

  useEffect(() => {
    fetchGenres();
  }, []);

  // ✅ Add new genre
  const handleAddGenre = async () => {
    if (!newGenre.trim()) return;
    await createGenre({ name: newGenre, image: newImage });
    setNewGenre("");
    setNewImage(null);
  };

  // ✅ Start editing
  const handleEdit = (genre) => {
    setEditingGenreId(genre.id);
    setEditingName(genre.name);
    setEditingImage(null);
  };

  // ✅ Update genre
  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;
    await updateGenre(id, { name: editingName, image: editingImage });
    setEditingGenreId(null);
    setEditingName("");
    setEditingImage(null);
  };

  // ✅ Delete genre
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this genre?")) return;
    await deleteGenre(id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Genres Management</h2>

      {/* Add new genre */}
      <div className="mb-6 flex flex-col md:flex-row gap-2 items-center">
        <input
          type="text"
          placeholder="New genre name"
          value={newGenre}
          onChange={(e) => setNewGenre(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files[0])}
          className="border p-2 rounded"
        />
        {newImage && (
          <img
            src={URL.createObjectURL(newImage)}
            alt="Preview"
            className="w-12 h-12 object-cover rounded"
          />
        )}
        <button
          onClick={handleAddGenre}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
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
        <ul className="space-y-3">
          {genres.map((genre) => (
            <li
              key={genre.id}
              className="flex justify-between items-center bg-white p-3 rounded shadow"
            >
              <div className="flex items-center gap-3">
                {/* Edit mode */}
                {editingGenreId === genre.id ? (
                  <>
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="border p-1 rounded"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditingImage(e.target.files[0])}
                      className="border p-1 rounded"
                    />
                    {editingImage ? (
                      <img
                        src={URL.createObjectURL(editingImage)}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      genre.image_url && (
                        <img
                          src={genre.image_url}
                          alt={genre.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )
                    )}
                  </>
                ) : (
                  <>
                    <span className="font-medium">{genre.name}</span>
                    {genre.image_url && (
                      <img
                        src={genre.image_url}
                        alt={genre.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {editingGenreId === genre.id ? (
                  <button
                    onClick={() => handleUpdate(genre.id)}
                    disabled={loading}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
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
