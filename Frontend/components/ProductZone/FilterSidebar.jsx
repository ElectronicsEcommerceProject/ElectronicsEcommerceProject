import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react"; // professional dropdown icon
import {
  getApi,
  getAllBrandsRoute,
  getApiById,
  getBrandsByCategoryRoute,
} from "../../src/index.js";

const FilterSidebar = ({
  categoriesData = [],
  expandedCategories,
  toggleCategory,
  selectedCategories,
  handleCategoryCheckbox,
  selectedBrands,
  handleBrandCheckbox,
  priceRanges,
  selectedPriceRange,
  handlePriceRange,
  customMinPrice,
  customMaxPrice,
  handlePriceInput,
  ratings,
  selectedRating,
  handleRating,
  selectedDiscounts,
  handleDiscount,
  inStockOnly,
  setInStockOnly,
  newArrivals,
  setNewArrivals,
  categoryId, // New prop for category ID
}) => {
  // Internal state for brand filtering
  const [searchBrand, setSearchBrand] = useState("");
  const [showMoreBrands, setShowMoreBrands] = useState(false);

  // State for brands from API
  const [brands, setBrands] = useState([]); // Now stores array of { id, name }
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [brandsError, setBrandsError] = useState(null);

  // Hardcoded discounts data
  const hardcodedDiscounts = [
    "10% Off",
    "20% Off",
    "30% Off",
    "50% Off",
    "Buy 1 Get 1 Free",
    "Flash Sale",
    "Today's Deal",
    "Clearance Sale",
    "Special Offer",
  ];

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setBrandsLoading(true);
        setBrandsError(null);

        let response;

        // If categoryId is provided, fetch brands for that category
        if (categoryId) {
          console.log("🔥 Fetching brands for category ID:", categoryId);
          response = await getApiById(getBrandsByCategoryRoute, categoryId);
          console.log("🔥 Brands by category response:", response);
        } else {
          // Otherwise, fetch all brands
          console.log("🔥 Fetching all brands");
          response = await getApi(getAllBrandsRoute);
          console.log("🔥 All brands response:", response);
        }

        if (response.success && response.data) {
          // Store full brand objects (id and name)
          setBrands(response.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrandsError(error.message || "Failed to fetch brands");

        // Fallback to hardcoded data if API fails
        const fallbackBrands = [
          { id: 1, name: "Apple" },
          { id: 2, name: "Samsung" },
          { id: 3, name: "Sony" },
          { id: 4, name: "LG" },
          { id: 5, name: "Dell" },
          { id: 6, name: "HP" },
          { id: 7, name: "Lenovo" },
          { id: 8, name: "Asus" },
          { id: 9, name: "Acer" },
          { id: 10, name: "Microsoft" },
          { id: 11, name: "Google" },
          { id: 12, name: "OnePlus" },
          { id: 13, name: "Xiaomi" },
          { id: 14, name: "Huawei" },
          { id: 15, name: "Canon" },
          { id: 16, name: "Nikon" },
          { id: 17, name: "JBL" },
          { id: 18, name: "Bose" },
          { id: 19, name: "Sennheiser" },
          { id: 20, name: "Logitech" },
        ];
        setBrands(fallbackBrands);
      } finally {
        setBrandsLoading(false);
      }
    };

    fetchBrands();
  }, [categoryId]); // Add categoryId as dependency

  // Filter brands based on search
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchBrand.toLowerCase())
  );
  const displayedBrands = showMoreBrands
    ? filteredBrands
    : filteredBrands.slice(0, 10);

  // Handler to show alert with brand id and call parent handler
  const handleBrandClick = (brand) => {
    // Pass both brand name and brand ID to parent handler
    handleBrandCheckbox(brand.name, brand.brand_id);
  };

  return (
    <div className="w-full sm:w-56 md:w-64 bg-white p-4 shadow-lg overflow-y-auto custom-scrollbar sm:mr-4 max-h-screen mr-4">
      {" "}
      {/* Added mr-4 here to create space */}
      {/* Categories */}
      {categoriesData && categoriesData.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Categories</h2>
          {categoriesData.map((category) => (
            <div key={category.name} className="mb-2">
              <div
                className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-1 rounded"
                onClick={() => toggleCategory(category.name)}
              >
                <span className="font-medium">{category.name}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    expandedCategories[category.name] ? "rotate-180" : ""
                  }`}
                />
              </div>
              {expandedCategories[category.name] && (
                <div className="ml-4 mt-2">
                  {category.subcategories.map((sub) => (
                    <label
                      key={sub}
                      className="flex items-center mb-1 hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(sub)}
                        onChange={() => handleCategoryCheckbox(sub)}
                        className="mr-2"
                      />
                      {sub}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Brands */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Brands</h2>
        {brandsLoading ? (
          <div className="text-center py-4">
            <span className="text-sm text-gray-500">Loading brands...</span>
          </div>
        ) : brandsError ? (
          <div className="text-center py-4">
            <span className="text-sm text-red-500">Failed to load brands</span>
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="Search brands..."
              value={searchBrand}
              onChange={(e) => setSearchBrand(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
            />
            <div className="max-h-40 overflow-y-auto custom-scrollbar">
              {displayedBrands.map((brand) => (
                <label
                  key={brand.id || brand.name}
                  className="flex items-center mb-1 hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.name)}
                    onChange={() => handleBrandClick(brand)}
                    className="mr-2"
                  />
                  {brand.name}
                </label>
              ))}
            </div>
            {brands.length > 10 && (
              <button
                onClick={() => setShowMoreBrands(!showMoreBrands)}
                className="text-sm text-blue-600 mt-2 hover:underline"
              >
                {showMoreBrands ? "Show Less" : "Show More"}
              </button>
            )}
          </>
        )}
      </div>
      {/* Price */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Price</h2>
        <input
          type="range"
          min="100"
          max="100000"
          value={customMaxPrice}
          onChange={(e) =>
            handlePriceInput(customMinPrice, Number(e.target.value))
          }
          className="w-full"
        />
        <div className="flex justify-between mt-2 gap-2">
          <div className="flex flex-col">
            <label className="text-sm">Min</label>
            <input
              type="number"
              placeholder="Min ₹"
              value={customMinPrice}
              onChange={(e) =>
                handlePriceInput(Number(e.target.value) || 100, customMaxPrice)
              }
              className="w-20 p-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm">Max</label>
            <input
              type="number"
              placeholder="Max ₹"
              value={customMaxPrice}
              onChange={(e) =>
                handlePriceInput(
                  customMinPrice,
                  Number(e.target.value) || 100000
                )
              }
              className="w-20 p-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
        <div className="mt-2">
          {priceRanges.map((range) => (
            <label
              key={range}
              className="flex items-center mb-1 hover:bg-gray-50 p-1 rounded"
            >
              <input
                type="checkbox"
                checked={selectedPriceRange === range}
                onChange={() => handlePriceRange(range)}
                className="mr-2"
              />
              {range}
            </label>
          ))}
        </div>
      </div>
      {/* Ratings */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 flex items-center">
          <span>Customer Ratings</span>
          {selectedRating && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </h2>
        {ratings.map((rating) => (
          <label
            key={rating}
            className={`flex items-center mb-2 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors duration-200 ${
              selectedRating === rating
                ? "bg-blue-50 border border-blue-200"
                : "border border-transparent"
            }`}
          >
            <input
              type="radio"
              name="rating"
              checked={selectedRating === rating}
              onChange={() => handleRating(rating)}
              className="mr-3 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">
                {rating}
              </span>
              {selectedRating === rating && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Selected
                </span>
              )}
            </div>
          </label>
        ))}
        {selectedRating && (
          <button
            onClick={() => handleRating("")}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
          >
            Clear Rating Filter
          </button>
        )}
      </div>
      {/* Discounts */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Deals & Discounts</h2>
        {hardcodedDiscounts.map((discount) => (
          <label
            key={discount}
            className="flex items-center mb-1 hover:bg-gray-50 p-1 rounded"
          >
            <input
              type="checkbox"
              checked={
                selectedDiscounts && selectedDiscounts.includes(discount)
              }
              onChange={() => handleDiscount && handleDiscount(discount)}
              className="mr-2"
            />
            {discount}
          </label>
        ))}
      </div>
      {/* Availability */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Availability</h2>
        <label className="flex items-center mb-1 hover:bg-gray-50 p-1 rounded">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setInStockOnly(!inStockOnly)}
            className="mr-2"
          />
          In Stock Only
        </label>
      </div>
      {/* New Arrivals */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">New Arrivals</h2>
        <label className="flex items-center mb-1 hover:bg-gray-50 p-1 rounded">
          <input
            type="checkbox"
            checked={newArrivals === "Last 30 Days"}
            onChange={() =>
              setNewArrivals(
                newArrivals === "Last 30 Days" ? "" : "Last 30 Days"
              )
            }
            className="mr-2"
          />
          Last 30 Days
        </label>
        <label className="flex items-center mb-1 hover:bg-gray-50 p-1 rounded">
          <input
            type="checkbox"
            checked={newArrivals === "Last 90 Days"}
            onChange={() =>
              setNewArrivals(
                newArrivals === "Last 90 Days" ? "" : "Last 90 Days"
              )
            }
            className="mr-2"
          />
          Last 90 Days
        </label>
      </div>
    </div>
  );
};

export default FilterSidebar;
