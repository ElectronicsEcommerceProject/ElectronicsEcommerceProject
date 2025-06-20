import React from "react";
import {
  FiHeart,
  FiStar,
  FiPackage,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";

const ProductCard = ({
  product,
  onProductClick,
  onProductHover,
  onProductLeave,
  isHovered,
  wishlist,
  toggleWishlist,
}) => {
  if (!product?.id) {
    console.error("Product missing id:", product);
    return <div className="text-red-500">Error: Product ID missing</div>;
  }

  return (
    <div
      className={`relative bg-white p-4 rounded-lg shadow-md text-sm cursor-pointer transition-all duration-200 ${
        isHovered ? "scale-105 shadow-xl" : "hover:scale-105 hover:shadow-xl"
      } border border-gray-200`}
      onClick={() => onProductClick(product.id)}
      onMouseEnter={() => onProductHover(product.id)}
      onMouseLeave={() => onProductLeave()}
      onTouchStart={() => onProductHover(product.id)}
    >
      {/* Header with ID and Featured Badge */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-gray-400 font-mono">
          ID: {product.id}
        </span>
        <div className="flex gap-1">
          {product.isFeatured && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <FiAward size={10} />
              Featured
            </span>
          )}
          <button
            className="p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label={
              wishlist.includes(product.id)
                ? "Remove from Wishlist"
                : "Add to Wishlist"
            }
          >
            <FiHeart
              size={18}
              className={`${
                wishlist.includes(product.id)
                  ? "text-red-500 fill-red-500"
                  : "text-gray-500"
              } transition-colors`}
            />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <div className="relative mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 object-contain rounded-md bg-gray-50"
        />
        {product.discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      {/* Product Name */}
      <h3
        className={`font-semibold text-base mb-2 transition-colors duration-200 ${
          isHovered ? "text-blue-600" : "text-gray-900"
        }`}
        title={product.name}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {product.name}
      </h3>

      {/* Brand and Category */}
      <div className="mb-2">
        <p className="text-blue-600 font-medium text-sm">{product.brand}</p>
        <p
          className="text-gray-500 text-xs truncate"
          title={product.categoryPath}
        >
          {product.categoryPath}
        </p>
      </div>

      {/* Price */}
      <div className="mb-2">
        <p className="text-gray-900 font-bold text-lg">
          ₹{product.price.toLocaleString()}
        </p>
        {product.discount && (
          <p className="text-green-600 text-xs font-medium">
            {product.discount}
          </p>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1">
          <FiStar className="text-yellow-500 fill-yellow-500" size={14} />
          <span className="text-gray-700 font-medium">{product.rating}</span>
        </div>
        <span className="text-gray-500 text-xs">
          ({product.ratingCount} reviews)
        </span>
      </div>

      {/* Stock Information */}
      <div className="flex items-center gap-2 mb-2">
        <FiPackage
          size={14}
          className={product.inStock ? "text-green-500" : "text-red-500"}
        />
        <span
          className={`text-xs font-medium ${
            product.inStock ? "text-green-600" : "text-red-600"
          }`}
        >
          {product.inStock
            ? `In Stock (${product.stockLevel} units)`
            : "Out of Stock"}
        </span>
      </div>

      {/* Variants */}
      {product.hasVariants && (
        <div className="mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            Multiple Variants
          </span>
        </div>
      )}

      {/* Short Description */}
      <p
        className="text-gray-600 text-xs mb-2"
        title={product.shortDescription}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {product.shortDescription}
      </p>

      {/* Arrival Information */}
      <p className="text-purple-600 text-xs font-medium mb-2">
        {product.arrival}
      </p>

      {/* Popularity */}
      <div className="flex items-center gap-1 mb-2">
        <FiTrendingUp size={12} className="text-orange-500" />
        <span className="text-orange-600 text-xs font-medium">
          Popularity: {product.popularity}%
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
