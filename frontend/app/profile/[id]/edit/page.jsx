"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "../../../store/useUserStore";
import { useAuthStore } from "../../../store/authStore";
import ProfileEdit from "../../../component/ProfileEdit";

export default function ProfilePage() {
  const { user: authUser, token } = useAuthStore();
  const { fetchUserById, updateUser, error } = useUserStore();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token || !authUser?.id) return;

    const getProfile = async () => {
      setLoading(true);
      try {
        const data = await fetchUserById(authUser.id);
        if (data) setUser(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [authUser, token, fetchUserById]);

  const handleSave = async (formData) => {
    if (!user) return;
    setSaving(true);
  
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      if (formData.avatar instanceof File) payload.append("avatar", formData.avatar);
  
      const updated = await updateUser(user.id, payload);
      if (updated) {
        updated.avatar = updated.avatar + "?t=" + new Date().getTime(); // refresh avatar
        setUser(updated);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };
  
  
  
  if (loading) return <p className="p-6">Loading profile...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!user) return <p className="p-6 text-gray-500">Profile not found.</p>;

  return <ProfileEdit user={user} onSave={handleSave} onCancel={() => {}} saving={saving} />;
}
