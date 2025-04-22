import React, { useEffect, useState } from "react";
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
} from "../services/cartAPI";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaTrashAlt, FaShoppingCart } from "react-icons/fa";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCartItems(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load cart", error);
    }
  };

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1) return;
    await updateCartQuantity(productId, newQty);
    fetchCart();
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    fetchCart();
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + item.Product.price * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaShoppingCart className="text-blue-600" /> Your Cart
      </h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map(({ Cart, Product }) => (
              <div
                key={Cart.cart_id}
                className="flex items-center justify-between bg-white p-4 shadow rounded-lg"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={Product.image_url}
                    alt={Product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h4 className="text-lg font-semibold">{Product.name}</h4>
                    <p className="text-gray-600">₹{Product.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        Product.product_id,
                        Cart.quantity - 1
                      )
                    }
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    <FaMinus />
                  </button>
                  <span className="px-3">{Cart.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        Product.product_id,
                        Cart.quantity + 1
                      )
                    }
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    <FaPlus />
                  </button>
                </div>
                <div>
                  <p className="text-md font-semibold">
                    ₹{Product.price * Cart.quantity}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(Product.product_id)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded shadow space-y-4">
            <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
            <p className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{calculateSubtotal()}</span>
            </p>
            <p className="flex justify-between">
              <span>Delivery</span>
              <span>₹0</span>
            </p>
            <hr />
            <p className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{calculateSubtotal()}</span>
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
            >
              <FaShoppingCart /> Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
