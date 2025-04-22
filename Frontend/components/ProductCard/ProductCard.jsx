import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const CustomerProductCard = ({
  products = [],
  searchQuery = "",
  onAddToCart,
  onAddToWishlist,
}) => {
  // Ensure products is always an array and searchQuery is a string
  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 py-4">
      {filteredProducts.length > 0 ? (
        <Row className="g-4">
          {filteredProducts.map((product) => (
            <Col key={product.product_id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 d-flex flex-column shadow-sm rounded-xl">
                <div style={{ height: "200px", overflow: "hidden" }}>
                  <Card.Img
                    variant="top"
                    src={product.image_url || "https://via.placeholder.com/300"}
                    className="w-full h-full object-cover"
                    alt={product.name || "Product Image"}
                  />
                </div>

                <Card.Body className="d-flex flex-column flex-grow-1">
                  <div>
                    <p
                      className={`text-sm font-semibold mb-1 ${
                        product.stock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </p>

                    <Card.Title className="text-lg font-bold mb-1">
                      {product.name || "Unnamed Product"}
                    </Card.Title>

                    <div className="text-sm text-gray-600 mb-2">★★★★☆ (12)</div>

                    <div className="mb-2">
                      <div className="line-through text-gray-500 text-sm">
                        ₹
                        {isNaN(product.price)
                          ? "0.00"
                          : (parseFloat(product.price) + 5000).toFixed(2)}
                      </div>
                      <div className="text-red-600 text-xl font-bold">
                        ₹
                        {isNaN(product.price)
                          ? "0.00"
                          : parseFloat(product.price).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Button block */}
                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="w-full bg-green-600 text-white px-3 py-2 rounded hover:bg-green-600"
                      onClick={() => onAddToCart(product.product_id)}
                    >
                      Add to Cart
                    </button>

                    <button
                      className="w-full border border-red-500 text-red-500 px-3 py-2 rounded hover:bg-red-50"
                      onClick={() => onAddToWishlist(product.product_id)}
                    >
                      ❤️
                    </button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5">
          <h4>Sorry, no products match your search.</h4>
        </div>
      )}
    </div>
  );
};

export default CustomerProductCard;
