import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomerHeader from "../../../shared/Header/CustomerHeader";
import ShowAllCategory from "../../../shared/ShowAllCategory/ShowAllCategory";
import CustomerProductCard from "../../../shared/ProductCard/ProductCard";
// import ShowAllCategoryService from "../../../shared/ShowAllCategory/ShowAllCategoryService";
import fetchAllProductsService from "../../../shared/ProductCard/ProductCardService";

import {
  setProducts,
  addToCart,
  addToWishlist,
} from "../../../../redux/ProductSlice";
import AlertService from "../../../shared/Alert/AlertService";

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const {
    products = [],
    cartCount = 0,
    wishlistCount = 0,
  } = useSelector((state) => state.product);

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all products on initial render
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage.");
          return;
        }

        const allProducts = await fetchAllProductsService.getAllProducts(token);
        if (Array.isArray(allProducts)) {
          dispatch(setProducts(allProducts)); // Dispatch action to set products
        } else {
          console.error("Invalid products data received:", allProducts);
        }
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    };

    fetchAllProducts();
  }, [dispatch]);

  // Cart add handler
  const handleAddToCart = (productId) => {
    if (!productId) {
      console.error("Invalid product ID for adding to cart.");
      return;
    }
    console.log("Added to cart:", productId);
    AlertService.showSuccess("Product added to cart");
    dispatch(addToCart(1));
  };

  // Wishlist add handler
  const handleAddToWishlist = (productId) => {
    if (!productId) {
      console.error("Invalid product ID for adding to wishlist.");
      return;
    }
    console.log("Added to wishlist:", productId);
    AlertService.showSuccess("Product added to wishlist");
    dispatch(addToWishlist(1));
  };

  // Handler for category selection
  const handleCategorySelect = (fetchedProducts) => {
    if (!Array.isArray(fetchedProducts)) {
      console.error("Invalid category products data:", fetchedProducts);
      return;
    }
    dispatch(setProducts(fetchedProducts)); // Update products state with fetched products
  };

  return (
    <div>
      {/* Header with cart & wishlist counts */}
      <CustomerHeader
        setSearchQuery={setSearchQuery} // Pass setSearchQuery to update search query
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
            products={products} // Pass products from Redux state
            searchQuery={searchQuery} // Pass search query to filter products
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
