import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getApi, userProductsByCategoryId } from "../../../src/index.js";

const RelatedProducts = ({ isVisible = true, categoryId }) => {
  const navigate = useNavigate();

  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products by category
  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getApi(
          `${userProductsByCategoryId}/${categoryId}`
        );

        if (response.success && response.data) {
          setDisplayedProducts(response.data);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error loading products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (!isVisible) return null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-2 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 md:mb-6">
          Related Products
        </h3>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-2 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 md:mb-6">
          Related Products
        </h3>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 md:mb-6">
        Related Products
      </h3>
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {displayedProducts.map((product) => (
            <div
              key={product.id || product.product_id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
              onClick={() => {
                const productId = product.id || product.product_id;
                navigate(`/product/${productId}`);
                window.scrollTo(0, 0);
                // Also scroll the right panel to top if it exists
                const rightPanel = document.querySelector('[ref="rightScrollRef"]');
                if (rightPanel) {
                  rightPanel.scrollTop = 0;
                }
              }}
            >
              <div className="aspect-square flex items-center justify-center p-3 sm:p-4 bg-gray-50 group-hover:bg-gray-100 transition-colors">
                <img
                  src={product.image}
                  alt={product.title || product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-200"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop";
                  }}
                />
              </div>
              <div className="p-3 sm:p-4">
                <h4 className="text-xs sm:text-sm lg:text-base font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.title || product.name}
                </h4>
                <div className="mt-2">
                  <p className="text-sm sm:text-base lg:text-lg font-semibold text-green-600">
                    {product.price}
                  </p>
                  {product.originalPrice && (
                    <p className="text-xs text-gray-500 line-through">
                      {product.originalPrice}
                    </p>
                  )}
                  {product.discount && (
                    <p className="text-xs text-green-600 font-medium bg-green-50 px-1 py-0.5 rounded inline-block">
                      {product.discount}
                    </p>
                  )}
                </div>
                {product.rating && parseFloat(product.rating) > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs text-gray-600">
                      {product.rating} ({product.ratingCount || 0})
                    </span>
                  </div>
                )}
                {product.brand && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {product.brand.name}
                  </p>
                )}
                {/* Stock Status */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      product.inStock ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className={`text-xs font-medium ${
                      product.inStock ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  {product.stockLevel && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.stockLevel > 10 
                        ? 'bg-green-100 text-green-700' 
                        : product.stockLevel > 5 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.stockLevel} left
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-gray-500 text-sm">
            No related products available.
          </p>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
