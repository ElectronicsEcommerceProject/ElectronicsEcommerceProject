import React, { useState } from "react";
import {
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiSmartphone,
  FiMonitor,
  FiHeadphones,
  FiCamera,
  FiBriefcase,
  FiNavigation,
  FiChevronDown,
} from "react-icons/fi";

const navItems = [
  { icon: FiSmartphone, label: "Mobiles" },
  { icon: FiMonitor, label: "Electronics" },
  { icon: FiHeadphones, label: "Audio" },
  { icon: FiCamera, label: "Cameras" },
  { icon: FiBriefcase, label: "Travel" },
  { icon: FiNavigation, label: "Navigation" },
];

const Header = () => {
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions] = useState([
    "iPhone",
    "Samsung",
    "Camera",
    "Headphones",
  ]);
  const [isHoveringLogin, setIsHoveringLogin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHoveringCategory, setIsHoveringCategory] = useState(false);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search:", searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput("");
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion);
    setShowSuggestions(false);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white py-4 px-6 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto">
          {/* Top Row: Logo, Search, Mobile Actions */}
          <div className="flex items-center justify-between">
            {/* Logo - Left */}
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-indigo-700 font-bold text-lg">
                S
              </span>
              <span className="text-2xl font-extrabold tracking-tight">ShopEase</span>
            </div>

            {/* Desktop Search - Center */}
            <div className="hidden lg:flex flex-1 justify-center px-8">
              <div className="relative w-full max-w-lg">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <FiSearch className="text-lg" />
                  </button>
                  <input
                    type="text"
                    placeholder="Search for products, brands, and more..."
                    value={searchInput}
                    onChange={handleSearchChange}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full pr-14 pl-10 py-2 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"
                  />
                </form>

                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-14 left-0 right-0 bg-white text-gray-800 rounded-lg shadow-lg z-50 border border-gray-200">
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 flex items-center"
                        onMouseDown={() => handleSuggestionClick(suggestion)}
                      >
                        <FiSearch className="mr-2 text-gray-500 w-5 h-5" />
                        <span className="text-sm font-medium">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Actions - Right */}
            <div className="flex lg:hidden items-center space-x-4">
              <button
                className="w-6 h-6 hover:text-amber-500 transition-colors duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (Below Logo) */}
          <div className="lg:hidden mt-4">
            <div className="relative w-full">
              <form onSubmit={handleSearchSubmit} className="relative">
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <FiSearch className="text-lg" />
                </button>
                <input
                  type="text"
                  placeholder="Search for products, brands, and more..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full pr-14 pl-10 py-2 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"
                />
              </form>

              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-14 left-0 right-0 bg-white text-gray-800 rounded-lg shadow-lg z-50 border border-gray-200">
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 flex items-center"
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                    >
                      <FiSearch className="mr-2 text-gray-500 w-5 h-5" />
                      <span className="text-sm font-medium">{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: Categories, Navigation, Sign In/Cart */}
          <div className="flex items-center justify-between mt-4">
            {/* Categories - Left */}
            <div
              className="relative group hidden lg:block"
              onMouseEnter={() => setIsHoveringCategory(true)}
              onMouseLeave={() => setIsHoveringCategory(false)}
            >
              <div className="flex items-center space-x-2 cursor-pointer group-hover:text-amber-500 transition-colors duration-200">
                <FiMenu className="w-5 h-5" />
                <span className="text-sm font-medium">Categories</span>
                <FiChevronDown className="w-4 h-4" />
              </div>
              {isHoveringCategory && (
                <div className="absolute top-8 left-0 bg-white text-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 w-48">
                  {navItems.map((item, index) => (
                    <a
                      key={index}
                      href="#"
                      className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-100 hover:text-amber-500 transition-colors duration-150"
                    >
                      <item.icon className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Links - Center */}
            <div className="hidden lg:flex space-x-6 mx-auto">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center space-x-2 text-sm font-medium text-white hover:text-amber-500 relative group transition-colors duration-200"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-200"></span>
                </a>
              ))}
            </div>

            {/* Sign In/Cart - Right */}
            <div className="hidden lg:flex items-center space-x-6 ml-auto">
              <div
                className="relative group"
                onMouseEnter={() => setIsHoveringLogin(true)}
                onMouseLeave={() => setIsHoveringLogin(false)}
              >
                <div className="flex items-center space-x-2 cursor-pointer group-hover:text-amber-500 transition-colors duration-200">
                  <FiUser className="w-5 h-5" />
                  <span className="text-sm font-medium">Sign In</span>
                </div>
                {isHoveringLogin && (
                  <div className="absolute top-8 right-0 bg-white text-gray-800 p-4 rounded-lg shadow-lg w-56 z-50 border border-gray-200">
                    <p className="font-semibold text-sm">Welcome</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Access your account and manage orders
                    </p>
                    <button className="w-full mt-3 bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200">
                      Login / Signup
                    </button>
                  </div>
                )}
              </div>

              <a href="#" className="flex items-center space-x-2 relative group">
                <FiShoppingCart className="w-5 h-5 group-hover:text-amber-500 transition-colors duration-200" />
                <span className="text-sm font-medium group-hover:text-amber-500 transition-colors duration-200">
                  Cart
                </span>
                <span className="absolute -top-2 -right-6 bg-amber-500 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;