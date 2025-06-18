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
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "../Redux/filterSlice";
import HoverMenu from "../../features/common/HoverMenu"; // Import HoverMenu as specified

import {
  getApi,
  getAllCategoryRoute,
  totalCartItemNumberRoute,
  getApiById,
  getUserIdFromToken,
} from "../../src/index.js";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Redux for search functionality
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.filters.searchTerm);
  const [searchInput, setSearchInput] = useState(searchTerm || "");

  // New state for categories
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Fetch cart count from API
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const user_id = getUserIdFromToken();
        if (!user_id) {
          setCartCount(0);
          return;
        }

        const response = await getApiById(totalCartItemNumberRoute, user_id);

        if (response.success && response.data) {
          setCartCount(response.data.itemCount || 0);
        } else {
          console.error("Failed to fetch cart count:", response);
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
        setCartCount(0);
      }
    };

    fetchCartCount();
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
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategoriesError(error.message || "Failed to fetch categories");

        // Fallback to hardcoded data if API fails
        const fallbackCategories = [
          {
            icon: FiSmartphone,
            label: "Mobiles",
            slug: "mobiles",
            category_id: "fallback-1",
          },
          {
            icon: FiMonitor,
            label: "Electronics",
            slug: "electronics",
            category_id: "fallback-2",
          },
          {
            icon: FiHeadphones,
            label: "Audio",
            slug: "audio",
            category_id: "fallback-3",
          },
          {
            icon: FiCamera,
            label: "Cameras",
            slug: "cameras",
            category_id: "fallback-4",
          },
          {
            icon: FiBriefcase,
            label: "Travel",
            slug: "travel",
            category_id: "fallback-5",
          },
          {
            icon: FiNavigation,
            label: "Navigation",
            slug: "navigation",
            category_id: "fallback-6",
          },
        ];
        setCategories(fallbackCategories);
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (categoryHoverTimeout) {
        clearTimeout(categoryHoverTimeout);
      }
    };
  }, [categoryHoverTimeout]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      // Update Redux search term
      dispatch(setSearchTerm(searchInput.trim()));
      // Navigate to MainZone with search
      navigate("/mainzone");
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
    navigate(`/mainzone?category_id=${category.category_id}`);
    console.log(
      "🏷️ Category selected:",
      category.label,
      "ID:",
      category.category_id
    );
  };

  // Clear category selection
  const clearCategorySelection = () => {
    setSelectedCategoryId(null);
    navigate("/mainzone");
    console.log("🏷️ Category selection cleared");
  };

  // Handle modal state changes from HoverMenu
  const handleModalStateChange = (isOpen) => {
    setIsModalOpen(isOpen);
  };

  // Handle mouse leave with modal check
  const handleMouseLeave = () => {
    // Only close hover menu if no modal is open
    if (!isModalOpen) {
      // Add a small delay to prevent accidental closing
      setTimeout(() => {
        if (!isModalOpen) {
          setIsHoveringSignIn(false);
        }
      }, 800);
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

  return (
    <div className="sticky top-0 z-50">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white py-2 md:py-3 px-4 md:px-6 shadow-lg">
        <div className="flex items-center justify-between md:justify-start w-full flex-wrap">
          {/* LOGO */}
          <div className="flex-shrink-0 text-xl md:text-2xl font-bold flex items-center md:mr-8">
            <span className="w-6 h-6 bg-white mr-2 rounded-sm"></span>
            MAA LAXMI STORE
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
              onMouseEnter={() => setIsHoveringSignIn(true)}
              onMouseLeave={handleMouseLeave}
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
                  >
                    <div className="w-3 h-3 bg-white rotate-45 absolute -top-1 left-5 shadow-sm" />
                    <HoverMenu onModalStateChange={handleModalStateChange} />
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

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden bg-indigo-700 px-4 py-4 space-y-4 rounded-b shadow-lg divide-y divide-indigo-600">
            <div className="space-y-4">
              <a href="#" className="flex items-center">
                <FiUser className="w-5 h-5 mr-2" />
                <span>Login</span>
              </a>
              <a href="#" className="flex items-center relative">
                <FiShoppingCart className="w-5 h-5 mr-2" />
                <span>Cart</span>
                <span className="ml-auto bg-amber-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              </a>
            </div>
          </div>
        )}

        {/* MOBILE SEARCH BELOW LOGO */}
        <div className="md:hidden w-full flex justify-center px-2">
          <div className="relative w-10/12 max-w-sm">
            <FiSearch
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base transition-opacity duration-200 ${
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
              placeholder="Search for products, brands and more..."
              className="w-full pl-10 pr-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm text-base transition-all duration-200"
            />
          </div>
        </div>
      </header>

      {/* NAVIGATION BAR */}
      <nav className="bg-white shadow-sm py-2 md:py-3">
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
                className="absolute top-6 left-0 bg-gray-50 text-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 w-48 mt-1"
                onMouseEnter={handleCategoryMouseEnter}
                onMouseLeave={handleCategoryMouseLeave}
              >
                {categoriesLoading ? (
                  <div className="px-4 py-3 text-center text-gray-500">
                    <span className="text-sm">Loading categories...</span>
                  </div>
                ) : categoriesError ? (
                  <div className="px-4 py-3 text-center text-red-500">
                    <span className="text-sm">Failed to load categories</span>
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
          <div className="flex overflow-x-auto md:overflow-visible flex-1 justify-start md:justify-center space-x-4 md:space-x-8 scrollbar-hide">
            {categoriesLoading ? (
              <div className="text-xs md:text-sm text-gray-500 px-1 py-1">
                Loading...
              </div>
            ) : categoriesError ? (
              <div className="text-xs md:text-sm text-red-500 px-1 py-1">
                Error loading categories
              </div>
            ) : (
              categories.map((item, index) => {
                const isSelected = selectedCategoryId === item.category_id;
                return (
                  <button
                    key={item.category_id || index}
                    onClick={() => handleCategoryClick(item)}
                    className={`text-xs md:text-sm font-medium whitespace-nowrap flex items-center px-1 py-1 relative group transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
                      isSelected
                        ? "text-indigo-600 font-semibold"
                        : "text-gray-800 hover:text-amber-500"
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
    </div>
  );
};

export default Header;
