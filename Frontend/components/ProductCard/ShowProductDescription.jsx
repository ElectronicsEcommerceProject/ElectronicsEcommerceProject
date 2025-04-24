// filepath: c:\Users\satyam singh\Desktop\vite-project\maaLaxmiEcommerceWebsite\ElectronicsEcommerceProject\Frontend\components\ProductCard\ShowProductDescription.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for potential search redirection
import { useSelector, useDispatch } from "react-redux";
import { addToCart, addToWishlist } from "../../components/Redux/productSlice"; // Import actions
import ProductCardService from "./ProductCardService";
import { Button, Row, Col, Card, Form, Spinner } from "react-bootstrap";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import alertService from "../../components/Alert/AlertService";
import CustomerHeader from "../../components/Header/CustomerHeader"; // Ensure path is correct

const ShowProductDescription = () => {
  const { productId } = useParams();
  const dispatch = useDispatch(); // Initialize dispatch
  // const navigate = useNavigate(); // Uncomment if implementing search navigation

  // --- Access Redux state for Header ---
  const { cartCount = 0, wishlistCount = 0 } = useSelector(
    (state) => state.product // Assuming 'product' is the correct slice name
  );

  // --- Component State ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Default quantity, will be updated after fetch
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  // --- Placeholder search handler for Header ---
  const handleSearchFromProductPage = (query) => {
    console.warn(
      "Search initiated from product page with query:",
      query,
      "- Navigation not implemented yet."
    );
    // Optional: Navigate back to dashboard with search
    // navigate(`/?search=${encodeURIComponent(query)}`);
  };

  // --- Fetch Product Details ---
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alertService.showError(
            "Authentication token not found. Please login."
          );
          setLoading(false);
          // Optionally redirect to login
          // navigate('/login');
          return;
        }

        const response = await ProductCardService.getProductById(
          productId,
          token
        );

        // --- Robust Data Handling ---
        const productData = Array.isArray(response) ? response[0] : response;

        if (!productData || typeof productData !== "object") {
          throw new Error("Invalid product data received.");
        }

        // Helper functions for safe parsing
        const parseNumeric = (value, defaultValue = 0) => {
          const num = parseFloat(value);
          return isNaN(num) ? defaultValue : num;
        };
        const parseIntStrict = (value, defaultValue = 0) => {
          const num = parseInt(value, 10);
          return isNaN(num) ? defaultValue : num;
        };

        // Format product data safely
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
            productData.stock_alert_threshold,
            5 // Example default threshold
          ),
          min_retailer_quantity: parseIntStrict(
            productData.min_retailer_quantity,
            1 // Default min quantity to 1
          ),
          // Ensure essential fields exist
          product_id: productData.product_id,
          name: productData.name || "Unnamed Product",
          description: productData.description || "No description available.",
          image_url: productData.image_url,
        };
        // --- End Robust Data Handling ---

        setProduct(formattedProduct);
        // Set initial quantity based on minimum required or 1
        // User can still change it below minimum afterwards
        setQuantity(formattedProduct.min_retailer_quantity || 1);
      } catch (error) {
        console.error("Error fetching product details:", error);
        alertService.showError(
          error.message || "Failed to load product details. Please try again."
        );
        setProduct(null); // Ensure product is null on error
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]); // Dependency array

  // --- Event Handlers ---
  const handleAddToCart = async () => {
    if (!product) return; // Should not happen if UI rendered correctly

    // --- CHECK MINIMUM QUANTITY ON ADD TO CART CLICK ---
    if (quantity < product.min_retailer_quantity) {
      alertService.showError(
        `Minimum order quantity is ${product.min_retailer_quantity}. Please increase the quantity.`
      );
      // Optionally set quantity back to minimum here if desired:
      // setQuantity(product.min_retailer_quantity);
      return; // Stop the add to cart process
    }
    // --- END MINIMUM QUANTITY CHECK ---

    // Other checks (already present and correct)
    if (product.stock <= 0) {
      alertService.showError("This item is currently out of stock.");
      return;
    }
    if (quantity > product.stock) {
      // This check might be redundant if handleQuantityChange caps it, but good failsafe
      alertService.showError(
        `Only ${product.stock} items available in stock. Quantity adjusted.`
      );
      setQuantity(product.stock); // Adjust quantity
      return; // Stop the add to cart process for this click, user can click again
    }

    setIsAddingToCart(true);
    console.log(
      `Adding ${quantity} of Product ID ${product.product_id} to cart.`
    );
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    alertService.showSuccess(
      `${quantity} x ${product.name} added to your cart!`
    );
    dispatch(addToCart(quantity)); // Dispatch Redux action to update count
    setIsAddingToCart(false);
  };

  const handleAddToWishlist = async () => {
    if (!product) return;

    setIsAddingToWishlist(true);
    console.log(`Adding Product ID ${product.product_id} to wishlist.`);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    alertService.showSuccess(`${product.name} added to your wishlist!`);
    dispatch(addToWishlist(quantity)); // Dispatch Redux action to update count
    setIsAddingToWishlist(false);
  };

  // --- CORRECTED handleQuantityChange ---
  const handleQuantityChange = (e) => {
    let value = parseInt(e.target.value, 10);

    // Basic validation: Ensure it's a positive number
    if (isNaN(value) || value < 1) {
      value = 1; // Reset to 1 if invalid or less than 1
    }

    // Stock validation: Cap at max stock if product data is available
    if (product && value > product.stock) {
      value = product.stock; // Cap at max stock
      alertService.showWarning(`Maximum available stock is ${product.stock}.`);
    }

    // --- REMOVED MINIMUM QUANTITY CHECK FROM HERE ---
    // The check will now only happen inside handleAddToCart when the button is clicked.

    setQuantity(value);
  };
  // --- End Event Handlers ---

  // --- Conditional Rendering ---
  if (loading) {
    return (
      <>
        <CustomerHeader
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          setSearchQuery={handleSearchFromProductPage}
        />
        <div
          className="text-center py-5 d-flex justify-content-center align-items-center"
          style={{ minHeight: "50vh" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <span className="ms-2">Loading product details...</span>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <CustomerHeader
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          setSearchQuery={handleSearchFromProductPage}
        />
        <div className="container text-center py-5">
          <h2 className="text-danger">Product Not Found</h2>
          <p className="text-muted">
            The product you are looking for might be unavailable or the link is
            incorrect.
          </p>
          {/* <Button variant="primary" onClick={() => navigate('/')}>Go to Homepage</Button> */}
        </div>
      </>
    );
  }
  // --- End Conditional Rendering ---

  // --- Price Calculation ---
  const displayPrice =
    typeof product.price === "number" ? product.price.toFixed(2) : "N/A";
  const originalPrice =
    typeof product.price === "number"
      ? (product.price * 1.15).toFixed(2) // Example calculation, adjust as needed
      : "N/A";
  const hasDiscount = parseFloat(originalPrice) > parseFloat(displayPrice);

  // --- Render Component ---
  return (
    <>
      {/* --- Header --- */}
      <CustomerHeader
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        setSearchQuery={handleSearchFromProductPage} // Pass the handler
      />

      {/* --- Product Details Layout --- */}
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
                  objectFit: "contain",
                  padding: "1rem",
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
              <p className="text-secondary mb-3">{product.description}</p>
              <div className="mb-3 d-flex align-items-baseline">
                {hasDiscount && (
                  <span className="text-muted text-decoration-line-through me-2 fs-6">
                    ₹{originalPrice}
                  </span>
                )}
                <span
                  className={`fw-bold fs-3 ${
                    hasDiscount ? "text-danger" : "text-dark"
                  }`}
                >
                  ₹{displayPrice}
                </span>
                {hasDiscount && (
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
              {product.stock > 0 &&
                product.stock <= product.stock_alert_threshold && (
                  <p className="text-warning small mb-3 fw-bold">
                    <i className="bi bi-exclamation-triangle-fill me-1"></i> Low
                    stock! Only {product.stock} left. Order soon!
                  </p>
                )}
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
                    min="1" // Minimum input value is 1
                    max={product.stock > 0 ? product.stock : "1"} // Set max based on stock
                    value={quantity}
                    className="w-auto"
                    style={{ maxWidth: "80px" }}
                    onChange={handleQuantityChange}
                    disabled={product.stock <= 0} // Disable if out of stock
                  />
                </Form.Group>
                {/* Display minimum order quantity info */}
                {product.min_retailer_quantity > 1 && (
                  <small className="text-muted d-block mt-1">
                    Minimum order quantity: {product.min_retailer_quantity}
                  </small>
                )}
              </div>
              <div className="space-y-1 mb-4 p-3 bg-light rounded border border-dashed">
                {product.discount_percentage > 0 &&
                  product.discount_quantity > 0 && (
                    <p className="text-sm text-secondary mb-1">
                      <span className="badge bg-info me-1">Discount</span> Buy{" "}
                      <strong>{product.discount_quantity}</strong> or more to
                      get <strong>{product.discount_percentage}%</strong> off.
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
                  product.discount_percentage > 0 &&
                  product.discount_quantity > 0
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

              <div className="d-flex flex-column flex-md-row gap-2 gap-md-3 mt-auto">
                {/* Add to Cart Button */}
                <Button
                  variant="success"
                  className="w-100 d-flex align-items-center justify-content-center py-2 fw-semibold gap-2"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || isAddingToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <FaCartPlus />
                      Add to Cart
                    </>
                  )}
                </Button>

                {/* Add to Wishlist Button */}
                <Button
                  variant="outline-danger"
                  className="w-100 d-flex align-items-center justify-content-center py-2 fw-semibold gap-2"
                  onClick={handleAddToWishlist}
                  disabled={isAddingToWishlist}
                >
                  {isAddingToWishlist ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <FaHeart />
                      Add to Wishlist
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ShowProductDescription;
