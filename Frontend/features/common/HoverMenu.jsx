import React, { useState, useRef } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';

const HoverMenu = () => {
  const [modalContent, setModalContent] = useState("menu");
  const modalRef = useRef(null);

  const menuItems = [
    { id: 'orders', label: 'Orders', icon: '🛍️' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
    { id: 'profile', label: 'Profile', icon: '🙍‍♂️' },
    { id: 'address', label: 'Address', icon: '📍' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'giftcards', label: 'Gift Cards', icon: '🎁' },
  ];

  return (
    <div
      ref={modalRef}
      className="bg-white shadow-lg rounded-md w-64 max-w-[90vw] z-50 border border-gray-200"
    >
      <div className="absolute -top-2 right-4 w-4 h-4 transform rotate-45 bg-white border-t border-l border-gray-200"></div>

      {modalContent === "menu" ? (
        <div className="py-2">
          {/* Top Row: Customer and Sign Up */}
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <span
              className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800"
              onClick={() => setModalContent("login")}
            >
              Login
            </span>
            <a
              href="/register"
              className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800"
            >
              Sign Up
            </a>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2 transition-all"
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-sm text-gray-800">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {/* Top Row: Login and Sign Up */}
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-sm font-medium text-blue-600">Customer</span>
            <a
              href="/register"
              className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800"
            >
              Sign Up
            </a>
          </div>

          {/* Login Form */}
          <form className="space-y-2">
            <input
              type="text"
              placeholder="Email or Mobile"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>

          {/* Social Buttons */}
          <div className="space-y-2 pt-1">
         <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-1.5 text-sm rounded-md hover:bg-gray-50 transition-colors">
  <FcGoogle className="text-xl shrink-0" />
  <span className="text-sm text-gray-800 whitespace-nowrap">Login with Google</span>
</button>

            <button className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 py-1.5 text-sm rounded-md hover:bg-blue-50 transition-colors">
              <FaFacebookF className="text-base" />
              <span>Login with Facebook</span>
            </button>
          </div>

          {/* Back Button */}
          <div className="pt-1 text-center">
            <button
              onClick={() => setModalContent("menu")}
              className="text-blue-600 text-xs underline hover:text-blue-800"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoverMenu;
