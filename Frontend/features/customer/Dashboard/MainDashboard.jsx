import React, { useState, useEffect } from "react";
import { FiUser, FiShoppingBag, FiStar, FiShield } from "react-icons/fi";

import { Footer, Header } from "../../../components/index.js";
import { isAuthenticated } from "../../../src/index.js";

const MainDashboard = () => {
  const [activeBanner, setActiveBanner] = useState(0);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [chargerCurrentIndex, setChargerCurrentIndex] = useState(0);
  const [selectedChargerBrand, setSelectedChargerBrand] = useState(null);
  const itemsPerPage = 6;

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      setIsUserAuthenticated(isAuthenticated());
    };

    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("tokenChanged", handleAuthChange);

    return () => {
      window.removeEventListener("tokenChanged", handleAuthChange);
    };
  }, []);

  const banners = [
    {
      title: "🎧 Premium Headphones",
      description: "Experience crystal-clear sound with our premium collection of headphones from top brands.",
      price: "Starting ₹1,999",
      discount: "Up to 40% OFF",
      bgClass: "bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700",
      buttonText: "Shop Now",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center",
    },
    {
      title: "⚡ Fast Charging Solutions",
      description: "Power up your devices with our range of high-speed chargers and wireless charging pads.",
      price: "Starting ₹1,199",
      discount: "Up to 35% OFF",
      bgClass: "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700",
      buttonText: "Explore Now",
      image: "https://images.unsplash.com/photo-1609592806596-4d3b0c3b7e3e?w=400&h=300&fit=crop&crop=center",
    },
    {
      title: "🔊 Wireless Speakers",
      description: "Fill your space with rich, immersive sound from our premium speaker collection.",
      price: "Starting ₹2,999",
      discount: "Up to 50% OFF",
      bgClass: "bg-gradient-to-br from-orange-500 via-red-600 to-pink-700",
      buttonText: "Listen Now",
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop&crop=center",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const allProducts = [
    {
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&crop=center",
      title: "Boat Rockerz 400",
      price: "₹1,999",
      originalPrice: "₹2,499",
      stock: "in-stock",
      brand: "Boat",
      rating: 4.3,
      discount: "20%",
      features: ["Bluetooth 5.0", "40H Playback"],
    },
    {
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200&h=200&fit=crop&crop=center",
      title: "Boat Immortal 100",
      price: "₹2,999",
      originalPrice: "₹3,499",
      stock: "in-stock",
      brand: "Boat",
      rating: 4.5,
      discount: "14%",
      features: ["Gaming Mode", "Beast Mode"],
    },
    {
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop&crop=center",
      title: "Mivi DuoPods A350",
      price: "₹1,799",
      originalPrice: "₹2,199",
      stock: "in-stock",
      brand: "Mivi",
      rating: 4.2,
      discount: "18%",
      features: ["True Wireless", "Touch Control"],
    },
    {
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop&crop=center",
      title: "Mivi Collar Flash",
      price: "₹1,499",
      originalPrice: "₹1,999",
      stock: "in-stock",
      brand: "Mivi",
      rating: 4.4,
      discount: "25%",
      features: ["Neckband", "Fast Charge"],
    },
    {
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&h=200&fit=crop&crop=center",
      title: "Boat Nirvana Ion",
      price: "₹3,999",
      originalPrice: "₹4,499",
      stock: "upcoming",
      brand: "Boat",
      rating: 4.6,
      discount: "11%",
      features: ["ANC", "Spatial Audio"],
    },
    {
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=200&h=200&fit=crop&crop=center",
      title: "Mivi Play",
      price: "₹1,299",
      originalPrice: "₹1,699",
      stock: "in-stock",
      brand: "Mivi",
      rating: 4.1,
      discount: "24%",
      features: ["Compact", "HD Sound"],
    },
    {
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=200&h=200&fit=crop&crop=center",
      title: "Boat Airdopes 131",
      price: "₹1,499",
      originalPrice: "₹1,999",
      stock: "in-stock",
      brand: "Boat",
      rating: 4.3,
      discount: "25%",
      features: ["IPX4", "Voice Assistant"],
    },
    {
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop&crop=center",
      title: "Mivi Thunder",
      price: "₹2,499",
      originalPrice: "₹2,999",
      stock: "in-stock",
      brand: "Mivi",
      rating: 4.5,
      discount: "17%",
      features: ["Wireless", "Deep Bass"],
    },
  ];

  const allChargers = [
    {
      image: "https://images.unsplash.com/photo-1609592806596-4d3b0c3b7e3e?w=200&h=200&fit=crop&crop=center",
      title: "Anker PowerPort III 20W",
      price: "₹1,299",
      originalPrice: "₹1,599",
      stock: "in-stock",
      brand: "Anker",
      rating: 4.6,
      discount: "19%",
      features: ["USB-C PD", "Compact Design"],
    },
    {
      image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=200&h=200&fit=crop&crop=center",
      title: "Anker PowerCore 10000",
      price: "₹2,499",
      originalPrice: "₹2,999",
      stock: "in-stock",
      brand: "Anker",
      rating: 4.7,
      discount: "17%",
      features: ["10000mAh", "PowerIQ"],
    },
    {
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center",
      title: "Belkin BoostCharge 25W",
      price: "₹1,799",
      originalPrice: "₹2,199",
      stock: "in-stock",
      brand: "Belkin",
      rating: 4.4,
      discount: "18%",
      features: ["Fast Charge", "Universal"],
    },
    {
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=200&fit=crop&crop=center",
      title: "Belkin Wireless Pad 15W",
      price: "₹2,299",
      originalPrice: "₹2,799",
      stock: "in-stock",
      brand: "Belkin",
      rating: 4.3,
      discount: "18%",
      features: ["Qi Wireless", "LED Indicator"],
    },
    {
      image: "https://images.unsplash.com/photo-1621768216002-5ac171876625?w=200&h=200&fit=crop&crop=center",
      title: "Anker PowerWave Stand",
      price: "₹1,999",
      originalPrice: "₹2,499",
      stock: "in-stock",
      brand: "Anker",
      rating: 4.5,
      discount: "20%",
      features: ["Stand Design", "Case Friendly"],
    },
    {
      image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=200&h=200&fit=crop&crop=center",
      title: "Belkin Car Charger 36W",
      price: "₹1,199",
      originalPrice: "₹1,499",
      stock: "in-stock",
      brand: "Belkin",
      rating: 4.2,
      discount: "20%",
      features: ["Dual Port", "Car Compatible"],
    },
  ];

  const filteredProducts = selectedBrand
    ? allProducts.filter((product) => product.brand === selectedBrand)
    : allProducts;

  const filteredChargers = selectedChargerBrand
    ? allChargers.filter((charger) => charger.brand === selectedChargerBrand)
    : allChargers;

  const nextPage = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + itemsPerPage, filteredProducts.length - itemsPerPage)
    );
  };

  const prevPage = () => {
    setCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const nextChargerPage = () => {
    setChargerCurrentIndex((prev) =>
      Math.min(prev + itemsPerPage, filteredChargers.length - itemsPerPage)
    );
  };

  const prevChargerPage = () => {
    setChargerCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  // If user is not authenticated, show login prompt
  if (!isUserAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col font-sans">
        <Header />

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiUser className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Welcome to MAA LAXMI STORE
              </h2>

              <p className="text-gray-600 mb-8 leading-relaxed">
                Please login first to explore our amazing collection of products
                and enjoy exclusive deals!
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <FiShoppingBag className="w-5 h-5 mr-3 text-blue-500" />
                  <span>Access thousands of products</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiStar className="w-5 h-5 mr-3 text-yellow-500" />
                  <span>Exclusive member discounts</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiShield className="w-5 h-5 mr-3 text-green-500" />
                  <span>Secure shopping experience</span>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Click on "Sign In" in the header to get started
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <div className="relative h-80 sm:h-96 md:h-[500px] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 ${
              banner.bgClass
            } text-white transition-all duration-1000 flex items-center px-4 md:px-8 lg:px-16 ${
              activeBanner === index ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
            }`}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center relative z-10">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {banner.discount}
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  {banner.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 max-w-lg leading-relaxed">
                  {banner.description}
                </p>
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
                  {banner.price}
                </div>
                <button className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-3 sm:px-8 sm:py-4 rounded-full transition-all font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                  {banner.buttonText} →
                </button>
              </div>
              <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 rounded-3xl blur-3xl"></div>
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-auto object-cover rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeBanner === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => setActiveBanner(index)}
            />
          ))}
        </div>
      </div>

      <div className="h-4 bg-gray-100 flex items-center justify-center">
        <div className="w-full border-t border-gray-200 mx-4 md:mx-6"></div>
      </div>

      <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 px-4 md:px-6 py-8">
        <div className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              🎧 Premium Headphones
            </h2>
            <p className="text-gray-600 text-lg">Discover amazing sound quality with top brands</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <button
              className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                selectedBrand === null
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-blue-600 hover:bg-blue-50 shadow-md"
              }`}
              onClick={() => setSelectedBrand(null)}
            >
              All Brands
            </button>
            <button
              className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                selectedBrand === "Boat"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-blue-600 hover:bg-blue-50 shadow-md"
              }`}
              onClick={() => setSelectedBrand("Boat")}
            >
              🚤 Boat
            </button>
            <button
              className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                selectedBrand === "Mivi"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-blue-600 hover:bg-blue-50 shadow-md"
              }`}
              onClick={() => setSelectedBrand("Mivi")}
            >
              🎵 Mivi
            </button>
          </div>
          <div className="flex items-center gap-4 px-2 py-4">
            {currentIndex > 0 && (
              <button
                className="bg-gray-200 text-gray-800 px-3 py-2 rounded-full hover:bg-gray-300 transition-all"
                onClick={prevPage}
              >
                &lt;
              </button>
            )}
            <div className="flex gap-4 overflow-hidden flex-1">
              {filteredProducts
                .slice(currentIndex, currentIndex + itemsPerPage)
                .map((product, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-52 sm:w-56 p-4 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group cursor-pointer"
                  >
                    <div className="relative h-40 sm:h-44 mb-3 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                      {product.discount && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                          -{product.discount}
                        </div>
                      )}
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.title}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(product.rating) ? "★" : "☆"}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({product.rating})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-green-600">
                            {product.price}
                          </div>
                          {product.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              {product.originalPrice}
                            </div>
                          )}
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock === "upcoming"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {product.stock === "upcoming" ? "Coming Soon" : "In Stock"}
                        </div>
                      </div>
                      {product.features && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {product.features.map((feature, idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            {currentIndex + itemsPerPage < filteredProducts.length && (
              <button
                className="bg-gray-200 text-gray-800 px-3 py-2 rounded-full hover:bg-gray-300 transition-all"
                onClick={nextPage}
              >
                &gt;
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="h-4 bg-gray-100 flex items-center justify-center">
        <div className="w-full border-t border-gray-200 mx-4 md:mx-6"></div>
      </div>

      <div className="w-full bg-gradient-to-br from-purple-50 to-pink-50 px-4 md:px-6 py-8">
        <div className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              ⚡ Fast Charging Solutions
            </h2>
            <p className="text-gray-600 text-lg">Power up your devices with premium chargers</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <button
              className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                selectedChargerBrand === null
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white text-purple-600 hover:bg-purple-50 shadow-md"
              }`}
              onClick={() => setSelectedChargerBrand(null)}
            >
              All Brands
            </button>
            <button
              className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                selectedChargerBrand === "Anker"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white text-purple-600 hover:bg-purple-50 shadow-md"
              }`}
              onClick={() => setSelectedChargerBrand("Anker")}
            >
              🔋 Anker
            </button>
            <button
              className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                selectedChargerBrand === "Belkin"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white text-purple-600 hover:bg-purple-50 shadow-md"
              }`}
              onClick={() => setSelectedChargerBrand("Belkin")}
            >
              ⚡ Belkin
            </button>
          </div>
          <div className="flex items-center gap-4 px-2 py-4">
            {chargerCurrentIndex > 0 && (
              <button
                className="bg-gray-200 text-gray-800 px-3 py-2 rounded-full hover:bg-gray-300 transition-all"
                onClick={prevChargerPage}
              >
                &lt;
              </button>
            )}
            <div className="flex gap-4 overflow-hidden flex-1">
              {filteredChargers
                .slice(chargerCurrentIndex, chargerCurrentIndex + itemsPerPage)
                .map((charger, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-52 sm:w-56 p-4 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 group cursor-pointer"
                  >
                    <div className="relative h-40 sm:h-44 mb-3 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                      {charger.discount && (
                        <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                          -{charger.discount}
                        </div>
                      )}
                      <img
                        src={charger.image}
                        alt={charger.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {charger.title}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(charger.rating) ? "★" : "☆"}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({charger.rating})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-green-600">
                            {charger.price}
                          </div>
                          {charger.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              {charger.originalPrice}
                            </div>
                          )}
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            charger.stock === "upcoming"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {charger.stock === "upcoming" ? "Coming Soon" : "In Stock"}
                        </div>
                      </div>
                      {charger.features && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {charger.features.map((feature, idx) => (
                            <span key={idx} className="bg-purple-50 text-purple-600 px-2 py-1 rounded-full text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            {chargerCurrentIndex + itemsPerPage < filteredChargers.length && (
              <button
                className="bg-gray-200 text-gray-800 px-3 py-2 rounded-full hover:bg-gray-300 transition-all"
                onClick={nextChargerPage}
              >
                &gt;
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MainDashboard;
