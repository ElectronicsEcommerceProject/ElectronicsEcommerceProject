// CartPage.jsx
import React, { useState } from 'react';
import CartItem from './CartItem';
import { FaShoppingCart } from 'react-icons/fa';

const CustomerCartSummary = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Bluetooth Headphones',
      image: '/images/headphones.jpg',
      price: 1500,
      quantity: 1,
      stock: 10,
      rating: 4.2,
    },
    {
      id: 2,
      name: 'Smartwatch',
      image: '/images/smartwatch.jpg',
      price: 2200,
      quantity: 2,
      stock: 0,
      rating: 3.8,
    },
  ]);

  const [showIconPop, setShowIconPop] = useState(false);

  const handleQuantityChange = (item, newQty) => {
    const updated = cartItems.map((cartItem) =>
      cartItem.id === item.id ? { ...cartItem, quantity: newQty } : cartItem
    );
    setCartItems(updated);
  };

  const handleRemove = (itemToRemove) => {
    const updated = cartItems.filter((item) => item.id !== itemToRemove.id);
    setCartItems(updated);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Fake pop trigger for example
  const handleAddToCart = () => {
    setShowIconPop(true);
    setTimeout(() => setShowIconPop(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6 relative">
        <button onClick={handleAddToCart} className="relative">
          <FaShoppingCart size={28} />
          {showIconPop && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-bounce">
              +1
            </span>
          )}
        </button>
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          ))}

          <div className="flex justify-between items-center pt-4 border-t mt-6">
            <p className="text-xl font-semibold">Total: ₹{totalPrice.toFixed(2)}</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCartSummary;
