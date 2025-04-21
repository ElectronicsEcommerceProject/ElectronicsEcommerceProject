import React, { useState } from "react";
import CustomerHeader from "../../../components/Header/CustomerHeader";
import ShowAllCategory from "../../../components/ShowAllCategory/ShowAllCategory";
import CustomerProductCard from "../../../components/ProductCard/ProductCard";

const CustomerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0); // ✅ added

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
          <ShowAllCategory />
        </div>

        {/* Product Cards */}
        <div style={{ flex: "1" }}>
          <CustomerProductCard
            searchQuery={searchQuery}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
