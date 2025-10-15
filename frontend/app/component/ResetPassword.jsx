"use client";

import { useState } from "react";
import { Lock, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // Success or generic error message

  // Simple client-side validation
  const validateForm = () => {
    const newErrors = {};
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required.";
    }
    if (newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters.";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (currentPassword && newPassword && currentPassword === newPassword) {
        newErrors.newPassword = "New password must be different from the current one.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Clear any success/error messages
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // --- START: Mock API Interaction (NO actual fetch) ---
    setSaving(true);
    setErrors({});
    setMessage(null);

    // Simulate an API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate success or failure response
    const success = Math.random() > 0.3; // 70% chance of success

    if (success) {
      setMessage({ type: "success", text: "Password successfully updated! You can now use your new password." });
      // Optionally reset form data after success
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setMessage({ type: "error", text: "Failed to update password. Please check your current password and try again." });
    }

    setSaving(false);
    // --- END: Mock API Interaction ---
  };

  const InputField = ({ label, name, value, error }) => (
    <div className="mb-6">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        type="password"
        name={name}
        value={value}
        onChange={handleChange}
        autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'}
        disabled={saving}
        className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-150 ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-8 max-w-lg mx-auto bg-gray-50 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100"
      >
        <div className="flex items-center mb-6">
          <Lock className="w-8 h-8 text-indigo-600 mr-3" />
          <h2 className="text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
        </div>
        <p className="text-gray-500 mb-8 border-b pb-4">
          Change your password to keep your account secure.
        </p>

        {/* Status Message */}
        {message && (
          <div
            className={`p-4 mb-6 rounded-lg flex items-start ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            )}
            <p>{message.text}</p>
          </div>
        )}

        {/* Current Password Field */}
        <InputField
          label="Current Password"
          name="currentPassword"
          value={formData.currentPassword}
          error={errors.currentPassword}
        />

        {/* New Password Field */}
        <InputField
          label="New Password (min 8 characters)"
          name="newPassword"
          value={formData.newPassword}
          error={errors.newPassword}
        />

        {/* Confirm Password Field */}
        <InputField
          label="Confirm New Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          error={errors.confirmPassword}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className={`flex items-center justify-center w-full px-6 py-3 mt-4 rounded-lg font-bold text-white transition duration-200 shadow-lg ${
            saving
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Set New Password
            </>
          )}
        </button>
      </form>
    </div>
  );
}