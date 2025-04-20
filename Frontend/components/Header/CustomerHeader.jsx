import React, { useState } from 'react';
import logo from '../../assets/logo1.png';

const CustomerHeader = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="customer-header">
      <div className="header-top">
        <div className="logo-container">
          <div className="logo-circle">
            <img src={logo} alt="Maa Lakshmi Logo" className="logo-image" />
          </div>
          <span className="brand-name">Maa Lakshmi Electronics</span>
        </div>
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for Products, Brands and More"
              className="search-input"
            />
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 10-.7.7l.27.28v.79l5 5 1.5-1.5-5-5zm-6 0a5 5 0 110-10 5 5 0 010 10z"
              />
            </svg>
          </div>
        </div>
        <div className="user-actions">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="account-button"
          >
            <svg className="account-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
            <span className="account-text">Account</span>
          </button>
          <button className="cart-button">
            <svg className="cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="cart-count">1</span>
          </button>
        </div>
      </div>
      <nav className="nav-categories">
        <ul className="nav-list">
          <li className="nav-item">Kilos</li>
          <li className="nav-item">Appliances</li>
          <li className="nav-item">Flight Bookings</li>
          <li className="nav-item">Beauty, Toys & More <span className="dropdown-arrow">▼</span></li>
          <li className="nav-item">Fashion <span className="dropdown-arrow">▼</span></li>
          <li className="nav-item">Mobiles</li>
          <li className="nav-item">Electronics <span className="dropdown-arrow">▼</span></li>
          <li className="nav-item">Home & Furniture <span className="dropdown-arrow">▼</span></li>
        </ul>
      </nav>
    </header>
  );
};

export default CustomerHeader;