
import React from "react";
import { FiHeart } from "react-icons/fi";

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
      className={`relative bg-white p-3 rounded shadow text-sm cursor-pointer transition-all duration-200 ${
        isHovered ? "scale-105 shadow-lg" : "hover:scale-105 hover:shadow-lg"
      }`}
      onClick={() => onProductClick(product.id)}
      onMouseEnter={() => onProductHover(product.id)}
      onMouseLeave={() => onProductLeave()}
      onTouchStart={() => onProductHover(product.id)}
    >
      <button
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
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
          size={20}
          className={`${
            wishlist.includes(product.id)
              ? "text-red-500 fill-red-500"
              : "text-gray-500"
          } transition-colors`}
        />
      </button>
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-28 object-contain mb-1 rounded"
      />
      <h3
        className={`font-medium truncate transition-colors duration-200 ${
          isHovered ? "text-blue-600" : "text-black"
        }`}
      >
        {product.name}
      </h3>
      <p className="text-gray-600">{product.brand}</p>
      <p className="text-black font-semibold">₹{product.price}</p>
      <p className="text-yellow-500">⭐ {product.rating}</p>
      <p className="text-gray-500">{product.discount}</p>
      <p className="text-gray-500">{product.inStock ? "In Stock" : "Out of Stock"}</p>
    </div>
  );
};

export default ProductCard;