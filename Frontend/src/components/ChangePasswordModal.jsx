import { motion } from "framer-motion";
import { useState } from "react";
import { changePassword } from "../api/authApi";


export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (newPassword !== confirmNewPassword) {
      setError("New password and Confirm password do not match.");
      return;
    }

    try {
      const response = await changePassword({
        old_password: currentPassword,
        new_password: newPassword,
      });

      setSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

    } catch (err) {
      setError(err.response?.data?.error || "Failed to update password");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>

        {/* Constraints Box */}
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-4">
          <p>Your password must:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Not be too similar to your personal info.</li>
            <li>Contain at least 8 characters.</li>
            <li>Not be a commonly used password.</li>
            <li>Not be entirely numeric.</li>
          </ul>
        </div>

        {/* Input Fields */}
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Update Password
          </button>
        </div>
      </motion.div>
    </div>
  );
};


