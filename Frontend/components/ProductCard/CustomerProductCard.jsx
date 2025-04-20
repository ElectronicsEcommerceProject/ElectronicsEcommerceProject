import React from "react";

const CustomerProductCard = () => {
  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "10px",
    overflow: "hidden",
    width: "280px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
  };

  const imageStyle = {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  };

  const detailsStyle = {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  const stockTagStyle = {
    fontSize: "0.75rem",
    color: "green",
    fontWeight: "bold",
  };

  const titleStyle = {
    fontSize: "1rem",
    fontWeight: "600",
    margin: 0,
  };

  const ratingStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.9rem",
  };

  const priceStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    fontSize: "1rem",
  };

  const originalPriceStyle = {
    textDecoration: "line-through",
    color: "#888",
  };

  const discountedPriceStyle = {
    color: "#d32f2f",
    fontWeight: "bold",
  };

  const actionsStyle = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.75rem",
  };

  const buttonStyle = {
    flex: 1,
    padding: "0.5rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const compareButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#eee",
    color: "#333",
  };

  const cartButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#007bff",
    color: "#fff",
  };

  return (
    <div style={cardStyle}>
      <img
        src="https://images.unsplash.com/photo-1516321310764-9d9614312405?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
        alt="Laptop"
        style={imageStyle}
      />
      <div style={detailsStyle}>
        <span style={stockTagStyle}>In Stock</span>
        <h4 style={titleStyle}>HP Pavilion 15</h4>
        <div style={ratingStyle}>
          <span>★★★★☆</span>
          <span style={{ color: "#888" }}>(12)</span>
        </div>
        <div style={priceStyle}>
          <span style={originalPriceStyle}>₹60,000</span>
          <span style={discountedPriceStyle}>₹55,000</span>
        </div>
        <div style={actionsStyle}>
          <button style={compareButtonStyle}>Compare</button>
          <button style={cartButtonStyle}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerProductCard;
