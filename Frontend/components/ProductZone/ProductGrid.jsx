import React from "react";
import { ProductCardZone } from '../index.js';

const ProductGrid = ({
  products,
  mobileView,
  onProductClick,
  onProductHover,
  onProductLeave,
  hoveredProduct,
  wishlist,
  toggleWishlist,
}) => {
  return (
    <section aria-label="Product Grid">
      <div
        className={`grid gap-6 ${
          mobileView
            ? "grid-cols-1"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {products.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No products found.
          </p>
        ) : (
          products.map((product) => (
            <ProductCardZone
              key={product.id}
              product={product}
              onProductClick={onProductClick}
              onProductHover={onProductHover}
              onProductLeave={onProductLeave}
              isHovered={hoveredProduct === product.id}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
