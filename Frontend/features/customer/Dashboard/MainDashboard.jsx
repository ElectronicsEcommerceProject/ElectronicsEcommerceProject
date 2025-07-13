import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FiUser,
  FiShoppingBag,
  FiStar,
  FiShield,
  FiPackage,
  FiSearch,
} from "react-icons/fi";

// Lazy Image Component
const LazyImage = ({ src, alt, className, ...props }) => {
  const [imageSrc, setImageSrc] = useState("");
  const [imageRef, setImageRef] = useState();

  useEffect(() => {
    let observer;
    if (imageRef && imageSrc !== src) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setImageSrc(src);
                observer.unobserve(imageRef);
              }
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(imageRef);
      } else {
        // Fallback for browsers without IntersectionObserver
        setImageSrc(src);
      }
    }
    return () => {
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, imageSrc, src]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={className}
      {...props}
      loading="lazy"
    />
  );
};

import { Footer, Header } from "../../../components/index.js";
import { setSearchTerm } from "../../../components/index.js";
import {
  isAuthenticated,
  userDashboardDataRoute,
  getApi,
  userBannerRoute,
} from "../../../src/index.js";
import logo from "../../../../Frontend/assets/logo.jpg";

const MainDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.filters.searchTerm);
  const [activeBanner, setActiveBanner] = useState(0);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Fetch products function
  const fetchProducts = useCallback(
    async (page = 1, append = false, searchQuery = "", brandFilter = null) => {
      if (isAuthenticated()) {
        try {
          if (!append) setLoading(true);
          else setLoadingMore(true);

          // Build query parameters
          const params = new URLSearchParams({
            page: page.toString(),
            limit: "9",
          });

          if (searchQuery) params.append("search", searchQuery);
          if (brandFilter) params.append("brand", brandFilter);

          const response = await getApi(`${userDashboardDataRoute}?${params}`);
          if (response.success) {
            if (append) {
              setProducts((prev) => [...prev, ...response.data]);
            } else {
              setProducts(response.data);
            }
            setPagination(response.pagination);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    []
  );

  // Check authentication status and fetch data
  useEffect(() => {
    const checkAuth = () => {
      setIsUserAuthenticated(isAuthenticated());
    };

    const fetchBanners = async () => {
      try {
        const response = await getApi(userBannerRoute);
        if (response.success) {
          setBanners(response.data.filter((banner) => banner.is_active));
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    checkAuth();
    fetchProducts(1, false, searchTerm, selectedBrand);
    fetchBanners();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth();
      fetchProducts(1, false, searchTerm, selectedBrand);
    };

    window.addEventListener("tokenChanged", handleAuthChange);

    return () => {
      window.removeEventListener("tokenChanged", handleAuthChange);
    };
  }, [searchTerm, selectedBrand]);

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setActiveBanner((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  // Touch handlers for swipe functionality
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }
    if (isRightSwipe) {
      setActiveBanner((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  // Mouse handlers for desktop scrolling
  const handleMouseDown = (e) => {
    setTouchStart(e.clientX);
  };

  const handleMouseUp = (e) => {
    if (!touchStart) return;
    const distance = touchStart - e.clientX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }
    if (isRightSwipe) {
      setActiveBanner((prev) => (prev - 1 + banners.length) % banners.length);
    }
    setTouchStart(null);
  };

  const uniqueBrands = [...new Set(products.map((product) => product.brand))];

  const loadMoreProducts = () => {
    if (pagination.currentPage < pagination.totalPages) {
      fetchProducts(
        pagination.currentPage + 1,
        true,
        searchTerm,
        selectedBrand
      );
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Function to highlight matching text
  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 text-yellow-900 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isUserAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <LazyImage
                  src={logo}
                  alt="MAA LAXMI STORE Logo"
                  className="w-full h-full object-cover rounded-full shadow-lg border-4 border-white"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent"></div>
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

      <div
        className="relative h-[50vh] sm:h-[55vh] md:h-[500px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.banner_id}
            className={`absolute inset-0 ${
              banner.bg_class
            } text-white transition-all duration-1000 flex items-center px-4 sm:px-8 lg:px-16 ${
              activeBanner === index
                ? "opacity-100 z-10 scale-100"
                : "opacity-0 z-0 scale-105"
            }`}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between relative z-10">
              <div className="md:w-1/2 text-center md:text-left mb-4 md:mb-0">
                <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {banner.discount}
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 leading-tight">
                  {banner.title}
                </h1>
                <p className="text-sm sm:text-base lg:text-lg opacity-90 mb-4 max-w-lg mx-auto md:mx-0 leading-relaxed">
                  {banner.description}
                </p>
                <div className="text-xl sm:text-2xl lg:text-4xl font-bold mb-4">
                  {banner.price}
                </div>
                <button className="bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full transition-all font-semibold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                  {banner.button_text} →
                </button>
              </div>
              <div className="md:w-1/2 flex justify-center mt-4 md:mt-0">
                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
                  <div className="absolute inset-0 bg-white/10 rounded-3xl blur-3xl"></div>
                  <LazyImage
                    src={banner.image_url}
                    alt={banner.title}
                    className="relative w-full h-32 sm:h-48 md:h-80 object-cover rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Navigation arrows */}
        {banners.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
              onClick={() =>
                setActiveBanner(
                  (prev) => (prev - 1 + banners.length) % banners.length
                )
              }
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
              onClick={() =>
                setActiveBanner((prev) => (prev + 1) % banners.length)
              }
            >
              <svg
                className="w-6 h-6"
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
            </button>
          </>
        )}

        {/* Dots indicator */}
        {banners.length > 1 && (
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
        )}

        {/* Swipe instruction for mobile */}
        <div className="absolute top-4 right-4 z-20 bg-black/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs sm:hidden">
          👈 Swipe to navigate
        </div>
      </div>

      <div className="h-4 bg-gray-100 flex items-center justify-center">
        <div className="w-full border-t border-gray-200 mx-4 md:mx-6"></div>
      </div>

      <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {searchTerm && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-center text-blue-700">
                <FiSearch className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  Searching for: "{searchTerm}"
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6">
            <button
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold transition-all transform hover:scale-105 text-sm sm:text-base ${
                selectedBrand === null
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-blue-600 hover:bg-blue-50 shadow-md"
              }`}
              onClick={() => {
                setSelectedBrand(null);
                setProducts([]);
                fetchProducts(1, false, searchTerm, null);
              }}
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
                onClick={() => {
                  setSelectedBrand(brand);
                  setProducts([]);
                  fetchProducts(1, false, searchTerm, brand);
                }}
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
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  {selectedBrand ? (
                    <FiSearch className="w-12 h-12 text-gray-500" />
                  ) : (
                    <FiPackage className="w-12 h-12 text-gray-500" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {searchTerm && selectedBrand
                    ? `No products found for "${searchTerm}" in ${selectedBrand}`
                    : searchTerm
                    ? `No products found for "${searchTerm}"`
                    : selectedBrand
                    ? `No products found for "${selectedBrand}"`
                    : "No products available"}
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {searchTerm
                    ? "Try adjusting your search terms or browse our categories to find what you're looking for."
                    : selectedBrand
                    ? "We couldn't find any products for this brand. Try selecting a different brand or check back later."
                    : "We're currently updating our inventory. Please check back soon for amazing products and deals!"}
                </p>
                {(selectedBrand || searchTerm) && (
                  <button
                    onClick={() => {
                      setSelectedBrand(null);
                      if (searchTerm) {
                        dispatch(setSearchTerm(""));
                      }
                    }}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-full transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {searchTerm ? "Clear Search" : "View All Products"}
                  </button>
                )}
                <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <LazyImage
                        src={logo}
                        alt="Store"
                        className="w-6 h-6 mr-2 rounded-full object-cover"
                      />
                      <span>MAA LAXMI STORE</span>
                    </div>
                    <div className="flex items-center">
                      <FiShoppingBag className="w-5 h-5 mr-2 text-blue-500" />
                      <span>Quality Products</span>
                    </div>
                    <div className="flex items-center">
                      <FiStar className="w-5 h-5 mr-2 text-yellow-500" />
                      <span>Best Prices</span>
                    </div>
                    <div className="flex items-center">
                      <FiShield className="w-5 h-5 mr-2 text-green-500" />
                      <span>Secure Shopping</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {products.map((product, index) => (
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
                    <LazyImage
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-2 flex-grow">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {searchTerm
                        ? highlightText(product.name, searchTerm)
                        : product.name}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {searchTerm
                        ? highlightText(product.description, searchTerm)
                        : product.description}
                    </p>
                    <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                      {searchTerm
                        ? highlightText(product.brand, searchTerm)
                        : product.brand}
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
                        {product.originalPrice &&
                          product.originalPrice !== product.price && (
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
          {!loading && pagination.currentPage < pagination.totalPages && (
            <div className="text-center mt-8">
              <button
                onClick={loadMoreProducts}
                disabled={loadingMore}
                className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  `Load More (${
                    pagination.totalItems - products.length
                  } remaining)`
                )}
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
