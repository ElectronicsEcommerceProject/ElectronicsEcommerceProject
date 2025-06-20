import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AddressForm,
  cartItemRoute,
  getApiById,
  updateApiById,
  deleteApiById,
  getUserIdFromToken,
  isAuthenticated,
  orderRoute,
  createApi,
  orderItemRoute,
} from "../../src/index.js";
// Note: Mock data removed - now using real API data

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [estimatedDelivery, setEstimatedDelivery] =
    useState("3-5 business days");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [availableAddresses, setAvailableAddresses] = useState([]);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [cart, setCart] = useState(null);
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);
  const [selectedItemForWishlist, setSelectedItemForWishlist] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  // Fetch cart data from API
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        if (!isAuthenticated()) {
          setError("Please login to view your cart");
          setLoading(false);
          return;
        }

        const userId = getUserIdFromToken();

        if (!userId) {
          setError("Invalid user session");
          setLoading(false);
          return;
        }

        const response = await getApiById(cartItemRoute, userId);

        if (response && response.success && response.data) {
          const {
            cartItems,
            user,
            selectedAddress,
            availableAddresses,
            availableCoupons,
            cart,
          } = response.data;

          setCartItems(cartItems || []);
          setUser(user);
          setSelectedAddress(selectedAddress);
          setAvailableAddresses(availableAddresses || []);
          setAvailableCoupons(availableCoupons || []);
          setCart(cart);
        } else {
          setError(response?.message || "Failed to fetch cart data");
        }
      } catch (err) {
        console.error("Error fetching cart data:", err);
        setError(err.message || "Failed to load cart data");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  // Calculate price details based on backend model structure
  const subtotal = cartItems.reduce(
    (sum, item) =>
      item.product.is_active ? sum + parseFloat(item.final_price) : sum,
    0
  );
  const discount = appliedCoupon ? parseFloat(appliedCoupon.discount_value) : 0;
  const delivery = subtotal > 5000 ? 0 : 99;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal - discount + delivery + tax;

  // Handlers
  const handleRemove = async (id) => {
    try {
      // Set loading state for the specific item being removed
      setUpdatingItemId(id);

      // Make API call to remove cart item
      const response = await deleteApiById(cartItemRoute, id);

      if (response && response.success) {
        // Remove item from local state
        setCartItems(cartItems.filter((item) => item.cart_item_id !== id));

        // Check if applied coupon is still valid after item removal
        if (appliedCoupon) {
          // Calculate new subtotal after removal
          const newSubtotal = cartItems
            .filter((item) => item.cart_item_id !== id)
            .reduce((sum, item) => sum + parseFloat(item.final_price), 0);

          // Check if coupon minimum cart value is still met
          if (
            appliedCoupon.min_cart_value &&
            newSubtotal < parseFloat(appliedCoupon.min_cart_value)
          ) {
            setAppliedCoupon(null);
            alert(
              `Coupon "${appliedCoupon.code}" has been removed as the cart value is now below the minimum requirement of ₹${appliedCoupon.min_cart_value}`
            );
          }
        }
      } else {
        console.error("Failed to remove cart item:", response?.message);
        alert("Failed to remove item. Please try again.");
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      alert("Failed to remove item. Please try again.");
    } finally {
      // Clear loading state
      setUpdatingItemId(null);
    }
  };

  const handleAddToWishlist = (item) => {
    setSelectedItemForWishlist(item);
    setShowWishlistPopup(true);
  };

  const handleQuantityChange = async (id, delta) => {
    try {
      // Prevent multiple simultaneous updates for the same item
      if (updatingItemId === id) {
        return;
      }

      // Find the current item to get current quantity
      const currentItem = cartItems.find((item) => item.cart_item_id === id);
      if (!currentItem) {
        console.error("Cart item not found");
        return;
      }

      const minQty = currentItem.min_order_quantity || 1;
      const newQuantity = Math.max(minQty, currentItem.total_quantity + delta);

      // Don't make API call if quantity hasn't changed
      if (newQuantity === currentItem.total_quantity) {
        return;
      }

      // Check stock limits
      const stockQuantity =
        currentItem.variant?.stock_quantity ||
        currentItem.product.variant?.stock_quantity ||
        0;
      if (stockQuantity > 0 && newQuantity > stockQuantity) {
        alert(`Only ${stockQuantity} items available in stock`);
        return;
      }

      // Set loading state
      setUpdatingItemId(id);

      // Make API call to update cart item
      const response = await updateApiById(cartItemRoute, id, {
        total_quantity: newQuantity,
      });

      if (response && response.success) {
        // Update local state with the response from backend
        setCartItems((prevItems) =>
          prevItems.map((item) => {
            if (item.cart_item_id === id) {
              return {
                ...item,
                total_quantity: newQuantity,
                final_price: response.data.final_price,
                discount_applied: response.data.discount_applied,
                discount_type: response.data.discount_type,
                discount_quantity: response.data.discount_quantity,
              };
            }
            return item;
          })
        );

        // Check if applied coupon is still valid after cart update
        if (appliedCoupon) {
          // Calculate new subtotal after the update
          const newSubtotal = cartItems.reduce((sum, item) => {
            if (item.cart_item_id === id) {
              return sum + parseFloat(response.data.final_price);
            }
            return sum + parseFloat(item.final_price);
          }, 0);

          // Check if coupon minimum cart value is still met
          if (
            appliedCoupon.min_cart_value &&
            newSubtotal < parseFloat(appliedCoupon.min_cart_value)
          ) {
            setAppliedCoupon(null);
            alert(
              `Coupon "${appliedCoupon.code}" has been removed as the cart value is now below the minimum requirement of ₹${appliedCoupon.min_cart_value}`
            );
          }
        }
      } else {
        console.error("Failed to update cart item:", response?.message);
        alert("Failed to update cart item. Please try again.");
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      alert("Failed to update cart item. Please try again.");
    } finally {
      // Clear loading state
      setUpdatingItemId(null);
    }
  };
  const handleApplyCoupon = () => {
    const found = availableCoupons.find((c) => c.code === couponInput.trim());
    if (found) {
      // Check if coupon is valid for current cart value
      if (found.min_cart_value && subtotal < parseFloat(found.min_cart_value)) {
        alert(
          `Minimum cart value of ₹${found.min_cart_value} required for this coupon`
        );
        return;
      }
      setAppliedCoupon(found);
    } else {
      alert("Invalid coupon code");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        alert("Please login to place an order");
        return;
      }

      // Get user ID from token
      const userId = getUserIdFromToken();
      if (!userId) {
        alert("Invalid user session. Please login again.");
        return;
      }

      // Check if address is selected
      if (!selectedAddress) {
        alert("Please select a delivery address");
        setShowAddressForm(true);
        return;
      }

      // Check if cart has items
      if (cartItems.length === 0) {
        alert("Your cart is empty");
        return;
      }

      // Check if any item is out of stock
      const outOfStockItems = cartItems.filter(
        (item) => !item.product.is_active
      );
      if (outOfStockItems.length > 0) {
        alert("Please remove out of stock items from your cart");
        return;
      }

      // Prepare order data
      const orderData = {
        user_id: userId,
        address_id: selectedAddress.address_id,
        payment_method: "cod", // Default to Cash on Delivery
        subtotal: subtotal,
        shipping_cost: delivery,
        tax_amount: tax,
        discount_amount: discount,
        total_amount: total,
        notes: appliedCoupon ? `Coupon applied: ${appliedCoupon.code}` : "",
      };

      // Add coupon_id if a coupon is applied
      if (appliedCoupon && appliedCoupon.coupon_id) {
        orderData.coupon_id = appliedCoupon.coupon_id;
      }

      // Set loading state
      setLoading(true);

      // Step 1: Create order
      const orderResponse = await createApi(orderRoute, orderData);

      if (orderResponse && orderResponse.success) {
        const orderId = orderResponse.data.order.order_id;
        let allOrderItemsCreated = true;

        // Step 2: Create order items for each cart item
        for (const item of cartItems) {
          try {
            const orderItemData = {
              order_id: orderId,
              product_id: item.product.product_id,
              product_variant_id: item.variant?.product_variant_id || null,
              total_quantity: item.total_quantity,
              discount_quantity: item.discount_quantity || 0,
              price_at_time: item.price_at_time,
              discount_applied: item.discount_applied || 0,
              final_price: item.final_price,
            };

            const orderItemResponse = await createApi(
              orderItemRoute,
              orderItemData
            );

            if (!orderItemResponse || !orderItemResponse.success) {
              console.error(
                "Failed to create order item:",
                orderItemResponse?.message
              );
              allOrderItemsCreated = false;
              break;
            }
          } catch (itemError) {
            console.error("Error creating order item:", itemError);
            allOrderItemsCreated = false;
            break;
          }
        }

        if (!allOrderItemsCreated) {
          alert(
            "Order created but some items could not be processed. Please contact support."
          );
          setLoading(false);
          return;
        }

        try {
          // Clear cart items from local state
          setCartItems([]);
          alert("Order placed successfully!");

          // Redirect to orders page or show confirmation
          window.location.href = "profile/orders";
        } catch (clearCartError) {
          console.error("Error clearing cart:", clearCartError);
          alert("Order placed successfully");
          // Redirect to orders page or show confirmation
          window.location.href = "profile/orders";
        }
      } else {
        alert(
          orderResponse?.message || "Failed to place order. Please try again."
        );
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2 text-red-600">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
          <button
            className="text-blue-600 text-sm hover:underline"
            onClick={() => setShowLogoutPopup(true)}
          >
            Logout
          </button>
        </div>

        {/* Cart Summary Bar */}
        {cartItems.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in
                cart
              </span>
              <span className="text-sm text-gray-600">•</span>
              <span className="text-sm font-medium">
                Subtotal: ₹{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {delivery === 0 ? "Free delivery" : `+₹${delivery} delivery`}
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">
                Cart
              </span>
            </div>
            <div
              className={`w-16 h-1 ${
                selectedAddress ? "bg-blue-600" : "bg-gray-200"
              }`}
            ></div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 ${
                  selectedAddress
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                } rounded-full flex items-center justify-center text-sm ${
                  selectedAddress ? "font-medium" : ""
                }`}
              >
                2
              </div>
              <span
                className={`ml-2 text-sm ${
                  selectedAddress
                    ? "font-medium text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Address
              </span>
            </div>
            <div className="w-16 h-1 bg-gray-200"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm">
                3
              </div>
              <span className="ml-2 text-sm text-gray-500">Payment</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6 flex-1">
        {/* Left: Cart Items */}
        <section className="md:w-2/3 bg-white rounded-lg shadow-md p-6">
          {/* Address */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-1">Deliver to:</h2>
            <div className="bg-gray-50 p-3 rounded border flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <span className="font-semibold">{user?.name || "User"}</span>
                {user?.phone_number && (
                  <>
                    {" | "}
                    {user.phone_number}
                  </>
                )}
                <div className="text-sm text-gray-700">
                  {selectedAddress ? (
                    <>
                      {selectedAddress.address_line1}
                      {selectedAddress.address_line2 &&
                        `, ${selectedAddress.address_line2}`}
                      {`, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.postal_code}, ${selectedAddress.country}`}
                    </>
                  ) : (
                    <span className="text-gray-500">No address selected</span>
                  )}
                </div>
              </div>
              <button
                className="text-blue-600 text-sm mt-2 md:mt-0"
                onClick={() => setShowAddressForm(true)}
              >
                {selectedAddress ? "Change" : "Add Address"}
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="divide-y">
            {cartItems.length === 0 && !loading && (
              <div className="py-8 text-center text-gray-500">
                Your cart is empty
              </div>
            )}
            {cartItems.map((item) => {
              // Extract values from backend model structure
              const priceAtTime = parseFloat(item.price_at_time);
              const quantity = item.total_quantity;
              const isActive = item.product.is_active;
              const finalPrice = parseFloat(item.final_price);
              const discountApplied = item.discount_applied
                ? parseFloat(item.discount_applied)
                : 0;
              const discountType = item.discount_type;
              const stockQuantity =
                item.variant?.stock_quantity ||
                item.product.variant?.stock_quantity ||
                0;
              const minQty = item.min_order_quantity || 1;

              // Calculate individual item price (final price / quantity)
              const itemPrice =
                quantity > 0 ? finalPrice / quantity : priceAtTime;

              // --- NEW: Show next discount message if available ---
              let nextDiscountMsg = null;
              if (
                item.quantity_discount &&
                quantity < item.quantity_discount.threshold
              ) {
                const needed = item.quantity_discount.threshold - quantity;
                if (item.quantity_discount.type === "percentage") {
                  nextDiscountMsg = `Add ${needed} more to get ${item.quantity_discount.value}% off!`;
                } else if (item.quantity_discount.type === "fixed") {
                  nextDiscountMsg = `Add ${needed} more to get ₹${item.quantity_discount.value} off!`;
                }
              } else if (
                item.bulk_discount &&
                quantity < item.bulk_discount.threshold
              ) {
                const needed = item.bulk_discount.threshold - quantity;
                if (item.bulk_discount.type === "percentage") {
                  nextDiscountMsg = `Add ${needed} more to get ${item.bulk_discount.value}% off!`;
                } else if (item.bulk_discount.type === "fixed") {
                  nextDiscountMsg = `Add ${needed} more to get ₹${item.bulk_discount.value} off!`;
                }
              }

              return (
                <div
                  key={item.cart_item_id}
                  className={`flex gap-4 py-6 ${!isActive ? "opacity-60" : ""}`}
                >
                  <img
                    src={
                      item.variant?.base_variant_image_url ||
                      item.product.mainImage ||
                      item.product.media?.[0]?.ProductMediaURLs?.[0]
                        ?.product_media_url ||
                      "/assets/placeholder.jpg"
                    }
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        {item.product.name}
                      </h3>
                      <span className="text-xs bg-gray-200 rounded px-2 py-1">
                        {item.product.brand.name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {item.product.short_description}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      Category: {item.product.category?.name}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      Variant:{" "}
                      {item.variant?.short_description ||
                        item.product.variant?.short_description}
                      {(item.variant?.sku || item.product.variant?.sku) && (
                        <span className="ml-2">
                          SKU: {item.variant?.sku || item.product.variant?.sku}
                        </span>
                      )}
                    </div>
                    {/* Display variant attributes */}
                    {item.variant?.attributes && (
                      <div className="text-xs text-gray-500 mb-2">
                        {Object.entries(item.variant.attributes).map(
                          ([key, value]) => (
                            <span key={key} className="mr-2">
                              {key}: {value}
                            </span>
                          )
                        )}
                      </div>
                    )}
                    {/* Product and Variant Reviews */}
                    <div className="text-xs text-gray-500 mb-2">
                      {(item.product.rating_average > 0 ||
                        item.product.rating_count > 0) && (
                        <div className="flex items-center gap-2 mb-1">
                          <span>⭐ {item.product.rating_average || "0.0"}</span>
                          <span>
                            ({item.product.rating_count} total reviews)
                          </span>
                        </div>
                      )}

                      {/* Show recent product reviews */}
                      {item.product.reviews &&
                        item.product.reviews.length > 0 && (
                          <div className="mt-1">
                            <details className="cursor-pointer">
                              <summary className="text-blue-600 hover:underline">
                                View {item.product.reviews.length} recent
                                product reviews
                              </summary>
                              <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                                {item.product.reviews.map((review) => (
                                  <div
                                    key={review.product_review_id}
                                    className="bg-gray-50 p-2 rounded text-xs"
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <span>⭐ {review.rating}/5</span>
                                      <span className="font-medium">
                                        {review.reviewer?.name}
                                      </span>
                                      {review.is_verified_purchase && (
                                        <span className="bg-green-100 text-green-800 px-1 rounded">
                                          Verified
                                        </span>
                                      )}
                                    </div>
                                    {review.title && (
                                      <div className="font-medium mb-1">
                                        {review.title}
                                      </div>
                                    )}
                                    {review.review && (
                                      <div className="text-gray-600">
                                        {review.review}
                                      </div>
                                    )}
                                    <div className="text-gray-400 mt-1">
                                      {new Date(
                                        review.createdAt
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </details>
                          </div>
                        )}

                      {/* Show variant-specific reviews */}
                      {item.variant?.ProductReviews &&
                        item.variant.ProductReviews.length > 0 && (
                          <div className="mt-2">
                            <details className="cursor-pointer">
                              <summary className="text-purple-600 hover:underline">
                                View {item.variant.ProductReviews.length}{" "}
                                variant-specific reviews
                              </summary>
                              <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                                {item.variant.ProductReviews.map((review) => (
                                  <div
                                    key={review.product_review_id}
                                    className="bg-purple-50 p-2 rounded text-xs"
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <span>⭐ {review.rating}/5</span>
                                      <span className="font-medium">
                                        {review.reviewer?.name}
                                      </span>
                                      <span className="bg-purple-100 text-purple-800 px-1 rounded">
                                        Variant
                                      </span>
                                      {review.is_verified_purchase && (
                                        <span className="bg-green-100 text-green-800 px-1 rounded">
                                          Verified
                                        </span>
                                      )}
                                    </div>
                                    {review.title && (
                                      <div className="font-medium mb-1">
                                        {review.title}
                                      </div>
                                    )}
                                    {review.review && (
                                      <div className="text-gray-600">
                                        {review.review}
                                      </div>
                                    )}
                                    <div className="text-gray-400 mt-1">
                                      {new Date(
                                        review.createdAt
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </details>
                          </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-lg">
                          ₹{itemPrice.toLocaleString()}
                        </span>
                        {discountApplied > 0 && (
                          <span className="text-xs text-green-600">
                            {discountType === "percentage"
                              ? `₹${discountApplied} off`
                              : `₹${discountApplied} off`}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center border rounded">
                        <button
                          className={`px-2 py-1 text-gray-600 hover:bg-gray-100 ${
                            updatingItemId === item.cart_item_id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() =>
                            handleQuantityChange(item.cart_item_id, -1)
                          }
                          disabled={
                            quantity <= minQty ||
                            updatingItemId === item.cart_item_id
                          }
                        >
                          {updatingItemId === item.cart_item_id ? "..." : "−"}
                        </button>
                        <span className="px-3 py-1 min-w-[40px] text-center">
                          {updatingItemId === item.cart_item_id ? (
                            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                          ) : (
                            quantity
                          )}
                        </span>
                        <button
                          className={`px-2 py-1 text-gray-600 hover:bg-gray-100 ${
                            updatingItemId === item.cart_item_id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() =>
                            handleQuantityChange(item.cart_item_id, 1)
                          }
                          disabled={
                            !isActive ||
                            (stockQuantity > 0 && quantity >= stockQuantity) ||
                            updatingItemId === item.cart_item_id
                          }
                        >
                          {updatingItemId === item.cart_item_id ? "..." : "+"}
                        </button>
                      </div>
                      <span className="ml-auto font-semibold">
                        ₹{finalPrice.toLocaleString()}
                      </span>
                    </div>
                    {!isActive && (
                      <div className="text-red-600 text-xs mt-2">
                        Out of Stock
                      </div>
                    )}
                    {isActive && stockQuantity <= 5 && stockQuantity > 0 && (
                      <div className="text-orange-600 text-xs mt-2">
                        Only {stockQuantity} left in stock
                      </div>
                    )}
                    {item.discount_quantity &&
                      quantity >= item.discount_quantity && (
                        <div className="text-green-600 text-xs mt-2">
                          Bulk discount applied!
                          {item.product.variant?.bulk_discount_quantity &&
                            quantity >=
                              item.product.variant.bulk_discount_quantity && (
                              <span className="ml-1">
                                (Bulk:{" "}
                                {item.product.variant.bulk_discount_percentage}%
                                off)
                              </span>
                            )}
                        </div>
                      )}
                    {nextDiscountMsg && (
                      <div className="text-blue-600 text-xs mt-2">
                        {nextDiscountMsg}
                      </div>
                    )}
                    <div className="flex gap-4 mt-3">
                      <button
                        className="text-purple-600 text-sm hover:underline"
                        onClick={() => handleAddToWishlist(item)}
                      >
                        Add to Wishlist
                      </button>
                      <button
                        className="text-red-600 text-sm hover:underline disabled:opacity-50"
                        onClick={() => handleRemove(item.cart_item_id)}
                        disabled={updatingItemId === item.cart_item_id}
                      >
                        {updatingItemId === item.cart_item_id
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right: Price Details & Coupon */}
        <section className="md:w-1/3 flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Price Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-600">
                  -₹{discount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{delivery === 0 ? "Free" : `₹${delivery}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (GST 18%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2 text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500">
                Estimated delivery: {estimatedDelivery}
              </div>
            </div>
            <button
              className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              onClick={handlePlaceOrder}
              disabled={loading || cartItems.length === 0 || !selectedAddress}
            >
              {loading ? "PROCESSING..." : "PLACE ORDER"}
            </button>
            {discount > 0 && (
              <p className="text-green-600 text-sm mt-4">
                You will save ₹{discount.toLocaleString()} on this order
              </p>
            )}

            {/* Coupon Section */}
            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold mb-2">Apply Coupon</h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter cart coupon code"
                  className="flex-1 border rounded px-3 py-2 text-sm"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-gray-200 px-3 py-2 rounded text-sm hover:bg-gray-300"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div className="mt-2 bg-green-50 border border-green-200 p-2 rounded flex justify-between items-center">
                  <div>
                    <span className="text-green-700 font-medium">
                      {appliedCoupon.code}
                    </span>
                    <p className="text-xs text-green-600">
                      {appliedCoupon.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-xs text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Secure Info */}
          <div className="text-sm text-gray-600 mt-2 flex flex-col gap-1 items-center">
            <span>🔒 Safe & secure payments</span>
            <span>↩️ Easy returns</span>
            <span>✅ 100% Authentic products</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner p-4 text-center text-gray-500 text-sm">
        © 2023 Electronics Store. All rights reserved.
      </footer>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout? Your cart items will be saved.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                onClick={() => setShowLogoutPopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  // Logout logic would go here
                  setShowLogoutPopup(false);
                  // Redirect to login page or perform actual logout
                  alert("Logged out successfully");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Form Popup */}
      <AddressForm
        isOpen={showAddressForm}
        onClose={() => {
          setShowAddressForm(false);
          // Alert if no address is selected when closing the form
          if (!selectedAddress) {
            alert("Please select an address to continue with your order.");
          }
        }}
        onAddressSelect={(address) => {
          setSelectedAddress(address);
          setShowAddressForm(false);
        }}
        selectedAddressId={selectedAddress?.address_id}
        mode="select"
      />

      {/* Wishlist Confirmation Popup */}
      {showWishlistPopup && selectedItemForWishlist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Add to Wishlist</h3>
            <div className="flex gap-3 mb-4">
              <img
                src={
                  selectedItemForWishlist.variant?.base_variant_image_url ||
                  selectedItemForWishlist.product.mainImage ||
                  selectedItemForWishlist.product.media?.[0]
                    ?.ProductMediaURLs?.[0]?.product_media_url ||
                  "/assets/placeholder.jpg"
                }
                alt={selectedItemForWishlist.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h4 className="font-medium">
                  {selectedItemForWishlist.product.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {selectedItemForWishlist.product.short_description}
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Do you want to add this item to your wishlist and remove it from
              cart?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                onClick={() => {
                  setShowWishlistPopup(false);
                  setSelectedItemForWishlist(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={() => {
                  // Add to wishlist logic would go here
                  handleRemove(selectedItemForWishlist.cart_item_id);
                  setShowWishlistPopup(false);
                  setSelectedItemForWishlist(null);
                  alert("Item added to wishlist!");
                }}
              >
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty Cart State */}
      {cartItems.length === 0 && (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
