import React from "react";
import { ChevronDown } from "lucide-react"; // professional dropdown icon

const FilterSidebar = ({
  categoriesData = [],
  expandedCategories,
  toggleCategory,
  selectedCategories,
  handleCategoryCheckbox,
  brandsData,
  searchBrand,
  setSearchBrand,
  displayedBrands,
  selectedBrands,
  handleBrandCheckbox,
  showMoreBrands,
  setShowMoreBrands,
  priceRanges,
  selectedPriceRange,
  handlePriceRange,
  customMinPrice,
  customMaxPrice,
  handlePriceInput,
  ratings,
  selectedRating,
  handleRating,
  discounts,
  selectedDiscounts,
  handleDiscount,
  inStockOnly,
  setInStockOnly,
  newArrivals,
  setNewArrivals,
}) => {
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
              key={brand}
              className="flex items-center mb-1 hover:bg-gray-50 p-1 rounded"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandCheckbox(brand)}
                className="mr-2"
              />
              {brand}
            </label>
          ))}
        </div>
        {brandsData.length > 10 && (
          <button
            onClick={() => setShowMoreBrands(!showMoreBrands)}
            className="text-sm text-blue-600 mt-2 hover:underline"
          >
            {showMoreBrands ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
      {/* Price */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Price</h2>
        <input
          type="range"
          min="100"
          max="20000"
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
                  Number(e.target.value) || 20000
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
        <h2 className="text-lg font-semibold mb-2">Customer Ratings</h2>
        {ratings.map((rating) => (
          <label
            key={rating}
            className="flex items-center mb-1 hover:bg-gray-50 p-1 rounded"
          >
            <input
              type="checkbox"
              checked={selectedRating === rating}
              onChange={() => handleRating(rating)}
              className="mr-2"
            />
            {rating}
          </label>
        ))}
      </div>
      {/* Discounts */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Deals & Discounts</h2>
        {discounts.map((discount) => (
          <label
            key={discount}
            className="flex items-center mb-1 hover:bg-gray-50 p-1 rounded"
          >
            <input
              type="checkbox"
              checked={selectedDiscounts.includes(discount)}
              onChange={() => handleDiscount(discount)}
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
