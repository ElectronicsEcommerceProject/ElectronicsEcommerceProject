import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaMobileAlt,
  FaDesktop,
  FaHeadphones,
  FaCamera,
  FaBriefcase,
  FaMapMarkerAlt,
  FaBars,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import HoverMenu from "../../common/HoverMenu";
import { useDispatch } from "react-redux";
import { setSearchTerm } from "../../../components/Redux/filterSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "../../../components/Footer/Footer";

const MainDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHoveringLogin, setIsHoveringLogin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = 3; // 🔧 Hardcoded for now (replace with dynamic count later)

  const banners = [
    {
      title: "iPhone 15 Pro Max Titanium",
      description:
        "The ultimate iPhone experience with groundbreaking camera technology.",
      price: "From ₹1,59,900",
      bgClass: "bg-gradient-to-r from-slate-800 to-indigo-900",
      buttonText: "Buy Now",
      image: "https://m.media-amazon.com/images/I/81Os1SDWpcL._SX679_.jpg",
    },
    {
      title: "MacBook Air M2",
      description: "Supercharged by the M2 chip with stunning Retina display.",
      price: "From ₹1,09,900",
      bgClass: "bg-gradient-to-r from-cyan-700 to-blue-900",
      buttonText: "Explore Now",
      image: "https://m.media-amazon.com/images/I/71TPda7cwUL._SX679_.jpg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Keep hover menu open when modal is open
  useEffect(() => {
    if (isModalOpen) {
      // Keep the hover menu visible when modal is open
      setIsHoveringLogin(true);
    }
  }, [isModalOpen]);

  const navItems = [
    { icon: FaMobileAlt, label: "Mobiles" },
    { icon: FaDesktop, label: "Electronics" },
    { icon: FaHeadphones, label: "Audio" },
    { icon: FaCamera, label: "Cameras" },
    { icon: FaBriefcase, label: "Travel" },
    { icon: FaMapMarkerAlt, label: "Navigation" },
  ];

  const mobiles = [
    {
      image:
        "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UF1000,1000_QL80_.jpg",
      title: "Samsung Galaxy S23 Ultra",
      price: "₹1,24,999",
      originalPrice: "₹1,39,999",
      discount: "10% off",
    },
    {
      image:
        "https://m.media-amazon.com/images/I/71GeAcdy+1L._AC_UF1000,1000_QL80_.jpg",
      title: "OnePlus 11 Pro 5G",
      price: "₹66,999",
      discount: "Free shipping",
    },
    {
      image:
        "https://m.media-amazon.com/images/I/61cwywLZR-L._AC_UF1000,1000_QL80_.jpg",
      title: "iPhone 14 (128GB)",
      price: "₹66,900",
      originalPrice: "₹79,900",
      discount: "Limited deal",
    },
    {
      image:
        "https://m.media-amazon.com/images/I/71V--WZVUIL._AC_UF1000,1000_QL80_.jpg",
      title: "Google Pixel 7 Pro",
      price: "₹74,999",
      discount: "No Cost EMI",
    },
    {
      image:
        "https://m.media-amazon.com/images/I/71MBv6uXZVL._AC_UF1000,1000_QL80_.jpg",
      title: "Vivo X90 Pro",
      price: "₹84,999",
      originalPrice: "₹89,990",
      discount: "Extra ₹5,000 off",
    },
    {
      image:
        "https://m.media-amazon.com/images/I/61cwywLZR-L._AC_UF1000,1000_QL80_.jpg",
      title: "iPhone 14 Plus",
      price: "₹76,900",
      originalPrice: "₹89,900",
      discount: "Special offer",
    },
    {
      image:
        "https://m.media-amazon.com/images/I/71GeAcdy+1L._AC_UF1000,1000_QL80_.jpg",
      title: "Xiaomi 13 Pro",
      price: "₹79,999",
      discount: "New launch",
    },
  ];

  const laptops = [
    {
      image:
        "https://m.media-amazon.com/images/I/61L5QgPvgxL._AC_UF1000,1000_QL80_.jpg",
      title: "MacBook Air M2",
      price: "₹1,09,900",
      discount: "Free shipping",
    },
    {
      image:
        "https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UF1000,1000_QL80_.jpg",
      title: "Dell XPS 13",
      price: "₹1,29,990",
      originalPrice: "₹1,49,990",
      discount: "Limited deal",
    },
    {
      image:
        "https://m.media-amazon.com/images/I/71eknZxZLmL._AC_UF1000,1000_QL80_.jpg",
      title: "HP Spectre x360",
      price: "₹1,49,990",
      discount: "No Cost EMI",
    },
    {
      image:
        "https://m.media-amazon.com/images/I/71ZotJ4tq9L._AC_UF1000,1000_QL80_.jpg",
      title: "Asus ROG Zephyrus",
      price: "₹1,39,990",
      originalPrice: "₹1,59,990",
      discount: "Extra ₹10,000 off",
    },
    {
      image:
        "https://m.media-amazon.com/images/I/71vwVHf0g0L._AC_UF1000,1000_QL80_.jpg",
      title: "Lenovo Yoga 9i",
      price: "₹1,59,990",
      discount: "Bank offers",
    },
    {
      image:
        "https://m.media-amazon.com/images/I/61L5QgPvgxL._AC_UF1000,1000_QL80_.jpg",
      title: "MacBook Pro M2",
      price: "₹1,49,900",
      discount: "New arrival",
    },
    {
      image:
        "https://m.media-amazon.com/images/I/71TPda7cwUL._AC_UF1000,1000_QL80_.jpg",
      title: "Acer Predator Helios",
      price: "₹1,19,990",
      discount: "Gaming special",
    },
  ];

  const handleSearch = () => {
    dispatch(setSearchTerm(searchInput));
    navigate("/mainzone");
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
          setIsHoveringLogin(false);
        }
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white py-2 md:py-3 px-4 md:px-6 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between md:justify-start">
          <div className="text-xl md:text-2xl font-bold flex items-center md:mr-8">
            <span className="w-6 h-6 bg-white mr-2 rounded-sm"></span>
            ShopEase
          </div>

          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-full max-w-2xl">
              <FaSearch
                onClick={handleSearch}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg cursor-pointer hover:text-indigo-600 hover:scale-110 transition duration-200"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40 shadow-sm text-sm"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 ml-auto">
            <div
              className="relative group"
              onMouseEnter={() => setIsHoveringLogin(true)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center cursor-pointer px-3 py-2">
                <FaUser className="w-5 h-5 mr-1" />
                <span className="text-sm">Sign In</span>
              </div>
              <AnimatePresence>
                {isHoveringLogin && (
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
            <Link
              to="/cart"
              className="relative flex items-center px-3 py-2 rounded-md hover:bg-indigo-800 transition-colors"
            >
              <FaShoppingCart className="w-6 h-6 text-white" />
              <span className="ml-1 text-white hidden md:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="flex md:hidden items-center ml-auto">
            <button
              className="text-white text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FaBars />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-2 bg-indigo-700 px-4 pb-4 rounded-b shadow-lg">
            <div className="flex flex-col space-y-4 pt-2">
              <div className="flex items-center cursor-pointer">
                <FaUser className="w-5 h-5 mr-2" />
                <span>Login</span>
              </div>
              <a href="#" className="flex items-center relative">
                <FaShoppingCart className="w-5 h-5 mr-2" />
                <span>Cart</span>
                <span className="ml-auto bg-amber-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  3
                </span>
              </a>
            </div>
          </div>
        )}

        <div className="md:hidden w-full flex justify-center mt-4">
          <div className="relative w-10/12 max-w-sm">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search for products, brands and more..."
              className="w-full pl-10 pr-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40 shadow-sm text-base"
            />
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm py-2 md:py-3 sticky top-16 md:top-12 z-40">
        <div className="flex justify-center overflow-x-auto scrollbar-hide px-2">
          <div className="flex space-x-4 md:space-x-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="text-xs md:text-sm font-medium text-gray-700 hover:text-indigo-600 whitespace-nowrap flex items-center px-1 py-1"
              >
                <item.icon className="mr-1 md:mr-2 text-base md:text-lg" />
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 ${banner.bgClass} text-white transition-opacity duration-1000 flex items-center px-4 md:px-8 lg:px-16 ${
              activeBanner === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-4 md:mb-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">
                  {banner.title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg opacity-90 mb-3 md:mb-6 max-w-lg">
                  {banner.description}
                </p>
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-6">
                  {banner.price}
                </div>
                <button className="bg-white text-indigo-700 hover:bg-gray-100 px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full transition-all font-medium text-sm sm:text-base md:text-lg">
                  {banner.buttonText}
                </button>
              </div>
              <div className="md:w-1/2 flex justify-center mt-4 md:mt-0">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="h-32 sm:h-40 md:h-64 lg:h-80 object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-4 bg-gray-100 flex items-center justify-center">
        <div className="w-full border-t border-gray-200 mx-4 md:mx-6"></div>
      </div>

      <div className="w-full bg-white px-2 md:px-4">
        <div className="w-full py-4">
          <h2 className="text-lg md:text-xl font-bold mb-3 px-2 text-gray-800">
            Featured Mobiles
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 md:gap-4 px-2">
            {mobiles.map((mobile, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full p-2 hover:shadow-md rounded-lg transition-all"
              >
                <div className="h-28 sm:h-32 md:h-40 mb-2 flex items-center justify-center bg-gray-50 rounded-lg">
                  <img
                    src={mobile.image}
                    alt={mobile.title}
                    className="h-full object-contain"
                  />
                </div>
                <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-800 mb-1 line-clamp-2">
                  {mobile.title}
                </h3>
                <div className="text-sm md:text-base text-green-600 font-bold">
                  {mobile.price}
                </div>
                {mobile.originalPrice && (
                  <div className="text-xs text-gray-500 line-through">
                    {mobile.originalPrice}
                  </div>
                )}
                <div className="text-xs text-amber-600">{mobile.discount}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-4 bg-gray-100 flex items-center justify-center">
          <div className="w-full border-t border-gray-200 mx-4 md:mx-6"></div>
        </div>

        <div className="w-full py-4">
          <h2 className="text-lg md:text-xl font-bold mb-3 px-2 text-gray-800">
            Top Laptops
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 md:gap-4 px-2">
            {laptops.map((laptop, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full p-2 hover:shadow-md rounded-lg transition-all"
              >
                <div className="h-28 sm:h-32 md:h-40 mb-2 flex items-center justify-center bg-gray-50 rounded-lg">
                  <img
                    src={laptop.image}
                    alt={laptop.title}
                    className="h-full object-contain"
                  />
                </div>
                <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-800 mb-1 line-clamp-2">
                  {laptop.title}
                </h3>
                <div className="text-sm md:text-base text-green-600 font-bold">
                  {laptop.price}
                </div>
                {laptop.originalPrice && (
                  <div className="text-xs text-gray-500 line-through">
                    {laptop.originalPrice}
                  </div>
                )}
                <div className="text-xs text-amber-600">{laptop.discount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MainDashboard;