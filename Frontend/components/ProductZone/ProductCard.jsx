import React from "react";

const ProductCard = ({
  product,
  onProductClick,
  onProductHover,
  onProductLeave,
  isHovered,
}) => {
  // Debugging: Log received props to ensure they are passed correctly
  // console.log("ProductCard props:", { product, onProductClick, onProductHover, onProductLeave, isHovered });

  // Ensure product has an id
  if (!product?.id) {
    console.error("Product missing id:", product);
    return <div className="text-red-500">Error: Product ID missing</div>;
  }

  return (
    <div
      className={`bg-white p-3 rounded shadow text-sm cursor-pointer transition-all duration-200 ${
        isHovered ? "scale-105 shadow-lg" : "hover:scale-105 hover:shadow-lg"
      }`}
      onClick={() => {
        console.log("Card clicked for product:", product.id);
        onProductClick(product.id);
      }}
      onMouseEnter={() => {
        console.log("Card hovered for product:", product.id);
        onProductHover(product.id);
      }}
      onMouseLeave={() => {
        console.log("Card left for product:", product.id);
        onProductLeave();
      }}
      onTouchStart={() => {
        console.log("Card touched for product:", product.id);
        onProductHover(product.id);
      }}
    >
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