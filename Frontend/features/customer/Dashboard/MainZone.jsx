import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiSmartphone,
  FiMonitor,
  FiHeadphones,
  FiCamera,
  FiBriefcase,
  FiNavigation,
  FiX,
  FiFilter,
  FiHeart,
  FiTag,
  FiShield,
  FiPackage,
  FiTrendingUp,
  FiAward,
  FiBarChart,
  FiPercent,
  FiDollarSign,
  FiUsers,
  FiLayers,
  FiCheckCircle,
  FiAlertTriangle,
  FiEye,
  FiShoppingBag,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchTerm,
  setSelectedCategories,
  setSelectedBrands,
  setPriceRange,
  setCustomPrice,
  setRating,
  setInStockOnly,
  setNewArrivals,
  setSortOption,
  resetFilters,
} from "../../../components/Redux/filterSlice";
import FilterSidebar from "../../../components/ProductZone/FilterSidebar";
import ProductGrid from "../../../components/ProductZone/ProductGrid";
import SortOptions from "../../../components/ProductZone/SortOptions";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { priceRanges, ratings } from "../../../components/Data/filters";

// Enhanced products data with additional fields
const dummyProducts = [
  {
    id: 1,
    name: "Laptop Pro",
    category: "Laptops",
    categoryPath: "Electronics > Laptops",
    brand: "Apple",
    basePrice: 15000, // Original price
    finalPrice: 13500, // After discount
    discount: "10% off with CODE123",
    discountPercent: 10,
    availableOffers: ["CODE123", "FLAT500"],
    rating: 4.0,
    ratingCount: 120,
    shortDescription: "High-performance laptop with M1 chip, 16GB RAM...",
    image: "https://m.media-amazon.com/images/I/71eknZxZLmL._SL1500_.jpg",
    inStock: true,
    stockLevel: 5,
    lowStockWarning: true, // stockLevel <= 5
    hasVariants: true,
    totalVariants: 3,
    variantAttributes: ["Color: Silver", "RAM: 16GB"],
    arrival: "Launched: Jan 2025",
    popularity: 95,
    isFeatured: true,
    wishlistStatus: false, // logged‑in user hasn't wishlisted
    isInCart: false,
    recentlyViewedBadge: true,

    // Retailer-specific
    stockLevelDetailed: {
      minRetailerQty: 2,
      bulkDiscountQty: 10,
    },
    wholesalePrice: 12000,
    orderHistoryCount: 45,
  },
  {
    id: 2,
    name: "Smartphone X",
    category: "Mobile Phones",
    categoryPath: "Electronics > Mobile Phones",
    brand: "Samsung",
    basePrice: 8000,
    finalPrice: 7200,
    discount: "10% off with CODEMOBILE",
    discountPercent: 10,
    availableOffers: ["CODEMOBILE"],
    rating: 4.5,
    ratingCount: 250,
    shortDescription: 'Powerful smartphone with 6.5" display, 128GB storage...',
    image: "https://m.media-amazon.com/images/I/71DSxfKzkJL._SL1500_.jpg",
    inStock: true,
    stockLevel: 12,
    lowStockWarning: false,
    hasVariants: true,
    totalVariants: 4,
    variantAttributes: ["Color: Black", "Storage: 128GB"],
    arrival: "Launched: Mar 2025",
    popularity: 88,
    isFeatured: false,
    wishlistStatus: true,
    isInCart: true,
    recentlyViewedBadge: false,

    // Retailer-specific
    stockLevelDetailed: {
      minRetailerQty: 5,
      bulkDiscountQty: 20,
    },
    wholesalePrice: 6500,
    orderHistoryCount: 80,
  },
  {
    id: 3,
    name: "Wireless Headphones",
    category: "Audio",
    categoryPath: "Electronics > Audio > Headphones",
    brand: "Sony",
    basePrice: 5000,
    finalPrice: 4500,
    discount: "10% off with AUDIO10",
    discountPercent: 10,
    availableOffers: ["AUDIO10", "NEWUSER"],
    rating: 3.5,
    ratingCount: 89,
    shortDescription: "Premium wireless headphones with noise cancellation...",
    image: "https://m.media-amazon.com/images/I/61SUj2aKoEL._SL1500_.jpg",
    inStock: true,
    stockLevel: 25,
    lowStockWarning: false,
    hasVariants: true,
    totalVariants: 2,
    variantAttributes: ["Color: Black", "Color: White"],
    arrival: "Launched: Feb 2025",
    popularity: 75,
    isFeatured: false,
    wishlistStatus: false,
    isInCart: false,
    recentlyViewedBadge: false,

    // Retailer-specific
    stockLevelDetailed: {
      minRetailerQty: 3,
      bulkDiscountQty: 15,
    },
    wholesalePrice: 4000,
    orderHistoryCount: 32,
  },
];
const MainZone = () => {
  const [searchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  useEffect(() => {
    const categoryId = searchParams.get("category_id");
    if (categoryId) {
      alert(`Category selected with ID: ${categoryId}`);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768 && isFilterOpen) {
        setIsFilterOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isFilterOpen]);

  const dispatch = useDispatch();
  const filterState = useSelector((state) => state.filters);
  const {
    searchTerm,
    selectedCategories,
    selectedBrands,
    selectedPriceRange,
    customMinPrice,
    customMaxPrice,
    selectedRating,
    inStockOnly,
    newArrivals,
    sortOption,
  } = filterState;

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleCategoryCheckbox = (subcategory) => {
    const newSelectedCategories = selectedCategories.includes(subcategory)
      ? selectedCategories.filter((item) => item !== subcategory)
      : [...selectedCategories, subcategory];
    dispatch(setSelectedCategories(newSelectedCategories));
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setShowSuggestions(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchTerm(searchInput));
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    dispatch(setSearchTerm(""));
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion);
    dispatch(setSearchTerm(suggestion));
    setShowSuggestions(false);
  };

  const handleBrandCheckbox = (brand) => {
    const newSelectedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((item) => item !== brand)
      : [...selectedBrands, brand];
    dispatch(setSelectedBrands(newSelectedBrands));
  };

  const handlePriceRange = (range) => {
    const newRange = range === selectedPriceRange ? "" : range;
    dispatch(setPriceRange(newRange));
    if (newRange) {
      switch (newRange) {
        case "Under ₹1,000":
          dispatch(setCustomPrice({ min: 100, max: 1000 }));
          break;
        case "₹1,000 – ₹5,000":
          dispatch(setCustomPrice({ min: 1000, max: 5000 }));
          break;
        case "₹5,000 – ₹10,000":
          dispatch(setCustomPrice({ min: 5000, max: 10000 }));
          break;
        case "₹10,000 – ₹20,000":
          dispatch(setCustomPrice({ min: 10000, max: 20000 }));
          break;
        case "Over ₹20,000":
          dispatch(setCustomPrice({ min: 20000, max: 100000 }));
          break;
        default:
          break;
      }
    }
  };

  const handlePriceInput = (min, max) => {
    dispatch(setCustomPrice({ min, max }));
    const matchedRange = priceRanges.find((range) => {
      const [rangeMin, rangeMax] = range.value.split("-").map(Number);
      return min === rangeMin && max === rangeMax;
    });
    dispatch(setPriceRange(matchedRange ? matchedRange.label : ""));
  };

  const handleSliderChange = (min, max) => {
    dispatch(setCustomPrice({ min, max }));
    dispatch(setPriceRange(""));
  };

  const handleRating = (rating) => {
    dispatch(setRating(rating === selectedRating ? "" : rating));
  };

  const handleSort = (option) => {
    dispatch(setSortOption(option === sortOption ? "" : option));
  };

  const removeFilter = (filterType) => {
    switch (filterType) {
      case "search":
        dispatch(setSearchTerm(""));
        setSearchInput("");
        break;
      case "category":
        dispatch(setSelectedCategories([]));
        break;
      case "brand":
        dispatch(setSelectedBrands([]));
        break;
      case "price range":
        dispatch(setPriceRange(""));
        break;
      case "price":
        dispatch(setCustomPrice({ min: 100, max: 20000 }));
        break;
      case "rating":
        dispatch(setRating(""));
        break;
      case "stock":
        dispatch(setInStockOnly(true));
        break;
      case "arrival":
        dispatch(setNewArrivals(""));
        break;
      default:
        break;
    }
  };

  const resetAllFilters = () => {
    dispatch(resetFilters());
    setSearchInput("");
  };

  const handleProductClick = (productId) => {
    alert(`Product clicked with ID: ${productId}`);
    console.log("Product clicked:", productId);
    // navigate(`/product/${productId}`);
  };

  const handleProductHover = (productId) => {
    setHoveredProduct(productId);
  };

  const handleProductLeave = () => {
    setHoveredProduct(null);
  };

  useEffect(() => {
    const filters = [];
    if (searchTerm) filters.push({ type: "search", value: searchTerm });
    if (selectedCategories.length)
      filters.push({ type: "category", value: selectedCategories.join(", ") });
    if (selectedBrands.length)
      filters.push({ type: "brand", value: selectedBrands.join(", ") });
    if (selectedPriceRange)
      filters.push({ type: "price range", value: selectedPriceRange });
    if (customMinPrice !== 100 || customMaxPrice !== 20000) {
      filters.push({
        type: "price",
        value: `₹${customMinPrice} - ₹${customMaxPrice}`,
      });
    }
    if (selectedRating) filters.push({ type: "rating", value: selectedRating });
    if (!inStockOnly)
      filters.push({ type: "stock", value: "Include out of stock" });
    if (newArrivals) filters.push({ type: "arrival", value: newArrivals });
    setAppliedFilters(filters);
  }, [filterState]);

  useEffect(() => {
    if (searchInput.trim() === "") {
      setSearchSuggestions([]);
      return;
    }
    const suggestions = [
      ...new Set([
        ...dummyProducts
          .filter((product) =>
            product.name.toLowerCase().includes(searchInput.toLowerCase())
          )
          .map((product) => product.name),
        ...dummyProducts
          .filter((product) =>
            product.category.toLowerCase().includes(searchInput.toLowerCase())
          )
          .map((product) => product.category),
        ...dummyProducts
          .filter((product) =>
            product.brand.toLowerCase().includes(searchInput.toLowerCase())
          )
          .map((product) => product.brand),
        ...dummyProducts
          .filter((product) =>
            product.shortDescription
              .toLowerCase()
              .includes(searchInput.toLowerCase())
          )
          .map((product) => product.shortDescription),
      ]),
    ].slice(0, 5);
    setSearchSuggestions(suggestions);
  }, [searchInput]);

  const filteredProducts = dummyProducts
    .filter((product) => {
      const searchMatch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const categoryMatch =
        !selectedCategories.length ||
        selectedCategories.some((cat) =>
          product.category.toLowerCase().includes(cat.toLowerCase())
        );
      const brandMatch =
        !selectedBrands.length ||
        selectedBrands.some((brand) =>
          product.brand.toLowerCase().includes(brand.toLowerCase())
        );
      const priceMatch =
        (product.basePrice || product.finalPrice) >= customMinPrice &&
        (product.basePrice || product.finalPrice) <= customMaxPrice;
      const ratingMatch =
        !selectedRating || product.rating >= parseInt(selectedRating);
      const stockMatch = !inStockOnly || product.inStock;
      const arrivalMatch =
        !newArrivals ||
        product.arrival.toLowerCase().includes(newArrivals.toLowerCase());
      return (
        searchMatch &&
        categoryMatch &&
        brandMatch &&
        priceMatch &&
        ratingMatch &&
        stockMatch &&
        arrivalMatch
      );
    })
    .sort((a, b) => {
      if (sortOption === "popularity") return b.popularity - a.popularity;
      if (sortOption === "low-to-high")
        return (a.finalPrice || a.basePrice) - (b.finalPrice || b.basePrice);
      if (sortOption === "high-to-low")
        return (b.finalPrice || b.basePrice) - (a.finalPrice || a.basePrice);
      if (sortOption === "rating") return b.rating - a.rating;
      if (sortOption === "newest") return b.arrival.localeCompare(a.arrival);
      return 0;
    });

  // Debug log to verify filteredProducts data
  console.log("Filtered Products:", filteredProducts);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      {appliedFilters.length > 0 && (
        <div className="bg-white py-2 px-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Filters:</span>
            {appliedFilters.map((filter, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <span className="font-medium">{filter.type}:</span>
                <span className="mx-1">{filter.value}</span>
                <button
                  onClick={() => removeFilter(filter.type)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={resetAllFilters}
              className="ml-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
      {windowWidth < 768 && (
        <div className="sticky top-16 z-10 bg-white p-2 shadow-sm flex justify-between items-center">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <FiFilter size={16} />
            <span>Filters</span>
          </button>
          {filteredProducts.length > 0 && (
            <SortOptions
              sortOption={sortOption}
              handleSort={handleSort}
              mobileView={true}
            />
          )}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-4 mt-4 px-4">
        {(windowWidth >= 768 || isFilterOpen) && (
          <div
            className={`${
              windowWidth < 768
                ? "fixed inset-0 z-20 bg-white overflow-y-auto p-4"
                : "w-64 flex-shrink-0"
            }`}
          >
            {windowWidth < 768 && (
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
            )}
            <FilterSidebar
              expandedCategories={expandedCategories}
              toggleCategory={toggleCategory}
              selectedCategories={selectedCategories}
              handleCategoryCheckbox={handleCategoryCheckbox}
              selectedBrands={selectedBrands}
              handleBrandCheckbox={handleBrandCheckbox}
              priceRanges={priceRanges}
              selectedPriceRange={selectedPriceRange}
              handlePriceRange={handlePriceRange}
              customMinPrice={customMinPrice}
              customMaxPrice={customMaxPrice}
              handlePriceInput={handlePriceInput}
              handleSliderChange={handleSliderChange}
              ratings={ratings}
              selectedRating={selectedRating}
              handleRating={handleRating}
              inStockOnly={inStockOnly}
              setInStockOnly={(value) => dispatch(setInStockOnly(value))}
              newArrivals={newArrivals}
              setNewArrivals={(value) => dispatch(setNewArrivals(value))}
              resetAllFilters={resetAllFilters}
              mobileView={windowWidth < 768}
            />
            {windowWidth < 768 && (
              <div className="sticky bottom-0 bg-white py-4 border-t border-gray-200">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            )}
          </div>
        )}
        {isFilterOpen && windowWidth < 768 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setIsFilterOpen(false)}
          />
        )}
        <div
          className={`bg-white p-4 shadow-lg rounded-lg ${
            windowWidth < 768 ? "w-full" : "flex-1"
          }`}
        >
          {windowWidth >= 768 && filteredProducts.length > 0 && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Products ({filteredProducts.length})
              </h2>
              <SortOptions sortOption={sortOption} handleSort={handleSort} />
            </div>
          )}
          {windowWidth < 768 && (
            <h2 className="text-lg font-semibold mb-4">
              {filteredProducts.length} Products
            </h2>
          )}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg mb-4">
                No products match the selected filters.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 border-b">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {product.isFeatured && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <FiAward size={10} />⭐ Top Pick
                          </span>
                        )}
                        {product.recentlyViewedBadge && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <FiEye size={10} />
                            Recently Viewed
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-1 rounded-full bg-white shadow hover:bg-gray-100 transition-colors"
                        title={
                          product.wishlistStatus ||
                          wishlist.includes(product.id)
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                        }
                      >
                        <FiHeart
                          size={18}
                          color={
                            product.wishlistStatus ||
                            wishlist.includes(product.id)
                              ? "red"
                              : "gray"
                          }
                          fill={
                            product.wishlistStatus ||
                            wishlist.includes(product.id)
                              ? "red"
                              : "none"
                          }
                        />
                      </button>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">
                        {product.categoryPath}
                      </span>
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-contain p-4 bg-gray-50"
                    />
                    {product.discountPercent > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <FiPercent size={10} />
                        {product.discountPercent}% OFF
                      </div>
                    )}
                    {product.lowStockWarning && (
                      <div className="absolute bottom-2 left-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded flex items-center">
                        <FiAlertTriangle className="mr-1" size={12} />
                        🔥 Only {product.stockLevel} left!
                      </div>
                    )}
                    {product.isInCart && (
                      <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <FiShoppingBag size={10} />✓ Added to Cart
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-4 space-y-3">
                    {/* Brand and Name */}
                    <div>
                      <h3 className="text-sm text-indigo-600 font-medium mb-1">
                        {product.brand}
                      </h3>
                      <h2 className="font-semibold text-gray-800 text-base leading-tight">
                        {product.name}
                      </h2>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {product.shortDescription}
                    </p>

                    {/* Rating and Reviews */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => {
                              const starValue = i + 1;
                              const rating = product.rating;

                              if (rating >= starValue) {
                                // Full star
                                return (
                                  <span
                                    key={i}
                                    className="text-yellow-500 text-sm"
                                  >
                                    ★
                                  </span>
                                );
                              } else if (rating >= starValue - 0.5) {
                                // Half star
                                return (
                                  <span
                                    key={i}
                                    className="text-yellow-500 text-sm relative"
                                  >
                                    <span className="text-gray-300">★</span>
                                    <span className="absolute left-0 top-0 overflow-hidden w-1/2 text-yellow-500">
                                      ★
                                    </span>
                                  </span>
                                );
                              } else {
                                // Empty star
                                return (
                                  <span
                                    key={i}
                                    className="text-gray-300 text-sm"
                                  >
                                    ★
                                  </span>
                                );
                              }
                            })}
                          </div>
                          <span className="text-sm font-medium">
                            {product.rating}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          ({product.ratingCount} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-orange-600">
                        <FiTrendingUp size={12} />
                        🔥 {product.popularity}% customers love this
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-green-700">
                            ₹{product.finalPrice || product.basePrice}
                          </span>
                          {product.finalPrice &&
                            product.basePrice &&
                            product.finalPrice < product.basePrice && (
                              <span className="text-gray-500 line-through text-sm">
                                ₹{product.basePrice}
                              </span>
                            )}
                        </div>
                        <div className="text-xs text-gray-600">
                          <FiDollarSign size={10} className="inline mr-1" />
                          💰 Bulk Price: ₹{product.wholesalePrice}
                        </div>
                      </div>
                      {product.discount && (
                        <div className="flex items-center text-xs text-green-600 mb-2">
                          <FiTag size={12} className="mr-1" />
                          💸 {product.discount}
                        </div>
                      )}
                      {product.availableOffers &&
                        product.availableOffers.length > 0 && (
                          <div className="text-xs text-blue-600">
                            <span className="font-medium">
                              🎁 Extra Savings:{" "}
                            </span>
                            {product.availableOffers.join(", ")}
                          </div>
                        )}
                    </div>

                    {/* Availability Information */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FiPackage size={14} className="text-green-600" />
                          <span className="text-sm font-semibold text-green-800">
                            📦 {product.stockLevel} Units Available
                          </span>
                          {product.inStock ? (
                            <FiCheckCircle
                              className="text-green-600"
                              size={14}
                            />
                          ) : (
                            <FiAlertTriangle
                              className="text-red-500"
                              size={14}
                            />
                          )}
                        </div>
                        {product.lowStockWarning && (
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
                            🔥 Low Stock!
                          </span>
                        )}
                      </div>

                      {/* Stock Status Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Stock Level</span>
                          <span>
                            {product.inStock
                              ? "✅ In Stock"
                              : "❌ Out of Stock"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              product.stockLevel > 10
                                ? "bg-green-500"
                                : product.stockLevel > 5
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                (product.stockLevel / 20) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {product.hasVariants && (
                        <div className="mb-2">
                          <div className="text-xs text-purple-600 font-medium mb-1">
                            <FiLayers size={10} className="inline mr-1" />�
                            Available Options ({product.totalVariants})
                          </div>
                          {product.variantAttributes &&
                            product.variantAttributes.length > 0 && (
                              <div className="text-xs text-gray-600">
                                {product.variantAttributes.join(" • ")}
                              </div>
                            )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-blue-50 p-2 rounded text-center">
                          <div className="font-medium text-blue-800">
                            📦 Min Order
                          </div>
                          <div className="text-blue-600">
                            {product.stockLevelDetailed.minRetailerQty} units
                          </div>
                        </div>
                        <div className="bg-purple-50 p-2 rounded text-center">
                          <div className="font-medium text-purple-800">
                            💰 Bulk Discount
                          </div>
                          <div className="text-purple-600">
                            {product.stockLevelDetailed.bulkDiscountQty}+ units
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Stats */}
                    <div className="bg-yellow-50 p-3 rounded-lg space-y-2">
                      <div className="text-xs font-medium text-yellow-800 mb-2">
                        📊 Product Stats
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div className="text-gray-600">
                          <FiUsers size={10} className="inline mr-1" />
                          🛒 {product.orderHistoryCount} sold
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleProductClick(product.id)}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      🛍️ View Product Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainZone;
