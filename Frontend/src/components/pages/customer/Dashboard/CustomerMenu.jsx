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
  FaSignOutAlt
} from 'react-icons/fa';
 
const CustomerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

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
    { name: 'Dashboard', path: '/customer/dashboard', icon: <FaTachometerAlt />, color: '#4f46e5' },
    { name: 'Orders', path: '/customer/orders', icon: <FaBoxOpen />, color: '#16a34a' },
    { name: 'Edit Profile', path: '/customer/profile', icon: <FaUserEdit />, color: '#0ea5e9' },
    { name: 'Saved Cards', path: '/customer/cards', icon: <FaCreditCard />, color: '#eab308' },
    { name: 'Addresses', path: '/customer/addresses', icon: <FaMapMarkerAlt />, color: '#ec4899' },
    { name: 'Notifications', path: '/customer/notifications', icon: <FaBell />, color: '#f97316' },
    { name: 'Privacy Settings', path: '/customer/privacy', icon: <FaShieldAlt />, color: '#14b8a6' },
    { name: 'Logout', path: '/customer/logout', icon: <FaSignOutAlt />, color: '#ef4444' },
  ];

  return (
    <div className="customer-menu-container" ref={menuRef}>
      <button onClick={toggleMenu} className="menu-icon-button">
        <FaUserCircle size={30} />
      </button>

      <div className={`customer-menu ${isOpen ? 'open' : ''}`}>
        {menuItems.map((item) => (
          <Link key={item.name} to={item.path} className="customer-menu-item">
            <span className="menu-icon" style={{ color: item.color }}>{item.icon}</span>
            <span className="menu-label">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CustomerMenu;
