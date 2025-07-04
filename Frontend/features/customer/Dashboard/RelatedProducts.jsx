import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getApi, userProductsByCategoryId } from "../../../src/index.js";

const RelatedProducts = ({ isVisible = true }) => {
  const navigate = useNavigate();

  // Related products pagination state
  const [relatedProductsPage, setRelatedProductsPage] = useState(1);
  const [loadingMoreProducts, setLoadingMoreProducts] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  // Initialize related products on component mount
  useEffect(() => {
    const initialProducts = [
      {
        id: 1,
        title: "Wireless Bluetooth Headphones",
        price: "₹2,999",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      },
      {
        id: 2,
        title: "Smart Watch Series 8",
        price: "₹15,999",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      },
      {
        id: 3,
        title: "Wireless Charging Pad",
        price: "₹1,499",
        image:
          "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop",
      },
      {
        id: 4,
        title: "USB-C Fast Charger",
        price: "₹899",
        image:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
      },
      {
        id: 5,
        title: "Bluetooth Speaker",
        price: "₹3,499",
        image:
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
      },
      {
        id: 6,
        title: "Phone Case Premium",
        price: "₹599",
        image:
          "https://images.unsplash.com/photo-1601593346740-925612772716?w=300&h=300&fit=crop",
      },
    ];
    setDisplayedProducts(initialProducts);
  }, []);

  // Load more products function
  const loadMoreProducts = async () => {
    setLoadingMoreProducts(true);

    try {
      // Simulate API call - replace with actual backend call
      // const response = await getApiById(relatedProductsRoute, productId, { page: relatedProductsPage + 1, limit: 6 });

      // Mock additional products for demonstration
      const additionalProducts = [
        {
          id: 7 + (relatedProductsPage - 1) * 6,
          title: "Gaming Mouse RGB",
          price: "₹1,299",
          image:
            "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop",
        },
        {
          id: 8 + (relatedProductsPage - 1) * 6,
          title: "Mechanical Keyboard",
          price: "₹4,999",
          image:
            "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
        },
        {
          id: 9 + (relatedProductsPage - 1) * 6,
          title: "Webcam HD 1080p",
          price: "₹2,499",
          image:
            "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300&h=300&fit=crop",
        },
        {
          id: 10 + (relatedProductsPage - 1) * 6,
          title: "USB Hub 4-Port",
          price: "₹799",
          image:
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
        },
        {
          id: 11 + (relatedProductsPage - 1) * 6,
          title: "Laptop Stand Adjustable",
          price: "₹1,899",
          image:
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
        },
        {
          id: 12 + (relatedProductsPage - 1) * 6,
          title: "Power Bank 20000mAh",
          price: "₹1,999",
          image:
            "https://images.unsplash.com/photo-1609592806596-4d8b5b5c5b5c?w=300&h=300&fit=crop",
        },
      ];

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDisplayedProducts((prev) => [...prev, ...additionalProducts]);
      setRelatedProductsPage((prev) => prev + 1);

      // Set hasMoreProducts to false after 3 pages (18 products total)
      if (relatedProductsPage >= 2) {
        setHasMoreProducts(false);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoadingMoreProducts(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="max-w-7xl mx-auto px-2 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 md:mb-6">
        Related Products
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        {displayedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <div className="aspect-square flex items-center justify-center p-3 sm:p-4">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="p-3 sm:p-4">
              <h4 className="text-xs sm:text-sm lg:text-base font-medium line-clamp-2">
                {product.title}
              </h4>
              <p className="text-sm sm:text-base lg:text-lg font-semibold mt-2">
                {product.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreProducts && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMoreProducts}
            disabled={loadingMoreProducts}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              loadingMoreProducts
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loadingMoreProducts ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </div>
            ) : (
              "Load More Products"
            )}
          </button>
        </div>
      )}

      {/* No more products message */}
      {!hasMoreProducts && displayedProducts.length > 6 && (
        <div className="text-center mt-6 text-gray-500">
          <p>No more products to load</p>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
