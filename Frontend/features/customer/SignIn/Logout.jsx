import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSignOutAlt } from "react-icons/fa";

const LogoutModal = ({ onConfirm, onCancel, isLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[1000] px-4"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-xl w-full max-w-md p-6 sm:p-8 relative shadow-2xl"
      >
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <FaSignOutAlt className="text-4xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Logout</h2>
          <p className="text-sm text-gray-600">Are you sure you want to logout?</p>
          <div className="flex gap-4 justify-center">
            <button
              className={`w-1/2 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 rounded-lg hover:from-red-600 hover:to-red-700 transition-all ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Logging out..." : "Logout"}
            </button>
            <button
              className="w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 py-2.5 rounded-lg hover:from-gray-300 hover:to-gray-400 transition-all"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LogoutModal;