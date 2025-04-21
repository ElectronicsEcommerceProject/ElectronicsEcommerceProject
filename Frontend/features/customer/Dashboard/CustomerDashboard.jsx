import React, { useState, useEffect } from "react";
import CustomerHeader from "../../../components/Header/CustomerHeader";
import ShowAllCategory from "../../../components/ShowAllCategory/ShowAllCategory";
import CustomerProductCard from "../../../components/ProductCard/ProductCard";
import ShowAllCategoryService from "../../../components/ShowAllCategory/ShowAllCategoryService";

const CustomerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [products, setProducts] = useState([]); // State to store products

  // Fetch all products on initial render
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const allProducts = await ShowAllCategoryService.fetchAllProducts(
          token
        );
        setProducts(allProducts); // Set all products as default
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    };

    fetchAllProducts();
  }, []);

  // Cart add handler
  const handleAddToCart = (productId) => {
    console.log("Added to cart:", productId);
    setCartCount((prev) => prev + 1);
  };

  // Wishlist add handler
  const handleAddToWishlist = (productId) => {
    console.log("Added to wishlist:", productId);
    setWishlistCount((prev) => prev + 1);
  };

  // Handler for category selection
  const handleCategorySelect = (fetchedProducts) => {
    setProducts(fetchedProducts); // Update products state with fetched products
  };

  return (
    <div>
      {/* Header with cart & wishlist counts */}
      <CustomerHeader
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />

      {/* Main Content */}
      <div className="d-flex">
        {/* Sidebar */}
        <div style={{ flex: "0 0 250px", marginRight: "1rem" }}>
          <ShowAllCategory onCategorySelect={handleCategorySelect} />
        </div>

        {/* Product Cards */}
        <div style={{ flex: "1" }}>
          <CustomerProductCard
            searchQuery={searchQuery}
            products={products} // Pass products to ProductCard
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
