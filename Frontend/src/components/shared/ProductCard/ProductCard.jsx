import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CustomerProductCard = ({ products = [], searchQuery = "" }) => {
  const navigate = useNavigate();

  const filteredProducts = products.filter((product) =>
    product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (productId) => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <div className="px-3 py-4">
      {filteredProducts.length > 0 ? (
        <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
          {filteredProducts.map((product) => {
            const name = product?.name?.trim() || "Unnamed Product";
            const price =
              product?.price !== undefined && !isNaN(Number(product.price))
                ? Number(product.price).toFixed(2)
                : null;

            const stock = Number(product?.stock) || 0;
            const discount = Number(product?.discount_percentage) || 0;

            return (
              <Col key={product.product_id}>
                <Card
                  className="rounded-2xl shadow-md border-0 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleCardClick(product.product_id)}
                  style={{
                    transform: "rotate(-2deg)",
                    transformOrigin: "center",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform =
                      "rotate(0deg) scale(1.03)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "rotate(-2deg)";
                  }}
                >
                  {/* Product Image */}
                  <div className="relative bg-white">
                    <Card.Img
                      variant="top"
                      src={
                        product.image_url ||
                        "https://via.placeholder.com/300x300?text=No+Image"
                      }
                      alt={name}
                      className="p-3"
                      style={{
                        height: "200px",
                        objectFit: "contain",
                      }}
                    />
                    {/* Stock Badge */}
                    <span
                      className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-semibold text-white ${
                        stock > 0 ? "bg-green-600" : "bg-red-500"
                      }`}
                    >
                      {stock > 0 ? `In Stock (${stock})` : "Out of Stock"}
                    </span>
                  </div>

                  {/* Product Details */}
                  <Card.Body className="d-flex flex-column gap-1">
                    {/* Name */}
                    <Card.Title
                      className="text-dark fw-semibold mb-1 text-truncate"
                      title={name}
                      style={{ minHeight: "1.5rem" }}
                    >
                      {name}
                    </Card.Title>

                    {/* Optional Category */}
                    {product?.Category?.name && (
                      <div className="text-muted text-sm mb-1 text-truncate">
                        {product.Category.name}
                      </div>
                    )}

                    {/* Price & Discount */}
                    <div className="mt-auto">
                      {price !== null ? (
                        <span className="text-indigo-600 fw-bold fs-5">
                          ₹{price}
                        </span>
                      ) : (
                        <span className="text-muted fs-6">
                          Price Unavailable
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="text-danger text-sm ms-2">
                          ({discount}% off)
                        </span>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <div className="text-center py-10 px-4">
          <h4 className="text-xl font-semibold text-gray-700 mb-2">
            No products found
          </h4>
          <p className="text-sm text-gray-500">
            Try adjusting your search or category filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerProductCard;
