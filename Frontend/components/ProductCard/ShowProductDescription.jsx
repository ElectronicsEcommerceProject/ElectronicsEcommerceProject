import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCardService from "./ProductCardService";
import { Button, Row, Col, Card, Form, Spinner } from "react-bootstrap"; // Import Spinner if needed for loading state on button click
import { FaCartPlus, FaHeart } from "react-icons/fa";
import alertService from "../../components/Alert/AlertService"; // Your alert service

const ShowProductDescription = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false); // Optional: Loading state for cart button
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false); // Optional: Loading state for wishlist button

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true); // Start loading
      try {
        const token = localStorage.getItem("token");
        const response = await ProductCardService.getProductById(
          productId,
          token
        );
        const productData = Array.isArray(response) ? response[0] : response;

        // Basic validation for numeric fields before parsing
        const parseNumeric = (value, defaultValue = 0) => {
          const num = parseFloat(value);
          return isNaN(num) ? defaultValue : num;
        };
        const parseIntStrict = (value, defaultValue = 0) => {
          const num = parseInt(value, 10);
          return isNaN(num) ? defaultValue : num;
        };

        const formattedProduct = {
          ...productData,
          price: parseNumeric(productData.price),
          discount_percentage: parseNumeric(productData.discount_percentage),
          bulk_discount_percentage: parseNumeric(
            productData.bulk_discount_percentage
          ),
          discount_quantity: parseIntStrict(productData.discount_quantity),
          bulk_discount_quantity: parseIntStrict(
            productData.bulk_discount_quantity
          ),
          stock: parseIntStrict(productData.stock),
          stock_alert_threshold: parseIntStrict(
            productData.stock_alert_threshold
          ),
          min_retailer_quantity: parseIntStrict(
            productData.min_retailer_quantity,
            1 // Default min quantity to 1 if not specified or invalid
          ),
        };

        setProduct(formattedProduct);
        setQuantity(formattedProduct.min_retailer_quantity || 1); // Set initial quantity to min required or 1
      } catch (error) {
        console.error("Error fetching product details:", error);
        alertService.showError(
          "Failed to load product details. Please try again."
        );
        setProduct(null); // Ensure product is null on error
      } finally {
        setLoading(false); // Stop loading regardless of outcome
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    // Add async if you plan to call an API
    if (!product) return; // Should not happen if UI is rendered correctly, but good practice

    if (product.stock <= 0) {
      alertService.showError("This item is currently out of stock.");
      return;
    }

    if (quantity < product.min_retailer_quantity) {
      alertService.showError(
        `Minimum order quantity is ${product.min_retailer_quantity}.`
      );
      return;
    }

    if (quantity > product.stock) {
      alertService.showError(`Only ${product.stock} items available in stock.`);
      return;
    }

    setIsAddingToCart(true); // Start loading indicator on button
    // Simulate API call or actual API call
    // await cartService.addToCart(product.product_id, quantity);
    console.log(
      `Adding ${quantity} of Product ID ${product.product_id} to cart.`
    );
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    alertService.showSuccess(
      `${quantity} x ${product.name} added to your cart!`
    );
    setIsAddingToCart(false); // Stop loading indicator
  };

  const handleAddToWishlist = async () => {
    // Add async if you plan to call an API
    if (!product) return;

    setIsAddingToWishlist(true);
    // Simulate API call or actual API call
    // await wishlistService.addToWishlist(product.product_id);
    console.log(`Adding Product ID ${product.product_id} to wishlist.`);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    alertService.showSuccess(`${product.name} added to your wishlist!`);
    setIsAddingToWishlist(false);
  };

  // Update quantity handler with validation
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      setQuantity(1); // Reset to 1 if input is invalid or less than 1
    } else if (product && value > product.stock) {
      setQuantity(product.stock); // Cap at max stock
      alertService.showWarning(`Maximum available stock is ${product.stock}.`);
    } else {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <div
        className="text-center py-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <span className="ms-2">Loading product details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-5 text-danger">
        Product not found or failed to load.
      </div>
    );
  }

  // Calculate discounted price if needed (example)
  const displayPrice = product.price.toFixed(2);
  const originalPrice = (product.price * 1.15).toFixed(2); // Example: Assume original price is 15% higher

  return (
    <div className="container mx-auto px-4 py-5">
      <Row className="g-4">
        {/* Left Side: Product Image */}
        <Col
          xs={12}
          md={5}
          className="d-flex justify-content-center align-items-start"
        >
          <Card
            className="shadow-sm rounded-lg w-100 position-relative border-light"
            style={{ maxWidth: "400px" }}
          >
            <Card.Img
              variant="top"
              src={
                product.image_url ||
                "https://via.placeholder.com/400x400?text=No+Image"
              }
              alt={product.name}
              style={{
                maxHeight: "400px",
                objectFit: "contain", // Use contain to show the whole image
                padding: "1rem", // Add some padding around the image
              }}
            />
            <div
              className={`position-absolute top-0 start-0 m-2 px-2 py-1 rounded text-white small fw-bold ${
                product.stock > 0 ? "bg-success" : "bg-danger"
              }`}
              style={{ fontSize: "0.75rem" }}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
              {product.stock > 0 && ` (${product.stock} left)`}
            </div>
          </Card>
        </Col>

        {/* Right Side: Product Details */}
        <Col xs={12} md={7}>
          <div className="d-flex flex-column h-100">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-700 mb-3">{product.description}</p>

            {/* Price Section */}
            <div className="mb-3">
              <span className="line-through text-gray-500 me-2 fs-6">
                ₹{originalPrice}
              </span>
              <span className="text-danger fw-bold fs-3">₹{displayPrice}</span>
              {parseFloat(originalPrice) > parseFloat(displayPrice) && (
                <span className="ms-2 badge bg-warning text-dark">
                  {(
                    ((parseFloat(originalPrice) - parseFloat(displayPrice)) /
                      parseFloat(originalPrice)) *
                    100
                  ).toFixed(0)}
                  % OFF
                </span>
              )}
            </div>

            {/* Stock Alert */}
            {product.stock > 0 &&
              product.stock <= product.stock_alert_threshold && (
                <p className="text-warning small mb-3 fw-bold">
                  Low stock! Only {product.stock} left. Order soon!
                </p>
              )}

            {/* Quantity Selector */}
            <div className="mb-3">
              <Form.Group
                controlId="formQuantity"
                className="d-flex align-items-center"
              >
                <Form.Label className="me-2 mb-0 fw-semibold">
                  Quantity:
                </Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={product.stock > 0 ? product.stock : "1"} // Set max based on stock
                  value={quantity}
                  className="w-auto" // Adjust width automatically
                  style={{ maxWidth: "80px" }} // Max width for quantity input
                  onChange={handleQuantityChange}
                  disabled={product.stock <= 0} // Disable if out of stock
                />
              </Form.Group>
              {product.min_retailer_quantity > 1 && (
                <small className="text-muted d-block mt-1">
                  Minimum order quantity: {product.min_retailer_quantity}
                </small>
              )}
            </div>

            {/* Discount Information */}
            <div className="space-y-1 mb-4 p-3 bg-light rounded border border-dashed">
              {product.discount_percentage > 0 &&
                product.discount_quantity > 0 && (
                  <p className="text-sm text-secondary mb-1">
                    <span className="badge bg-info me-1">Discount</span> Buy{" "}
                    <strong>{product.discount_quantity}</strong> or more to get{" "}
                    <strong>{product.discount_percentage}%</strong> off.
                  </p>
                )}
              {product.bulk_discount_percentage > 0 &&
                product.bulk_discount_quantity > 0 && (
                  <p className="text-sm text-secondary mb-0">
                    <span className="badge bg-primary me-1">Bulk Offer</span>{" "}
                    Buy <strong>{product.bulk_discount_quantity}</strong> or
                    more to get{" "}
                    <strong>{product.bulk_discount_percentage}%</strong> off.
                  </p>
                )}
              {!(
                product.discount_percentage > 0 && product.discount_quantity > 0
              ) &&
                !(
                  product.bulk_discount_percentage > 0 &&
                  product.bulk_discount_quantity > 0
                ) && (
                  <p className="text-sm text-secondary mb-0">
                    No special discounts currently available.
                  </p>
                )}
            </div>

            {/* Action Buttons */}
            {/* This div handles responsive layout: stacks on small screens (default), row on medium and up */}
            <div className="d-flex flex-column flex-md-row gap-2 gap-md-3 mt-auto">
              {/* --- Updated Add to Cart Button --- */}
              <Button
                variant="success" // Bootstrap success color (green)
                className="w-100 d-flex align-items-center justify-content-center py-2 fw-semibold" // Full width, center content, padding, font weight
                onClick={handleAddToCart}
                disabled={
                  product.stock <= 0 ||
                  isAddingToCart ||
                  quantity < product.min_retailer_quantity
                } // Disable if out of stock, adding, or below min qty
              >
                {isAddingToCart ? (
                  <Spinner animation="border" size="sm" className="me-2" />
                ) : (
                  <FaCartPlus className="me-2" />
                )}
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>

              {/* --- Updated Wishlist Button --- */}
              <Button
                variant="outline-danger" // Bootstrap outline danger color (red outline)
                className="w-100 d-flex align-items-center justify-content-center py-2 fw-semibold" // Full width, center content, padding, font weight
                onClick={handleAddToWishlist}
                disabled={isAddingToWishlist} // Disable while adding
              >
                {isAddingToWishlist ? (
                  <Spinner animation="border" size="sm" className="me-2" />
                ) : (
                  <FaHeart className="me-2" />
                )}
                {isAddingToWishlist ? "Adding..." : "Add to Wishlist"}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Optional: Add more sections like Specifications, Reviews etc. below */}
      {/* <Row className="mt-5">
        <Col>
          <h2>Specifications</h2>
          <p>Details about the product specs...</p>
        </Col>
      </Row> */}
    </div>
  );
};

export default ShowProductDescription;
