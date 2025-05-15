import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white p-3 rounded shadow hover:shadow-md transition duration-200 text-sm">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-28 object-contain mb-1 rounded"
      />
      <h3 className="font-medium truncate">{product.name}</h3>
      <p className="text-gray-600">{product.brand}</p>
      <p className="text-blue-600 font-semibold">₹{product.price}</p>
      <p className="text-yellow-500">⭐ {product.rating}</p>
      <p className="text-gray-500">{product.discount}</p>
      <p className="text-gray-500">{product.inStock ? "In Stock" : "Out of Stock"}</p>
    </div>
  );
};

export default ProductCard;
