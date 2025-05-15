import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProfileDropDown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isLocked &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setIsLocked(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLocked]);

  const handleMouseEnter = () => {
    if (!isLocked) setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    if (!isLocked) setShowDropdown(false);
  };

  const handleClick = () => {
    setShowDropdown(true);
    setIsLocked(true);
  };

  const handleLogout = () => {
    // Perform logout logic here
    console.log("User logged out");
    setShowLogoutConfirm(false);
    setShowDropdown(false);
    setIsLocked(false);
  };

  return (
    <>
      <div
        className="relative"
        ref={dropdownRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className="text-2xl focus:outline-none cursor-pointer transition duration-200 hover:text-blue-600"
          onClick={handleClick}
        >
          👤
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 shadow-xl rounded-lg z-50 border border-gray-200">
            <DropdownItem to="/profile?section=profile" text="My Profile" />
            <DropdownItem to="/profile?section=orders" text="My Orders" />
            <DropdownItem to="/profile?section=wishlist" text="Wishlist" />
            <DropdownItem to="/profile?section=addresses" text="Saved Addresses" />
            <DropdownItem to="/profile?section=coupons" text="Coupons" />
            <DropdownItem to="/profile?section=giftcards" text="Gift Cards" />
            <DropdownItem to="/profile?section=supercoins" text="SuperCoins" />
            <DropdownItem to="/profile?section=reviews" text="Reviews & Ratings" />
            <DropdownItem to="/profile?section=notifications" text="Notifications" />
            <DropdownItem to="/profile?section=security" text="Security" />
            <button
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition duration-150 rounded-b"
              onClick={() => setShowLogoutConfirm(true)}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DropdownItem = ({ to, text }) => (
  <Link
    to={to}
    className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition duration-150"
  >
    {text}
  </Link>
);

export default ProfileDropDown;
