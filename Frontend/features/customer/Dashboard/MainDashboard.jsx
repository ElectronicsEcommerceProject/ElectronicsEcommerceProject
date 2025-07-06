import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiShoppingBag, FiStar, FiShield } from "react-icons/fi";

import { Footer, Header } from "../../../components/index.js";
import {
  isAuthenticated,
  userDashboardDataRoute,
  getApi,
} from "../../../src/index.js";

const MainDashboard = () => {
  const navigate = useNavigate();
  const [activeBanner, setActiveBanner] = useState(0);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(4);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check authentication status and fetch products
  useEffect(() => {
    const checkAuth = () => {
      setIsUserAuthenticated(isAuthenticated());
    };

    const fetchProducts = async () => {
      if (isAuthenticated()) {
        try {
          setLoading(true);
          const response = await getApi(userDashboardDataRoute);
          if (response.success) {
            setProducts(response.data);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    checkAuth();
    fetchProducts();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth();
      fetchProducts();
    };

    window.addEventListener("tokenChanged", handleAuthChange);

    return () => {
      window.removeEventListener("tokenChanged", handleAuthChange);
    };
  }, []);

  const banners = [
    {
      title: "🎧 Premium Headphones",
      description:
        "Experience crystal-clear sound with our premium collection of headphones from top brands.",
      price: "Starting ₹1,999",
      discount: "Up to 40% OFF",
      bgClass: "bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700",
      buttonText: "Shop Now",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center",
    },
    {
      title: "⚡ Fast Charging Solutions",
      description:
        "Power up your devices with our range of high-speed chargers and wireless charging pads.",
      price: "Starting ₹1,199",
      discount: "Up to 35% OFF",
      bgClass: "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700",
      buttonText: "Explore Now",
      image:
        "https://images.unsplash.com/photo-1609592806596-4d3b0c3b7e3e?w=400&h=300&fit=crop&crop=center",
    },
    {
      title: "🔊 Wireless Speakers",
      description:
        "Fill your space with rich, immersive sound from our premium speaker collection.",
      price: "Starting ₹2,999",
      discount: "Up to 50% OFF",
      bgClass: "bg-gradient-to-br from-orange-500 via-red-600 to-pink-700",
      buttonText: "Listen Now",
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop&crop=center",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = selectedBrand
    ? products.filter((product) => product.brand === selectedBrand)
    : products;

  const uniqueBrands = [...new Set(products.map((product) => product.brand))];

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 4);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

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

      <div className="relative h-[60vh] md:h-[500px] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 ${
              banner.bgClass
            } text-white transition-all duration-1000 flex items-center px-4 sm:px-8 lg:px-16 ${
              activeBanner === index
                ? "opacity-100 z-10 scale-100"
                : "opacity-0 z-0 scale-105"
            }`}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between relative z-10">
              <div className="md:w-1/2 text-center md:text-left mb-6 md:mb-0">
                <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {banner.discount}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  {banner.title}
                </h1>
                <p className="text-base sm:text-lg opacity-90 mb-6 max-w-lg mx-auto md:mx-0 leading-relaxed">
                  {banner.description}
                </p>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
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
                    className="relative h-48 sm:h-64 md:h-80 w-auto object-contain rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105"
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
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                activeBanner === index
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => setActiveBanner(index)}
            />
          ))}
        </div>
      </div>

      <div className="h-4 bg-gray-100 flex items-center justify-center">
        <div className="w-full border-t border-gray-200 mx-4 md:mx-6"></div>
      </div>

      <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6">
            <button
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold transition-all transform hover:scale-105 text-sm sm:text-base ${
                selectedBrand === null
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-blue-600 hover:bg-blue-50 shadow-md"
              }`}
              onClick={() => setSelectedBrand(null)}
            >
              All Brands
            </button>
            {uniqueBrands.map((brand) => (
              <button
                key={brand}
                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold transition-all transform hover:scale-105 text-sm sm:text-base ${
                  selectedBrand === brand
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-blue-600 hover:bg-blue-50 shadow-md"
                }`}
                onClick={() => setSelectedBrand(brand)}
              >
                {brand}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredProducts
                .slice(0, visibleProducts)
                .map((product, index) => (
                  <div
                    key={product.product_id || index}
                    className="w-full p-3 sm:p-4 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group cursor-pointer flex flex-col"
                    onClick={() => handleProductClick(product.product_id)}
                  >
                    <div className="relative h-36 sm:h-40 md:h-44 mb-3 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                      {product.discount && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                          -{product.discount}
                        </div>
                      )}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-2 flex-grow">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                        {product.brand}
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < Math.floor(product.rating) ? "★" : "☆"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({product.rating})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-base sm:text-lg font-bold text-green-600">
                            {product.price}
                          </div>
                          {product.originalPrice && product.originalPrice !== product.price && (
                            <div className="text-xs sm:text-sm text-gray-500 line-through">
                              {product.originalPrice}
                            </div>
                          )}
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock === "out-of-stock"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {product.stock === "out-of-stock"
                            ? "Out of Stock"
                            : "In Stock"}
                        </div>
                      </div>
                    </div>
                    {product.features && (
                      <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-100">
                        {product.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
          {!loading && visibleProducts < filteredProducts.length && (
            <div className="text-center mt-8">
              <button
                onClick={loadMoreProducts}
                className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MainDashboard;
