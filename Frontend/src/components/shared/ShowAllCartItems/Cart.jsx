import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaMinus,
  FaTrashAlt,
  FaShoppingCart,
  FaShoppingBag,
  FaExclamationCircle,
} from "react-icons/fa";
import { Spinner, Alert, Button, Card } from "react-bootstrap";
import CartService from "./CartService";
import alertService from "../Alert/AlertService";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);
  const navigate = useNavigate();

  // Fetch Cart Items
  const fetchCart = useCallback(async () => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("Authentication token not found. Please login.");
      const data = await CartService.getAllCartItems(token);
      setCartItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setError(
        err.message || "Could not fetch cart items. Please try again later."
      );
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchCart();
  }, [fetchCart]);

  // Handle Quantity Change
  const handleQuantityChange = async (productId, currentQty, change) => {
    const product = cartItems.find(
      (item) => item.product_id === productId
    )?.Product;
    const minQty = product?.min_retailer_quantity || 1; // Default to 1 if min_qty is undefined
    const newQty = currentQty + change;

    // Prevent decreasing below the minimum quantity
    if (change < 0 && newQty < minQty) {
      console.log("preventing decrease below min qty");
      alertService.showError(`Minimum quantity for this item is ${minQty}.`);
      return;
    }

    // Prevent increasing beyond stock limit
    if (change > 0 && product?.stock && newQty > product.stock) {
      console.log("preventing increase beyond stock limit");
      alertService.showError(
        `Maximum available stock for this item is ${product.stock}.`
      );
      return;
    }

    if (newQty < 1) return;

    if (updatingItemId) return;
    setUpdatingItemId(productId);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("Authentication token not found. Please login.");
      await CartService.updateCartItem(productId, newQty, token);
      await fetchCart();
    } catch (err) {
      console.error("Failed to update cart quantity:", err);
      setError(err.message || "Could not update item quantity.");
      alertService.showError(err.message || "Could not update item quantity.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Handle Item Removal
  const handleRemove = async (productId) => {
    if (removingItemId) return;
    setRemovingItemId(productId);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("Authentication token not found. Please login.");
      await CartService.removeFromCart(productId, token);
      alertService.showSuccess("Item removed from cart.");
      await fetchCart();
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
      setError(err.message || "Could not remove item from cart.");
      alertService.showError(err.message || "Could not remove item from cart.");
    } finally {
      setRemovingItemId(null);
    }
  };

  // Calculate Subtotal
  const calculateSubtotal = () =>
    cartItems
      .reduce((acc, item) => {
        const price = parseFloat(item?.Product?.price);
        const quantity = parseInt(item?.quantity, 10);
        return acc + (isNaN(price) || isNaN(quantity) ? 0 : price * quantity);
      }, 0)
      .toFixed(2);

  // Navigate to Checkout
  const handleCheckout = () => navigate("/checkout");

  // Render Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner animation="border" role="status" variant="primary" />
        <span className="ml-3 text-lg text-gray-600">Loading Your Cart...</span>
      </div>
    );
  }

  // Render Error State
  if (error && cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <FaExclamationCircle className="text-red-500 text-5xl mb-4" />
        <h2 className="text-xl font-semibold text-red-700 mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-600">{error}</p>
        <Button
          onClick={() => {
            setLoading(true);
            fetchCart();
          }}
          variant="primary"
          className="mt-6"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Render Empty Cart State
  if (!loading && cartItems.length === 0 && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <FaShoppingCart className="text-gray-400 text-6xl mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button
          onClick={() => navigate("/")}
          variant="primary"
          className="flex items-center gap-2"
        >
          <FaShoppingBag /> Continue Shopping
        </Button>
      </div>
    );
  }

  // Render Cart Items and Summary
  const subtotal = calculateSubtotal();

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Your Shopping Cart
      </h1>

      {/* Display General Error Messages */}
      {error && (
        <Alert variant="danger" className="mb-3">
          <strong>Error:</strong> {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => {
            const product = item?.Product;
            const price = parseFloat(product?.price);
            const itemTotal = !isNaN(price)
              ? (price * item.quantity).toFixed(2)
              : "N/A";
            const isUpdating = updatingItemId === item.product_id;
            const isRemoving = removingItemId === item.product_id;
            const isDisabled = isUpdating || isRemoving;

            return (
              <Card key={item.cart_id} className="shadow-sm rounded-lg">
                <Card.Body className="flex flex-col sm:flex-row items-center justify-between p-2 sm:p-3">
                  {/* Product Info */}
                  <div className="flex gap-2 items-center w-full sm:w-auto mb-2 sm:mb-0">
                    <img
                      src={
                        product?.image_url || "https://via.placeholder.com/80"
                      }
                      alt={product?.name || "Product Image"}
                      className="w-16 h-16 object-contain rounded border border-gray-200"
                    />
                    <div className="flex-grow">
                      <Card.Title
                        className="text-sm sm:text-base font-semibold text-gray-800 hover:text-blue-600 cursor-pointer"
                        onClick={() => navigate(`/product/${item.product_id}`)}
                      >
                        {product?.name || "Product Name Unavailable"}
                      </Card.Title>
                      <Card.Text className="text-xs text-gray-600">
                        Unit Price: ₹{!isNaN(price) ? price.toFixed(2) : "N/A"}
                      </Card.Text>
                      {product?.min_retailer_quantity > 1 && (
                        <Card.Text className="text-xs text-orange-600">
                          Min Qty: {product.min_retailer_quantity}
                        </Card.Text>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 mx-auto sm:mx-2 my-1 sm:my-0">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      disabled={
                        item.quantity <=
                          (product?.min_retailer_quantity || 1) || isDisabled
                      }
                      onClick={() =>
                        handleQuantityChange(item.product_id, item.quantity, -1)
                      }
                      className="rounded-full p-1"
                    >
                      <FaMinus size={10} />
                    </Button>
                    <span className="px-2 w-8 text-center font-medium text-sm">
                      {isUpdating ? (
                        <Spinner
                          animation="border"
                          size="sm"
                          variant="secondary"
                        />
                      ) : (
                        item.quantity
                      )}
                    </span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      disabled={
                        isDisabled ||
                        (product?.stock && item.quantity >= product.stock)
                      }
                      onClick={() =>
                        handleQuantityChange(item.product_id, item.quantity, 1)
                      }
                      className="rounded-full p-1"
                    >
                      <FaPlus size={10} />
                    </Button>
                  </div>

                  {/* Item Total & Remove Button */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
                    <Card.Text className="text-sm font-semibold text-gray-800 w-16 text-right">
                      ₹{itemTotal}
                    </Card.Text>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      disabled={isDisabled}
                      onClick={() => handleRemove(item.product_id)}
                      className="p-1"
                    >
                      {isRemoving ? (
                        <Spinner
                          animation="border"
                          size="sm"
                          variant="danger"
                        />
                      ) : (
                        <FaTrashAlt size={12} />
                      )}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <Card className="bg-gray-50 p-4 rounded-lg shadow-md h-fit sticky top-24">
          <Card.Title className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
            Order Summary
          </Card.Title>
          <Card.Body className="space-y-2 text-gray-700 p-0">
            <div className="flex justify-between">
              <span className="text-sm">
                Subtotal ({cartItems.length} items)
              </span>
              <span className="font-medium text-sm">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Estimated Delivery</span>
              <span className="font-medium text-sm">FREE</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>
          </Card.Body>
          <Button
            variant="primary"
            className="mt-4 w-full text-sm py-2"
            disabled={cartItems.length === 0}
            onClick={handleCheckout}
          >
            <FaShoppingCart className="mr-1" /> Proceed to Checkout
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
