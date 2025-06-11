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
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HoverMenu from "../../features/common/HoverMenu"; // Import HoverMenu as specified

const navItems = [
  { icon: FiSmartphone, label: "Mobiles" },
  { icon: FiMonitor, label: "Electronics" },
  { icon: FiHeadphones, label: "Audio" },
  { icon: FiCamera, label: "Cameras" },
  { icon: FiBriefcase, label: "Travel" },
  { icon: FiNavigation, label: "Navigation" },
];

const Header = () => {
  const [isHoveringCategory, setIsHoveringCategory] = useState(false);
  const [isHoveringSignIn, setIsHoveringSignIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cartCount = 3;

  // Keep hover menu open when modal is open
  useEffect(() => {
    if (isModalOpen) {
      // Keep the hover menu visible when modal is open
      setIsHoveringSignIn(true);
    }
  }, [isModalOpen]);

  const handleSearch = () => {
    console.log("Searching for:", searchInput);
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
      }, 200);
    }
  };

  return (
    <div className="sticky top-0 z-50">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white py-2 md:py-3 px-4 md:px-6 shadow-lg">
        <div className="flex items-center justify-between md:justify-start w-full flex-wrap">
          {/* LOGO */}
          <div className="flex-shrink-0 text-xl md:text-2xl font-bold flex items-center md:mr-8">
            <span className="w-6 h-6 bg-white mr-2 rounded-sm"></span>
            ShopEase
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
                onChange={(e) => setSearchInput(e.target.value)}
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
              onChange={(e) => setSearchInput(e.target.value)}
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
            onMouseEnter={() => setIsHoveringCategory(true)}
            onMouseLeave={() => setIsHoveringCategory(false)}
          >
            <div className="flex items-center space-x-2 cursor-pointer group-hover:text-amber-500 transition-colors duration-200">
              <FiMenu className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">
                Categories
              </span>
              <FiChevronDown className="w-4 h-4 text-gray-600" />
            </div>
            {isHoveringCategory && (
              <div className="absolute top-8 left-0 bg-gray-50 text-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 w-48">
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex items-center space-x-2 px-4 py-3 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                  >
                    <item.icon className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* NAV LINKS */}
          <div className="flex overflow-x-auto md:overflow-visible flex-1 justify-start md:justify-center space-x-4 md:space-x-8 scrollbar-hide">
            {navItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="text-xs md:text-sm font-medium text-gray-800 hover:text-amber-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 whitespace-nowrap flex items-center px-1 py-1 relative group transition-colors duration-200"
              >
                <item.icon className="mr-1 md:mr-2 text-base md:text-lg text-gray-600" />
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-200"></span>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;