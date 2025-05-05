import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserCircle,
  FaTachometerAlt,
  FaBoxOpen,
  FaUserEdit,
  FaCreditCard,
  FaMapMarkerAlt,
  FaBell,
  FaShieldAlt,
  FaSignOutAlt,
  FaPlusCircle // For "Add Product"
} from 'react-icons/fa';
 
const RetailerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/retailer/dashboard', icon: <FaTachometerAlt />, color: '#4f46e5' },
    { name: 'Orders', path: '/retailer/orders', icon: <FaBoxOpen />, color: '#16a34a' },
    { name: 'Edit Profile', path: '/retailer/profile', icon: <FaUserEdit />, color: '#0ea5e9' },
    { name: 'Saved Cards', path: '/retailer/cards', icon: <FaCreditCard />, color: '#eab308' },
    { name: 'Addresses', path: '/retailer/addresses', icon: <FaMapMarkerAlt />, color: '#ec4899' },
    { name: 'Notifications', path: '/retailer/notifications', icon: <FaBell />, color: '#f97316' },
    { name: 'Privacy Settings', path: '/retailer/privacy', icon: <FaShieldAlt />, color: '#14b8a6' },
    { name: 'Logout', path: '/retailer/logout', icon: <FaSignOutAlt />, color: '#ef4444' },
    { name: 'Add Product', path: '/retailer/add-product', icon: <FaPlusCircle />, color: '#3b82f6' }, // Add Product
  ];

  return (
    <div className="retailer-menu-container" ref={menuRef}>
      <button onClick={toggleMenu} className="menu-icon-button">
        <FaUserCircle size={30} />
      </button>

      <div className={`retailer-menu ${isOpen ? 'open' : ''}`}>
        {menuItems.map((item) => (
          <Link key={item.name} to={item.path} className="retailer-menu-item">
            <span className="menu-icon" style={{ color: item.color }}>{item.icon}</span>
            <span className="menu-label">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RetailerMenu;
