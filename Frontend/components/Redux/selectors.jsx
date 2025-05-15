// This selector function filters and sorts the products based on the global filter state
export const selectFilteredProducts = (products, filters) => {
  const {
    searchTerm, selectedCategories, selectedBrands,
    customMinPrice, customMaxPrice, selectedRating,
    selectedDiscounts, inStockOnly, newArrivals, sortOption
  } = filters;

  // Filtering products based on the conditions provided
  return products
    .filter(product => {
      // Search match for name, category, brand, rating, or discount
      const searchMatch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.rating.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.discount.toLowerCase().includes(searchTerm.toLowerCase());

      // Category match (checks if the product's category is in selected categories)
      const categoryMatch =
        !selectedCategories.length || selectedCategories.includes(product.category);

      // Brand match (checks if the product's brand is in selected brands)
      const brandMatch =
        !selectedBrands.length || selectedBrands.includes(product.brand);

      // Price range match (checks if the product's price is within the selected range)
      const priceMatch =
        product.price >= customMinPrice && product.price <= customMaxPrice;

      // Rating match (checks if the product's rating matches the selected rating)
      const ratingMatch =
        !selectedRating || product.rating.includes(selectedRating.replace(" & Up", ""));

      // Discount match (checks if the product's discount is in the selected discounts)
      const discountMatch =
        !selectedDiscounts.length ||
        selectedDiscounts.includes(product.discount) ||
        selectedDiscounts.includes("All Discounts") ||
        selectedDiscounts.includes("Today's Deals");

      // In stock match (checks if the product is in stock)
      const stockMatch = !inStockOnly || product.inStock;

      // New arrival match (checks if the product is new or not)
      const arrivalMatch = !newArrivals || product.arrival === newArrivals;

      return (
        searchMatch && categoryMatch && brandMatch &&
        priceMatch && ratingMatch && discountMatch &&
        stockMatch && arrivalMatch
      );
    })
    // Sorting logic based on selected sorting option
    .sort((a, b) => {
      if (sortOption === "popularity") return b.popularity - a.popularity;
      if (sortOption === "low-to-high") return a.price - b.price;
      if (sortOption === "high-to-low") return b.price - a.price;
      if (sortOption === "discount") return b.discountPercent - a.discountPercent;
      return 0;
    });
};
