import React from 'react';

const CustomerProductCard = () => (
  <div className="product-card">
    <img
      src="https://images.unsplash.com/photo-1516321310764-9d9614312405?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
      alt="Laptop"
      className="product-image"
    />
    <div className="product-details">
      <span className="stock-tag">In Stock</span>
      <h4 className="product-title">HP Pavilion 15</h4>
      <div className="product-rating">
        <span className="rating-stars">★★★★☆</span>
        <span className="rating-count">(12)</span>
      </div>
      <div className="product-price">
        <span className="original-price">₹60,000</span>
        <span className="discounted-price">₹55,000</span>
      </div>
      <div className="product-actions">
        <button className="compare-button">Compare</button>
        <button className="add-to-cart-button">Add to Cart</button>
      </div>
    </div>
  </div>
);

export default CustomerProductCard;