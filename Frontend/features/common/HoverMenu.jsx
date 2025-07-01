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
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Login, Signup, ForgotPassword, LogoutModal } from "../index.js";

const HoverMenu = ({ isMobile = false, onModalStateChange }) => {
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState(null);
  const [user, setUser] = useState(null); // Initialize as null for initial Login/Signup view
  const [message, setMessage] = useState("");
  const [modalOpacity, setModalOpacity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Check for existing token on component mount and listen for storage changes
  useEffect(() => {
    const checkExistingToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          // Check if token is not expired
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
            setUser({
              email: decodedToken.email,
              emailOrMobile: decodedToken.email,
              user_id: decodedToken.user_id,
              role: decodedToken.role,
              name: decodedToken.name || decodedToken.email,
            });
          } else {
            // Token expired, remove it
            localStorage.removeItem("token");
            setUser(null);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // Check on mount
    checkExistingToken();

    // Listen for storage changes (when token is added/removed)
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        checkExistingToken();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events (for same-tab changes)
    const handleTokenChange = () => {
      checkExistingToken();
    };

    window.addEventListener("tokenChanged", handleTokenChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenChanged", handleTokenChange);
    };
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Clear token from localStorage
      localStorage.removeItem("token");

      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("tokenChanged"));

      setUser(null); // Reset user to null to show Login/Signup
      setShowLogoutModal(false);
      setModalContent("success");
      setMessage("Logged out successfully!");
      setIsLoading(false);

      // Navigate to home page after logout
      navigate("/");
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
          // Check for token after success modal closes (in case of login)
          const token = localStorage.getItem("token");
          if (token && !user) {
            try {
              const decodedToken = jwtDecode(token);
              const currentTime = Date.now() / 1000;
              if (decodedToken.exp > currentTime) {
                setUser({
                  email: decodedToken.email,
                  emailOrMobile: decodedToken.email,
                  user_id: decodedToken.user_id,
                  role: decodedToken.role,
                  name: decodedToken.name || decodedToken.email,
                });
              }
            } catch (error) {
              console.error("Error decoding token:", error);
            }
          }
        }, 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [modalContent, user]);

  useEffect(() => {
    if (modalContent || showLogoutModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalContent, showLogoutModal]);

  // Check for token changes when modal closes
  useEffect(() => {
    if (!modalContent && !showLogoutModal) {
      // Modal just closed, check if user logged in
      const token = localStorage.getItem("token");
      if (token && !user) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
            setUser({
              email: decodedToken.email,
              emailOrMobile: decodedToken.email,
              user_id: decodedToken.user_id,
              role: decodedToken.role,
              name: decodedToken.name || decodedToken.email,
            });
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }
  }, [modalContent, showLogoutModal, user]);

  // Notify parent component about modal state changes
  useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(modalContent !== null || showLogoutModal);
    }
  }, [modalContent, showLogoutModal, onModalStateChange]);

  const menuItems = [
    {
      id: "orders",
      label: "My Orders",
      icon: FaShoppingBag,
      path: "/profile/orders",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: FaHeart,
      path: "/profile/wishlist",
    },
    { id: "profile", label: "Profile", icon: FaUser, path: "/profile" },
  ];

  const renderMenuItem = (item) => (
    <motion.div key={item.id} whileHover={{ x: 5 }}>
      <Link
        to={item.path}
        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-md transition-colors duration-150"
      >
        <div className="flex items-center">
          <item.icon className="text-gray-600 mr-2 text-base" />
          <span className="text-gray-800 text-sm font-medium">
            {item.label}
          </span>
        </div>
        <FaChevronRight className="text-gray-400 text-[10px]" />
      </Link>
    </motion.div>
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
                    <div>
                      <span className="text-gray-800 text-sm font-medium truncate max-w-[160px] block">
                        {user?.emailOrMobile || user?.email || "User"}
                      </span>
                      <span className="text-green-600 text-xs">
                        Role: {user?.role || "User"}
                      </span>
                    </div>
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
                    <div>
                      <span className="text-gray-800 text-sm font-medium truncate max-w-[160px] block">
                        {user?.emailOrMobile || user?.email || "User"}
                      </span>
                      <span className="text-green-600 text-xs">
                        Role: {user?.role || "User"}
                      </span>
                    </div>
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
              className="bg-white rounded-xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              {modalContent === "login" ? (
                <Login
                  setModalContent={setModalContent}
                  setUser={setUser}
                  setMessage={setMessage}
                />
              ) : modalContent === "signup" ? (
                <Signup setModalContent={setModalContent} setUser={setUser} />
              ) : modalContent === "forgotPassword" ? (
                <ForgotPassword
                  setModalContent={setModalContent}
                  setMessage={setMessage}
                />
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
