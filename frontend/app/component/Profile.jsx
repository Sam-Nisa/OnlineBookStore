"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "../store/useUserStore";
import { useAuthStore } from "../store/authStore";
import { Mail, Calendar, User, Clock, Image, Loader2, AlertTriangle } from "lucide-react"; // Importing icons

export default function Profile() {
  const { user: authUser, token } = useAuthStore();
  const { fetchUserById, error } = useUserStore();

  const [user, setUser] = useState(null);
  const [fetching, setFetching] = useState(true);

  // Fetch profile
  useEffect(() => {
    if (!token || !authUser?.id) return;

    const getProfile = async () => {
      setFetching(true);
      try {
        const data = await fetchUserById(authUser.id);
        if (data) setUser(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setFetching(false);
      }
    };

    getProfile();
  }, [authUser, token, fetchUserById]);

  // --- Render based on State ---

  if (fetching)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="mt-3 text-gray-700">Loading profile...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center p-6 bg-white rounded-xl shadow-lg border-l-4 border-red-500">
          <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="p-6 text-gray-600 bg-white rounded-xl shadow-lg">
          Profile not found or access denied.
        </p>
      </div>
    );

  // Helper component for cleaner data display
  const ProfileItem = ({ label, value, Icon }) => (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center">
        <Icon className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
        <span className="font-medium text-gray-700">{label}:</span>
      </div>
      <p className="text-gray-900 font-normal break-all ml-4 text-right">
        {value}
      </p>
    </div>
  );

  // --- Main Profile Content ---

  return (
    <div className="min-h-screen flex justify-center py-10 sm:py-20 bg-gray-50">
      <div className="w-full max-w-2xl mx-4 sm:mx-auto bg-white shadow-2xl rounded-xl overflow-hidden transform transition duration-500 hover:shadow-3xl">
        {/* Header Section */}
        <div className="bg-indigo-600/90 p-8 flex flex-col items-center">
          {/* Avatar Area */}
          <div className="relative mb-4">
            {user.avatar ? (
              <img
                src={user.avatar_url}
                alt={user.name || "avatar"}
                className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg transition duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-28 h-28 flex items-center justify-center bg-yellow-500 text-white font-extrabold text-4xl rounded-full border-4 border-white shadow-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : "?"}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white" title="Online"></span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-1">
            {user.name || "User Name"}
          </h2>
          <p className="text-indigo-200 font-light italic">{user.role || "User"}</p>
        </div>

        {/* Details Section */}
        <div className="p-6 sm:p-10">
          <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
            User Details
          </h3>

          <div className="space-y-2">
            {/* Name - Displayed above, but included for consistency if needed */}
            {/* <ProfileItem label="Full Name" value={user.name || "N/A"} Icon={User} /> */}
            
            {/* Email */}
            <ProfileItem label="Email Address" value={user.email || "N/A"} Icon={Mail} />

            {/* Role */}
            <ProfileItem label="Account Role" value={user.role || "User"} Icon={User} />

            {/* Created At */}
            <ProfileItem
              label="Member Since"
              value={user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
              Icon={Calendar}
            />

            {/* Last Updated */}
            <ProfileItem
              label="Last Updated"
              value={user.updated_at ? new Date(user.updated_at).toLocaleString() : "N/A"}
              Icon={Clock}
            />
          </div>
        </div>
      </div>
    </div>
  );
}