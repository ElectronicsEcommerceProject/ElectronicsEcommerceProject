import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartAsync,
  updateCartItemAsync,
  removeFromCartAsync,
  selectCartItems,
  selectCartLoading,
  selectCartError,
  selectUpdatingItem,
  selectRemovingItem,
  selectCartTotalItems,
  selectCartTotalPrice,
} from "../Redux/cartSlice";

const CartPage = () => {
  const { useState, useEffect } = React;

  // Redux hooks
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const updatingItem = useSelector(selectUpdatingItem);
  const removingItem = useSelector(selectRemovingItem);
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const [pincode, setPincode] = useState("");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [priceDetails, setPriceDetails] = useState({
    price: 0,
    discount: 0,
    buyMoreSave: 0,
    coupons: 0,
    delivery: 0,
  });

  // Fetch cart data on component mount
  useEffect(() => {
    dispatch(fetchCartAsync());
  }, [dispatch]);

  // Update price details when cart items change
  useEffect(() => {
    if (cartItems.length > 0) {
      const calculatedPrice = cartItems.reduce((sum, item) => {
        const price = item.Product?.price || 0;
        return sum + price * item.quantity;
      }, 0);

      setPriceDetails((prev) => ({
        ...prev,
        price: calculatedPrice,
      }));
    }
  }, [cartItems]);

  const total =
    priceDetails.price -
    priceDetails.discount -
    priceDetails.buyMoreSave -
    priceDetails.coupons +
    priceDetails.delivery;
  const savings =
    priceDetails.discount + priceDetails.buyMoreSave + priceDetails.coupons;

  const handleCheckPincode = () => {
    if (/^\d{6}$/.test(pincode)) {
      alert(`Checking stock for pincode: ${pincode}`); // Replace with API call
    } else {
      alert("Please enter a valid 6-digit pincode");
    }
  };

  const handlePlaceOrder = () => {
    const inStockItems = cartItems.filter((item) => item.Product?.is_active);
    if (cartItems.length === 0) {
      alert("Your cart is empty");
    } else if (inStockItems.length !== cartItems.length) {
      alert("Cannot place order with out-of-stock items");
    } else {
      alert("Order placed successfully!"); // Replace with API call
    }
  };

  const handleSaveForLater = (productId) => {
    alert(`Saved product ${productId} for later`); // Implement save logic
  };

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeFromCartAsync(productId)).unwrap();
      alert(`Product removed from cart`);
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert(`Failed to remove item: ${error}`);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await dispatch(
        updateCartItemAsync({ productId, quantity: newQuantity })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert(`Failed to update quantity: ${error}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Cart</h1>
        <button
          className="text-blue-600 text-sm"
          onClick={() => setShowLogoutPopup(true)}
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6 flex-1">
        {/* Left Section: Product List (Scrollable) */}
        <section className="md:w-2/3 bg-white rounded-lg shadow-md p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              From Saved Addresses
            </h2>
            <div>
              <input
                type="text"
                placeholder="Enter pincode"
                className="px-2 py-1 border rounded text-sm w-32"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button
                className="text-blue-600 text-sm ml-2"
                onClick={handleCheckPincode}
              >
                Check
              </button>
            </div>
          </div>

          {/* Product List - Scrollable Area */}
          <div
            className="product-list"
            style={{
              maxHeight: "calc(100vh - 200px)",
              overflowY: "scroll",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {loading && <div className="text-center py-4">Loading cart...</div>}
            {error && (
              <div className="text-red-600 text-center py-4">{error}</div>
            )}
            {!loading && !error && cartItems.length === 0 && (
              <div className="text-center py-4">Your cart is empty</div>
            )}

            {/* In-stock Products */}
            {cartItems
              .filter((item) => item.Product?.is_active !== false)
              .map((item) => {
                const product = item.Product || {};
                return (
                  <div
                    key={item.cart_id || item.product_id}
                    className="border-b py-4"
                  >
                    <div className="flex gap-4">
                      <img
                        src={
                          product.mainImage ||
                          product.image ||
                          "https://via.placeholder.com/100"
                        }
                        alt={product.name || product.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">
                          {product.name || product.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {product.description || "No description available"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Delivery by:{" "}
                          {new Date(
                            Date.now() + 3 * 24 * 60 * 60 * 1000
                          ).toLocaleDateString()}{" "}
                          | Seller: {product.brand?.name || "Store"}
                        </p>

                        {/* Price and Quantity */}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-lg">
                              ₹{product.price?.toLocaleString() || "0"}
                            </span>

                            {/* Quantity Selector */}
                            <div className="flex items-center border border-gray-300 rounded">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product_id,
                                    item.quantity - 1
                                  )
                                }
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                disabled={
                                  item.quantity <= 1 ||
                                  updatingItem === item.product_id
                                }
                              >
                                −
                              </button>
                              <span className="px-3 py-1 text-center min-w-[40px]">
                                {updatingItem === item.product_id
                                  ? "..."
                                  : item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product_id,
                                    item.quantity + 1
                                  )
                                }
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                disabled={updatingItem === item.product_id}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold">
                              ₹
                              {(
                                (product.price || 0) * item.quantity
                              ).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">Total</p>
                          </div>
                        </div>

                        <div className="mt-2 flex space-x-4">
                          <button
                            className="text-blue-600 text-sm"
                            onClick={() => handleSaveForLater(item.product_id)}
                          >
                            Save for Later
                          </button>
                          <button
                            className="text-red-600 text-sm"
                            onClick={() => handleRemove(item.product_id)}
                            disabled={removingItem === item.product_id}
                          >
                            {removingItem === item.product_id
                              ? "Removing..."
                              : "Remove"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Fixed Place Order Button */}
            <div
              className="place-order-fixed"
              style={{
                position: "sticky",
                bottom: 0,
                background: "white",
                padding: "1rem",
                textAlign: "right",
                zIndex: 10,
              }}
            >
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                onClick={handlePlaceOrder}
              >
                PLACE ORDER
              </button>
            </div>

            {/* Out of Stock Items */}
            {cartItems
              .filter((item) => item.Product?.is_active === false)
              .map((item) => {
                const product = item.Product || {};
                return (
                  <div key={item.cart_id || item.product_id} className="py-4">
                    <div className="flex gap-4">
                      <img
                        src={
                          product.mainImage ||
                          product.image ||
                          "https://via.placeholder.com/100"
                        }
                        alt={product.name || product.title}
                        className="w-24 h-24 object-cover rounded opacity-50"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-500">
                          {product.name || product.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {product.description || "No description available"}
                        </p>
                        <p className="text-sm text-red-600">Out of Stock</p>
                        <div className="mt-2 flex space-x-4">
                          <button
                            className="text-blue-600 text-sm"
                            onClick={() => handleSaveForLater(item.product_id)}
                          >
                            Save for Later
                          </button>
                          <button
                            className="text-red-600 text-sm"
                            onClick={() => handleRemove(item.product_id)}
                            disabled={removingItem === item.product_id}
                          >
                            {removingItem === item.product_id
                              ? "Removing..."
                              : "Remove"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* Right Section: Price Details (Fixed) */}
        <section className="md:w-1/3 flex flex-col">
          <div
            className="price-details bg-white rounded-lg shadow-md p-6"
            style={{ position: "sticky", top: 0 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Price Details
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>
                  Price (
                  {
                    cartItems.filter(
                      (item) => item.Product?.is_active !== false
                    ).length
                  }{" "}
                  items)
                </span>
                <span>₹{priceDetails.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-₹{priceDetails.discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Buy More, Save More</span>
                <span>-₹{priceDetails.buyMoreSave.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Coupons</span>
                <span>-₹{priceDetails.coupons.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-green-600 text-sm mt-4">
              You will save ₹{savings.toLocaleString()} on this order
            </p>
          </div>

          {/* Secure Info Box */}
          <div className="secure-info text-sm text-gray-600 mt-4 flex justify-center gap-6">
            <p className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
              </svg>
              Safe & secure payments
            </p>
            <p className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
              </svg>
              Easy returns
            </p>
            <p className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
              </svg>
              100% Authentic products
            </p>
          </div>
        </section>
      </main>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
                onClick={() => {
                  alert("Logged out successfully!"); // Replace with logout logic
                  setShowLogoutPopup(false);
                }}
              >
                Confirm
              </button>
              <button
                className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400"
                onClick={() => setShowLogoutPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
