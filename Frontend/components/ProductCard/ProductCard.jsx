import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import ProductCardService from "./ProductCardService";

const CustomerProductCard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await ProductCardService.getAllProducts(token);
        setProducts(response);
      } catch (error) {
        console.error(
          "Error fetching products:",
          error.response?.data || error
        );
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="px-4 py-4">
      <Row className="g-4">
        {products.map((product) => (
          <Col key={product.product_id} xs={12} sm={6} md={4} lg={3}>
            <Card className="h-100 d-flex flex-column shadow-sm rounded-xl">
              <div style={{ height: "200px", overflow: "hidden" }}>
                <Card.Img
                  variant="top"
                  src={product.image_url || "https://via.placeholder.com/300"}
                  className="w-full h-full object-cover"
                  alt={product.name}
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
                    {product.name}
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

                {/* Button block sticks to bottom */}
                <div className="mt-auto flex gap-2">
                  <Button variant="outline-secondary" className="w-1/2">
                    Compare
                  </Button>
                  <Button variant="primary" className="w-1/">
                    Add to Cart
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CustomerProductCard;
