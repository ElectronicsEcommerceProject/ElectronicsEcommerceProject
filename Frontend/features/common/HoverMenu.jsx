import React, { useState, useEffect } from "react";
import {
  FaShoppingBag,
  FaHeart,
  FaUser,
  FaMapMarkerAlt,
  FaCog,
  FaGift,
  FaSignOutAlt,
  FaChevronRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../customer/SignIn/Login";
import Signup from "../customer/SignIn/Signup";
import ForgotPassword from "../customer/SignIn/ForgotPassword";
import LogoutModal from "../customer/SignIn/Logout";

const HoverMenu = ({ isMobile = false, onModalStateChange }) => {
  const [modalContent, setModalContent] = useState(null);
  const [user, setUser] = useState(null); // Initialize as null for initial Login/Signup view
  const [message, setMessage] = useState("");
  const [modalOpacity, setModalOpacity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser(null); // Reset user to null to show Login/Signup
      setShowLogoutModal(false);
      setModalContent("success");
      setMessage("Logged out successfully!");
      setIsLoading(false);
    }, 1000);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const closeModal = () => {
    setModalContent(null);
    setMessage("");
  };

  useEffect(() => {
    if (modalContent === "success") {
      setModalOpacity(1);
      const timer = setTimeout(() => {
        setModalOpacity(0);
        setTimeout(() => {
          setModalContent(null);
          setMessage("");
        }, 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [modalContent]);

  useEffect(() => {
    if (modalContent || showLogoutModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalContent, showLogoutModal]);

  // Notify parent component about modal state changes
  useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(modalContent !== null || showLogoutModal);
    }
  }, [modalContent, showLogoutModal, onModalStateChange]);

  const menuItems = [
    { id: "orders", label: "My Orders", icon: FaShoppingBag, path: "/profilepage?section=orders" },
    { id: "wishlist", label: "Wishlist", icon: FaHeart, path: "/profilepage?section=wishlist" },
    { id: "profile", label: "Profile", icon: FaUser, path: "/profilepage" },
    
  ];

  const renderMenuItem = (item) => (
    <motion.a
      key={item.id}
      href={item.path}
      whileHover={{ x: 5 }}
      className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-md transition-colors duration-150"
    >
      <div className="flex items-center">
        <item.icon className="text-gray-600 mr-2 text-base" />
        <span className="text-gray-800 text-sm font-medium">{item.label}</span>
      </div>
      <FaChevronRight className="text-gray-400 text-[10px]" />
    </motion.a>
  );

  return (
    <div>
      {/* Dropdown Menu */}
      <AnimatePresence>
        {!isMobile ? (
          user ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white shadow-lg rounded-md z-50 border border-gray-200"
              style={{ width: "fit-content", minWidth: "200px" }}
            >
              <div className="p-3">
                <div className="mb-2">
                  <h3 className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    Account
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 text-sm font-medium truncate max-w-[160px]">
                      {user?.emailOrMobile || user?.email || "User"}
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5 mb-2">
                  <h3 className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    Menu
                  </h3>
                  {menuItems.map(renderMenuItem)}
                </div>

                <div className="border-t pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                  >
                    <FaSignOutAlt className="mr-2 text-base" />
                    <span className="font-medium text-sm">Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white shadow-lg rounded-md z-50 border border-gray-200"
              style={{ width: "fit-content", minWidth: "160px" }}
            >
              <div className="p-2 space-y-1">
                <button
                  className="w-full bg-blue-600 text-white py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 transition-all px-3"
                  onClick={() => setModalContent("login")}
                >
                  Login
                </button>
                <button
                  className="w-full border border-gray-300 text-gray-800 py-1.5 rounded-md text-xs font-medium hover:bg-gray-50 transition-all px-3"
                  onClick={() => setModalContent("signup")}
                >
                  Sign Up
                </button>
              </div>
            </motion.div>
          )
        ) : (
          <div className="flex flex-col">
            {!user ? (
              <div className="space-y-1 p-2">
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded-md text-xs font-medium hover:bg-blue-700 transition-all px-3"
                  onClick={() => setModalContent("login")}
                >
                  Login
                </button>
                <button
                  className="w-full border border-gray-300 text-gray-800 py-2 rounded-md text-xs font-medium hover:bg-gray-50 transition-all px-3"
                  onClick={() => setModalContent("signup")}
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="p-2">
                <div className="mb-2 p-2">
                  <h3 className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    Account
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 text-sm font-medium truncate max-w-[160px]">
                      {user?.emailOrMobile || user?.email || "User"}
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5 mb-2">
                  <h3 className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    Menu
                  </h3>
                  {menuItems.map(renderMenuItem)}
                </div>

                <div className="border-t pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                  >
                    <FaSignOutAlt className="mr-2 text-base" />
                    <span className="font-medium text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
          isLoading={isLoading}
        />
      )}

      <AnimatePresence>
        {modalContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: modalOpacity, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[999] px-4"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white rounded-xl w-full max-w-md p-6 sm:p-8 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              {modalContent === "login" ? (
                <Login
                  setModalContent={setModalContent}
                  setUser={setUser}
                  setMessage={setMessage}
                />
              ) : modalContent === "signup" ? (
                <Signup
                  setModalContent={setModalContent}
                  setUser={setUser}
                />
              ) : modalContent === "forgotPassword" ? (
                <ForgotPassword setModalContent={setModalContent} setMessage={setMessage} />
              ) : modalContent === "success" ? (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Success!</h2>
                  <p className="text-gray-600">{message}</p>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HoverMenu;