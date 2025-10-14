"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "../../store/useUserStore";
import { useAuthStore } from "../../store/authStore";

export default function AdminProfilePage() {
  const { user: authUser, token } = useAuthStore(); // logged-in user
  const { fetchUserById, updateUser, loading, error } = useUserStore();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: null, // File object or URL
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token || !authUser?.id) return;

    const getProfile = async () => {
      try {
        const data = await fetchUserById(authUser.id);
        setUser(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          avatar: data.avatar || null,
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    getProfile();
  }, [authUser, token, fetchUserById]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    if (formData.avatar instanceof File) {
      payload.append("avatar", formData.avatar);
    } else if (typeof formData.avatar === "string") {
      payload.append("avatar", formData.avatar);
    }

    try {
      const updated = await updateUser(user.id, payload);
      setUser(updated);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!user) return <p className="p-6 text-gray-500">Profile not found.</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>

      <div className="mb-4">
        <label className="font-semibold block mb-1">Name:</label>
        {editMode ? (
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        ) : (
          <p>{user.name || "N/A"}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="font-semibold block mb-1">Email:</label>
        {editMode ? (
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        ) : (
          <p>{user.email || "N/A"}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="font-semibold block mb-1">Avatar:</label>
        {editMode ? (
          <input type="file" name="avatar" onChange={handleChange} />
        ) : user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name || "avatar"}
            className="w-32 h-32 object-cover rounded-full mt-2"
          />
        ) : (
          <p>N/A</p>
        )}
      </div>

      <div className="mb-4">
        <label className="font-semibold">Role:</label>
        <p>{user.role || "User"}</p>
      </div>

      <div className="mb-4">
        <label className="font-semibold">Created At:</label>
        <p>{user.created_at ? new Date(user.created_at).toLocaleString() : "N/A"}</p>
      </div>

      <div className="mb-4">
        <label className="font-semibold">Updated At:</label>
        <p>{user.updated_at ? new Date(user.updated_at).toLocaleString() : "N/A"}</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        {editMode ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
