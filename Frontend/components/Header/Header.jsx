import React, { useState, useEffect } from "react";
import {
  FiMenu,
  FiUser,
  FiSearch,
  FiShoppingCart,
  FiSmartphone,
  FiMonitor,
  FiHeadphones,
  FiCamera,
  FiBriefcase,
  FiNavigation,
  FiChevronDown,
  FiX,
  FiPackage,
  FiClock,
  FiHome,
  FiShoppingBag,
  FiBookOpen,
  FiBell,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm, setCategoryFilter } from "../index.js";
import { HoverMenu, Login, Signup } from "../../features/index.js"; // Add Register import

import {
  getApi,
  getAllCategoryRoute,
  totalCartItemNumberRoute,
  getApiById,
  getUserIdFromToken,
  userTotalNumberOfUnReadNotificationsRoute,
  userNotificationRoute,
  MESSAGE,
} from "../../src/index.js";
import logo from "../../assets/logo.jpg";

// Function to map category names to appropriate icons
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();

  if (name.includes("mobile") || name.includes("phone")) return FiSmartphone;
  if (
    name.includes("electronic") ||
    name.includes("tv") ||
    name.includes("television")
  )
    return FiMonitor;
  if (
    name.includes("audio") ||
    name.includes("headphone") ||
    name.includes("speaker")
  )
    return FiHeadphones;
  if (name.includes("camera") || name.includes("photo")) return FiCamera;
  if (
    name.includes("travel") ||
    name.includes("bag") ||
    name.includes("luggage")
  )
    return FiBriefcase;
  if (name.includes("navigation") || name.includes("gps")) return FiNavigation;
  if (name.includes("watch") || name.includes("time")) return FiClock;
  if (name.includes("home") || name.includes("appliance")) return FiHome;
  if (
    name.includes("clothing") ||
    name.includes("fashion") ||
    name.includes("apparel")
  )
    return FiShoppingBag;
  if (name.includes("book") || name.includes("education")) return FiBookOpen;
  if (name.includes("computer") || name.includes("laptop")) return FiMonitor;

  // Default icon for unknown categories
  return FiPackage;
};

const Header = () => {
  const [isHoveringCategory, setIsHoveringCategory] = useState(false);
  const [categoryHoverTimeout, setCategoryHoverTimeout] = useState(null);
  const [isHoveringSignIn, setIsHoveringSignIn] = useState(false);
  const [signInHoverTimeout, setSignInHoverTimeout] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [modalContent, setModalContent] = useState(null); // <-- Add this state
  const [user, setUser] = useState(null); // For login modal
  const [message, setMessage] = useState(""); // For login modal
  const [showMobileProfile, setShowMobileProfile] = useState(false); // For mobile profile menu
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Redux for search functionality
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.filters.searchTerm);
  const [searchInput, setSearchInput] = useState(searchTerm || "");

  // New state for categories
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isHoveringNotification, setIsHoveringNotification] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const userId = getUserIdFromToken();
      setIsAuthenticated(!!userId);
    };
    
    checkAuth();
    // Listen for auth changes
    window.addEventListener('tokenChanged', checkAuth);
    return () => window.removeEventListener('tokenChanged', checkAuth);
  }, []);

  // Fetch cart count and notification count from API
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const user_id = getUserIdFromToken();
        if (!user_id) {
          setCartCount(0);
          setNotificationCount(0);
          return;
        }

        // Fetch cart count
        const cartResponse = await getApiById(
          totalCartItemNumberRoute,
          user_id
        );
        if (cartResponse.success && cartResponse.data) {
          setCartCount(cartResponse.data.itemCount || 0);
        } else {
          setCartCount(0);
        }

        // Fetch notification count
        const notificationResponse = await getApiById(
          userTotalNumberOfUnReadNotificationsRoute,
          user_id
        );
        if (notificationResponse.success && notificationResponse.data) {
          setNotificationCount(notificationResponse.data.unreadCount || 0);
        } else {
          setNotificationCount(0);
        }
      } catch (error) {
        // Silently handle authentication errors for counts
        setCartCount(0);
        setNotificationCount(0);
      }
    };

    fetchCounts();
  }, []);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);

        const response = await getApi(getAllCategoryRoute);

        if (response.status && response.data) {
          // Transform API data to match our component structure
          const transformedCategories = response.data.map((category) => ({
            icon: getCategoryIcon(category.name),
            label: category.name,
            slug: category.slug,
            category_id: category.category_id,
          }));

          setCategories(transformedCategories);
        } else {
          // Handle specific "No data found" message
          if (response.message === MESSAGE.get.empty) {
            throw new Error(
              "No categories available. Please contact admin to add categories."
            );
          } else {
            throw new Error(
              "Unable to load categories. Please try again later."
            );
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategoriesError(error.message || "Failed to fetch categories");
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Keep hover menu open when modal is open
  useEffect(() => {
    if (isModalOpen) {
      // Keep the hover menu visible when modal is open
      setIsHoveringSignIn(true);
    }
  }, [isModalOpen]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (categoryHoverTimeout) {
        clearTimeout(categoryHoverTimeout);
      }
      if (signInHoverTimeout) {
        clearTimeout(signInHoverTimeout);
      }
    };
  }, [categoryHoverTimeout, signInHoverTimeout]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      // Update Redux search term
      dispatch(setSearchTerm(searchInput.trim()));
      // Navigate to home route with search
      navigate("/");
      console.log("Searching for:", searchInput.trim());
    }
  };

  // Handle search input change with real-time filtering
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    // Real-time search: Update Redux immediately for live filtering
    dispatch(setSearchTerm(value));
    console.log("🔍 Real-time search from Header:", value);
  };

  // Sync local search input with Redux search term
  useEffect(() => {
    setSearchInput(searchTerm || "");
  }, [searchTerm]);

  // Sync selected category with URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get("category_id");

    if (categoryId) {
      setSelectedCategoryId(categoryId);
    } else {
      setSelectedCategoryId(null);
    }
  }, [window.location.search]);

  // Handle category click
  const handleCategoryClick = (category) => {
    setSelectedCategoryId(category.category_id);
    dispatch(setCategoryFilter(category.category_id));
    navigate(`/mainzone?category_id=${category.category_id}`);
    setIsMenuOpen(false); // Close mobile menu
    setIsHoveringCategory(false); // Close category dropdown
  };

  // Clear category selection
  const clearCategorySelection = () => {
    setSelectedCategoryId(null);
    dispatch(setCategoryFilter(null));
    navigate("/mainzone");
  };

  // Handle modal state changes from HoverMenu
  const handleModalStateChange = (isOpen) => {
    setIsModalOpen(isOpen);
  };

  // Handle sign in hover
  const handleSignInMouseEnter = () => {
    if (signInHoverTimeout) {
      clearTimeout(signInHoverTimeout);
      setSignInHoverTimeout(null);
    }
    setIsHoveringSignIn(true);
  };

  const handleSignInMouseLeave = () => {
    // Don't close if modal is open
    if (isModalOpen) {
      return;
    }

    // Add delay to prevent accidental closing
    const timeout = setTimeout(() => {
      if (!isModalOpen) {
        setIsHoveringSignIn(false);
      }
    }, 200);
    setSignInHoverTimeout(timeout);
  };

  // Fetch recent notifications
  const fetchRecentNotifications = async () => {
    try {
      const user_id = getUserIdFromToken();
      if (!user_id) return;

      const response = await getApiById(userNotificationRoute, user_id);
      if (response.success && response.data) {
        setRecentNotifications(response.data.notifications || []);
      }
    } catch (error) {
      // Silently handle authentication errors for notifications
      setRecentNotifications([]);
    }
  };

  // Handle category dropdown hover
  const handleCategoryMouseEnter = () => {
    // Clear any existing timeout
    if (categoryHoverTimeout) {
      clearTimeout(categoryHoverTimeout);
      setCategoryHoverTimeout(null);
    }
    setIsHoveringCategory(true);
  };

  const handleCategoryMouseLeave = () => {
    // Add a delay before closing to allow moving to dropdown
    const timeout = setTimeout(() => {
      setIsHoveringCategory(false);
    }, 150); // 150ms delay
    setCategoryHoverTimeout(timeout);
  };

  // Add this function to handle modal close/reset
  const handleCloseModal = () => {
    setModalContent(null);
    setMessage("");
  };

  return (
    <div className="sticky top-0 z-50">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white py-2 md:py-3 px-4 md:px-6 shadow-lg">
        <div className="flex items-center justify-between md:justify-start w-full flex-wrap">
          {/* LOGO */}
          <div
            className="flex-shrink-0 text-xl md:text-2xl font-bold flex items-center md:mr-8 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <img 
              src={logo} 
              alt="MAA LAXMI STORE" 
              className="w-8 h-8 md:w-10 md:h-10 mr-2 rounded-lg object-cover shadow-sm border border-white/20"
            />
            <span className="hidden sm:inline">MAA LAXMI STORE</span>
            <span className="sm:hidden">MLS</span>
          </div>

          {/* DESKTOP SEARCH */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-full max-w-2xl">
              <FiSearch
                onClick={handleSearch}
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg cursor-pointer hover:text-indigo-600 hover:scale-110 transition duration-200 ${
                  isSearchFocused ? "opacity-0" : "opacity-100"
                }`}
              />
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm text-sm transition-all duration-200"
              />
            </div>
          </div>

          {/* RIGHT - DESKTOP LOGIN + CART */}
          <div className="hidden md:flex items-center space-x-6 ml-auto">
            <div
              className="relative group"
              onMouseEnter={handleSignInMouseEnter}
              onMouseLeave={handleSignInMouseLeave}
            >
              <div className="flex items-center cursor-pointer hover:text-amber-500 transition-colors duration-200 px-3 py-2">
                <FiUser className="w-5 h-5 mr-1" />
                <span className="text-sm font-medium">Sign In</span>
                <FiChevronDown className="w-4 h-4 ml-1" />
              </div>
              <AnimatePresence>
                {isHoveringSignIn && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 z-50"
                    onMouseEnter={handleSignInMouseEnter}
                    onMouseLeave={handleSignInMouseLeave}
                  >
                    <div className="w-3 h-3 bg-white rotate-45 absolute -top-1 left-5 shadow-sm" />
                    <HoverMenu onModalStateChange={handleModalStateChange} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className="relative"
              onMouseEnter={() => {
                setIsHoveringNotification(true);
                fetchRecentNotifications();
              }}
              onMouseLeave={() => setIsHoveringNotification(false)}
            >
              <Link to="/notifications" className="flex items-center relative">
                <FiBell className="w-5 h-5 mr-2" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 left-3 transform -translate-y-1/2 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </Link>
              <AnimatePresence>
                {isHoveringNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 right-0 z-50 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-[28rem] overflow-hidden backdrop-blur-sm"
                  >
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center">
                          <FiBell className="w-5 h-5 mr-2 text-indigo-600" />
                          Notifications
                        </h3>
                        {notificationCount > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {notificationCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {recentNotifications.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {recentNotifications
                            .slice(0, 5)
                            .map((notification, index) => (
                              <div
                                key={notification.notification_id}
                                className="p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer group"
                              >
                                <div className="flex items-start space-x-3">
                                  <div
                                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                      !notification.is_read
                                        ? "bg-blue-500"
                                        : "bg-gray-300"
                                    }`}
                                  ></div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-700">
                                        {notification.title}
                                      </h4>
                                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                        {new Date(
                                          notification.createdAt
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                      {notification.message}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                      <span
                                        className={`text-xs px-2 py-1 rounded-full ${
                                          notification.channel === "in_app"
                                            ? "bg-purple-100 text-purple-700"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                      >
                                        {notification.channel === "in_app"
                                          ? "In-App"
                                          : notification.channel}
                                      </span>
                                      <span className="text-xs text-gray-400">
                                        {new Date(
                                          notification.createdAt
                                        ).toLocaleTimeString("en-US", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 px-6">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FiBell className="w-8 h-8 text-gray-400" />
                          </div>
                          <h4 className="text-sm font-medium text-gray-900 mb-1">
                            {getUserIdFromToken()
                              ? "No notifications yet"
                              : "Please sign in"}
                          </h4>
                          <p className="text-xs text-gray-500 text-center">
                            {getUserIdFromToken()
                              ? "We'll notify you when something arrives!"
                              : "Sign in to view your notifications"}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                      <Link
                        to="/notifications"
                        className="flex items-center justify-center w-full text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200 group"
                      >
                        View all notifications
                        <svg
                          className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/cart" className="flex items-center relative">
              <FiShoppingCart className="w-5 h-5 mr-2" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0 left-3 transform -translate-y-1/2 bg-amber-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* MOBILE ICONS */}
          <div className="flex md:hidden items-center space-x-4 ml-auto">
            <button
              className="text-white text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full">
            <FiSearch
              onClick={handleSearch}
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg cursor-pointer hover:text-indigo-600 hover:scale-110 transition duration-200 ${isSearchFocused ? "opacity-0" : "opacity-100"}`}
            />
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search for products..."
              className="w-full pl-10 pr-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm text-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden bg-indigo-700 px-4 py-4 space-y-4 rounded-b shadow-lg divide-y divide-indigo-600">
            <div className="space-y-4">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      setModalContent("login");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left hover:bg-indigo-600 p-2 rounded transition-colors"
                  >
                    <FiUser className="w-5 h-5 mr-2" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => {
                      setModalContent("signup");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left hover:bg-indigo-600 p-2 rounded transition-colors"
                  >
                    <FiUser className="w-5 h-5 mr-2" />
                    <span>Create an account</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowMobileProfile(!showMobileProfile)}
                    className="flex items-center justify-between w-full text-left hover:bg-indigo-600 p-2 rounded transition-colors"
                  >
                    <div className="flex items-center">
                      <FiUser className="w-5 h-5 mr-2" />
                      <span>My Profile</span>
                    </div>
                    <FiChevronDown className={`w-4 h-4 transition-transform ${showMobileProfile ? 'rotate-180' : ''}`} />
                  </button>
                  {showMobileProfile && (
                    <div className="ml-4 space-y-2 border-l-2 border-indigo-500 pl-4">
                      <Link
                        to="/profile"
                        className="flex items-center hover:bg-indigo-600 p-2 rounded transition-colors text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiUser className="w-4 h-4 mr-2" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/profile/orders"
                        className="flex items-center hover:bg-indigo-600 p-2 rounded transition-colors text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiShoppingBag className="w-4 h-4 mr-2" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/profile/wishlist"
                        className="flex items-center hover:bg-indigo-600 p-2 rounded transition-colors text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiPackage className="w-4 h-4 mr-2" />
                        <span>Wishlist</span>
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.removeItem('token');
                          window.dispatchEvent(new Event('tokenChanged'));
                          setIsMenuOpen(false);
                          navigate('/');
                        }}
                        className="flex items-center hover:bg-red-600 p-2 rounded transition-colors text-sm w-full text-left"
                      >
                        <FiX className="w-4 h-4 mr-2" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </>
              )}
              <Link
                to="/notifications"
                className="flex items-center relative hover:bg-indigo-600 p-2 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiBell className="w-5 h-5 mr-2" />
                <span>Notifications</span>
                {notificationCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="flex items-center relative hover:bg-indigo-600 p-2 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiShoppingCart className="w-5 h-5 mr-2" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="ml-auto bg-amber-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}

        {/* LOGIN MODAL (works for both desktop and mobile) */}
        <AnimatePresence>
          {modalContent === "login" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[999] px-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-white rounded-xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Login
                  setModalContent={setModalContent}
                  setUser={setUser}
                  setMessage={setMessage}
                />
              </motion.div>
            </motion.div>
          )}
          {modalContent === "signup" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[999] px-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-white rounded-xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Signup
                  setModalContent={setModalContent}
                  setUser={setUser}
                  setMessage={setMessage}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVIGATION BAR */}
        <nav className="bg-white shadow-sm py-2 md:py-3 rounded-xl mx-4 mt-2">
          <div className="flex items-center px-4">
            {/* CATEGORIES DROPDOWN */}
            <div
              className="relative group"
              onMouseEnter={handleCategoryMouseEnter}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <div
                className={`flex items-center space-x-2 cursor-pointer transition-colors duration-200 relative ${
                  selectedCategoryId
                    ? "text-indigo-600"
                    : "group-hover:text-amber-500"
                }`}
              >
                <FiMenu
                  className={`w-5 h-5 ${
                    selectedCategoryId ? "text-indigo-600" : "text-gray-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    selectedCategoryId
                      ? "text-indigo-600 font-semibold"
                      : "text-gray-800"
                  }`}
                >
                  Categories
                  {selectedCategoryId && (
                    <span className="ml-1 text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </span>
                <FiChevronDown
                  className={`w-4 h-4 ${
                    selectedCategoryId ? "text-indigo-600" : "text-gray-600"
                  }`}
                />
                {selectedCategoryId && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              {isHoveringCategory && (
                <div
                  className="absolute top-6 left-0 bg-gray-50 text-gray-800 rounded-xl shadow-lg z-50 border border-gray-200 w-48 mt-1"
                  onMouseEnter={handleCategoryMouseEnter}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  {categoriesLoading ? (
                    <div className="px-4 py-3 text-center text-gray-500">
                      <span className="text-sm">Loading categories...</span>
                    </div>
                  ) : categoriesError ? (
                    <div className="px-4 py-3 text-center text-gray-500">
                      <span className="text-sm">Sign in to browse</span>
                    </div>
                  ) : (
                    <>
                      {selectedCategoryId && (
                        <button
                          onClick={clearCategorySelection}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 w-full text-left border-b border-gray-200"
                        >
                          <FiX className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Clear Category Filter
                          </span>
                        </button>
                      )}
                      {categories.map((item, index) => {
                        const isSelected =
                          selectedCategoryId === item.category_id;
                        return (
                          <button
                            key={item.category_id || index}
                            onClick={() => handleCategoryClick(item)}
                            className={`flex items-center space-x-2 px-4 py-3 transition-colors duration-200 w-full text-left relative ${
                              isSelected
                                ? "bg-indigo-100 text-indigo-700 border-l-4 border-indigo-500"
                                : "hover:bg-indigo-50 hover:text-indigo-600"
                            }`}
                          >
                            <item.icon
                              className={`w-5 h-5 ${
                                isSelected ? "text-indigo-600" : "text-gray-600"
                              }`}
                            />
                            <span
                              className={`text-sm font-medium ${
                                isSelected ? "font-semibold" : ""
                              }`}
                            >
                              {item.label}
                            </span>
                            {isSelected && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* NAV LINKS */}
            <div className="flex overflow-x-auto flex-1 justify-start md:justify-center space-x-4 md:space-x-8 scrollbar-thin scrollbar-thumb-gray-400">
              {categoriesLoading ? (
                <div className="text-xs md:text-sm text-gray-500 px-1 py-1">
                  Loading...
                </div>
              ) : categoriesError ? (
                <div className="flex items-center space-x-2 px-2 py-1">
                  <FiUser className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs md:text-sm text-gray-600">Sign in to browse</span>
                </div>
              ) : (
                categories.map((item, index) => {
                  const isSelected = selectedCategoryId === item.category_id;
                  return (
                    <button
                      key={item.category_id || index}
                      onClick={() => handleCategoryClick(item)}
                      className={`text-xs md:text-sm font-medium whitespace-nowrap flex items-center px-3 py-2 rounded-full relative group transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
                        isSelected
                          ? "text-indigo-600 font-semibold bg-indigo-50"
                          : "text-gray-800 hover:text-amber-500 hover:bg-amber-50"
                      }`}
                    >
                      <item.icon
                        className={`mr-1 md:mr-2 text-base md:text-lg ${
                          isSelected ? "text-indigo-600" : "text-gray-600"
                        }`}
                      />
                      {item.label}
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 transition-all duration-200 ${
                          isSelected
                            ? "w-full bg-indigo-500"
                            : "w-0 bg-amber-500 group-hover:w-full"
                        }`}
                      ></span>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
