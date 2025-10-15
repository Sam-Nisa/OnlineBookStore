"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, X, User, Mail, Image, Loader2 } from "lucide-react"; // Importing icons

export default function ProfileEdit({ user, onCancel, onSave, saving }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: null, // File or null
  });

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);

  // Function to revoke the object URL for cleanup
  const revokeCurrentUrl = useCallback(() => {
    if (formData.avatar instanceof File && avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
  }, [formData.avatar, avatarPreview]);

  // Update formData when user prop changes (e.g., component visibility toggles)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: null, // reset file input for a fresh upload
      });
      // Set the initial preview to the existing avatar URL
      setAvatarPreview(user.avatar_url || null);
    }
    // Cleanup runs on unmount or before dependencies change
    return () => {
      revokeCurrentUrl();
    };
  }, [user, revokeCurrentUrl]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      revokeCurrentUrl(); // Revoke previous local file URL

      setFormData((prev) => ({ ...prev, [name]: file }));
      setAvatarPreview(URL.createObjectURL(file)); // Create new local file URL for preview
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const InputField = ({ label, name, type = "text", value, Icon, placeholder }) => (
    <div className="mb-6">
      <label htmlFor={name} className="flex items-center text-sm font-medium text-gray-700 mb-1">
        <Icon className="w-4 h-4 mr-2 text-indigo-500" />
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150"
      />
    </div>
  );

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-3">
          Update Profile Details
        </h2>

        {/* Avatar Upload */}
        <div className="mb-8 flex flex-col items-center">
          <label className="text-lg font-semibold text-gray-700 mb-4">
            Profile Picture
          </label>
          <div className="relative w-32 h-32 mb-4">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt={formData.name || "avatar preview"}
                className="w-full h-full object-cover rounded-full border-4 border-indigo-200 shadow-md"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 rounded-full border-4 border-gray-300 shadow-md">
                <Image className="w-10 h-10" />
              </div>
            )}
            <input
              type="file"
              name="avatar"
              onChange={handleChange}
              className="absolute inset-0 opacity-0 cursor-pointer" // Hidden input overlay
              accept="image/*"
            />
            {/* Overlay for visual feedback */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
              <span className="text-white text-xs font-bold">Change</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">Click the image to upload a new avatar.</p>
        </div>

        {/* Name Field */}
        <InputField
          label="Full Name"
          name="name"
          value={formData.name}
          Icon={User}
          placeholder="Enter your full name"
        />

        {/* Email Field */}
        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          Icon={Mail}
          placeholder="Enter your email address"
        />

        {/* Buttons */}
        <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center justify-center px-6 py-2.5 rounded-lg font-semibold text-white transition duration-200 shadow-md ${
              saving
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 font-semibold"
          >
            <X className="w-5 h-5 mr-2" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}