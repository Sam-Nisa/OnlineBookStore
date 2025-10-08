"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "../../store/useUserStore";

export default function UsersPage() {
  const { users, fetchUsers, deleteUser, approveUser, updateUser, loading, error } = useUserStore();
  const [editingUserId, setEditingUserId] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditData({ name: user.name, email: user.email });
      };

  const handleSave = async (id) => {
    await updateUser(id, editData);
    setEditingUserId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Users List</h1>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-4 py-2">{user.id}</td>

                <td className="px-4 py-2">
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    user.name
                  )}
                </td>

                <td className="px-4 py-2">
                  {editingUserId === user.id ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    user.email
                  )}
                </td>

                <td className="px-4 py-2">{user.role}</td>

                <td className="px-4 py-2 space-x-2">
                  {editingUserId === user.id ? (
                    <>
                      <button
                        onClick={() => handleSave(user.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      {user.role !== "author" && (
                        <button
                          onClick={() => approveUser(user.id)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Approve
                        </button>
                      )}

                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
