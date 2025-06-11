
import React, { useState, useEffect } from "react";
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
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchTerm,
  setSelectedCategories,
  setSelectedBrands,
  setPriceRange,
  setCustomPrice,
  setRating,
  setDiscounts,
  setInStockOnly,
  setNewArrivals,
  setSortOption,
  resetFilters,
} from "../../../components/Redux/filterSlice";
import FilterSidebar from "../../../components/ProductZone/FilterSidebar";
import ProductGrid from "../../../components/ProductZone/ProductGrid";
import SortOptions from "../../../components/ProductZone/SortOptions";
import categoriesData from "../../../components/Data/categories";
import { brandsData } from "../../../components/Data/brands";
import { dummyProducts } from "../../../components/Data/products";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { priceRanges, ratings, discounts } from "../../../components/Data/filters";

const MainZone = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchBrand, setSearchBrand] = useState("");
  const [showMoreBrands, setShowMoreBrands] = useState(false);
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
    selectedDiscounts,
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

  const filteredBrands = brandsData.filter((brand) =>
    brand.toLowerCase().includes(searchBrand.toLowerCase())
  );
  const displayedBrands = showMoreBrands
    ? filteredBrands
    : filteredBrands.slice(0, 10);

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

  const handleDiscount = (discount) => {
    const newSelectedDiscounts = selectedDiscounts.includes(discount)
      ? selectedDiscounts.filter((item) => item !== discount)
      : [...selectedDiscounts, discount];
    dispatch(setDiscounts(newSelectedDiscounts));
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
      case "discount":
        dispatch(setDiscounts([]));
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
    if (selectedDiscounts.length)
      filters.push({ type: "discount", value: selectedDiscounts.join(", ") });
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
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

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
        product.price >= customMinPrice && product.price <= customMaxPrice;

      const ratingMatch =
        !selectedRating ||
        Math.floor(product.rating) >= parseInt(selectedRating);

      const discountMatch =
        !selectedDiscounts.length ||
        selectedDiscounts.some((discount) => {
          if (discount === "All Discounts") return product.discountPercent > 0;
          if (discount === "Today's Deals") return product.isDealOfTheDay;
          return product.discount === discount;
        });

      const stockMatch = !inStockOnly || product.inStock;

      const arrivalMatch =
        !newArrivals ||
        (newArrivals === "Last 30 days" && product.isNewArrival) ||
        (newArrivals === "Last 7 days" && product.isNewRelease);

      return (
        searchMatch &&
        categoryMatch &&
        brandMatch &&
        priceMatch &&
        ratingMatch &&
        discountMatch &&
        stockMatch &&
        arrivalMatch
      );
    })
    .sort((a, b) => {
      if (sortOption === "popularity") return b.popularity - a.popularity;
      if (sortOption === "low-to-high") return a.price - b.price;
      if (sortOption === "high-to-low") return b.price - a.price;
      if (sortOption === "discount")
        return b.discountPercent - a.discountPercent;
      if (sortOption === "rating") return b.rating - a.rating;
      if (sortOption === "newest")
        return new Date(b.releaseDate) - new Date(a.releaseDate);
      return 0;
    });

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
              categoriesData={categoriesData}
              expandedCategories={expandedCategories}
              toggleCategory={toggleCategory}
              selectedCategories={selectedCategories}
              handleCategoryCheckbox={handleCategoryCheckbox}
              brandsData={brandsData}
              searchBrand={searchBrand}
              setSearchBrand={setSearchBrand}
              displayedBrands={displayedBrands}
              selectedBrands={selectedBrands}
              handleBrandCheckbox={handleBrandCheckbox}
              showMoreBrands={showMoreBrands}
              setShowMoreBrands={setShowMoreBrands}
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
              discounts={discounts}
              selectedDiscounts={selectedDiscounts}
              handleDiscount={handleDiscount}
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
            <ProductGrid
              products={filteredProducts}
              mobileView={windowWidth < 768}
              onProductClick={handleProductClick}
              onProductHover={handleProductHover}
              onProductLeave={handleProductLeave}
              hoveredProduct={hoveredProduct}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainZone;