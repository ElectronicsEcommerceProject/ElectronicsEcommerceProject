import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp, FaPhone } from 'react-icons/fa';
import { FiMail, FiMapPin, FiClock, FiShield } from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcStripe } from 'react-icons/fa';

const Footer = () => {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactClick = () => {
    setShowContactModal(true);
  };

  return (
    <footer className="bg-gray-800 text-white pt-8 pb-4 px-4 sm:px-6 md:px-8 mt-3">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Company Info & Social Icons */}
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center text-orange-400">
            <FiShield className="mr-2" size={20} />
            MAA LAXMI STORE
          </h3>
          <p className="text-xs text-gray-300 mb-3">
            Your trusted partner for quality electronics and gadgets. Serving customers with excellence since 2020.
          </p>
          <div className="flex items-center text-xs text-gray-300 mb-3">
            <FiClock className="mr-2" size={14} />
            <span>Mon-Sat: 9AM-8PM | Sun: 10AM-6PM</span>
          </div>
          <div className="flex space-x-3 mb-3">
            <a href="https://wa.me/919973061020" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">
              <FaWhatsapp size={18} />
            </a>
            <a href="#" className="text-blue-500 hover:text-blue-400">
              <FaFacebookF size={16} />
            </a>
            <a href="#" className="text-pink-500 hover:text-pink-400">
              <FaInstagram size={16} />
            </a>
            <a href="tel:+919973061020" className="text-blue-400 hover:text-blue-300">
              <FaPhone size={16} />
            </a>
          </div>

          {/* Email Subscription */}
          <form className="flex flex-col sm:flex-row gap-2 max-w-xs mx-auto">
            <div className="relative flex-1">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                placeholder="Your email"
                className="w-full pl-9 pr-3 py-1 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-base mb-3">Quick Links</h4>
          <ul className="space-y-1 text-xs text-gray-300">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Products</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
            <li><button onClick={handleContactClick} className="hover:text-white text-left">Contact</button></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="font-bold text-base mb-3">Customer Service</h4>
          <ul className="space-y-1 text-xs text-gray-300">
            <li><a href="#" className="hover:text-white">Help & Support</a></li>
            <li><a href="#" className="hover:text-white">Track Your Order</a></li>
            <li><a href="#" className="hover:text-white">Return & Exchange</a></li>
            <li><a href="#" className="hover:text-white">Warranty Info</a></li>
            <li><a href="#" className="hover:text-white">Bulk Orders</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-bold text-base mb-3">Contact Us</h4>
          <address className="not-italic text-xs text-gray-300 space-y-2">
            <div className="flex items-start">
              <svg className="h-4 w-4 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>East Ramkrishna Nagar, sorangpur (chauraha), Patna 27</span>
            </div>
            <div className="flex items-center">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+919973061020">+919973061020</a>
            </div>
            <div className="flex items-center">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:maalaxmistore99@gmail.com">maalaxmistore99@gmail.com</a>
            </div>
          </address>
        </div>
      </div>

      {/* Payment & Security Info */}
      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FiShield size={16} />
            <span>100% Secure Payments | Authentic Products | Fast Delivery</span>
          </div>
          <div className="flex gap-3">
            <span className="text-green-500 text-xl font-bold">₹</span>
            <span className="text-blue-600 text-sm font-semibold">COD</span>
            <FaCcVisa className="text-blue-500 text-xl" />
            <FaCcMastercard className="text-red-600 text-xl" />
            <span className="text-purple-500 text-sm font-semibold">UPI</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-4 text-center text-xs text-gray-400 px-4 sm:px-6">
        © {new Date().getFullYear()} MAA LAXMI STORE. All rights reserved. | Designed with ❤️ for our customers
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Contact MAA LAXMI STORE</h3>
              <button 
                onClick={() => setShowContactModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <FaWhatsapp className="text-green-500" size={20} />
                <div>
                  <p className="font-semibold text-gray-800">WhatsApp</p>
                  <a href="https://wa.me/919973061020" target="_blank" rel="noopener noreferrer" 
                     className="text-green-600 hover:underline">+919973061020</a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <FaPhone className="text-blue-500" size={20} />
                <div>
                  <p className="font-semibold text-gray-800">Call Us</p>
                  <a href="tel:+919973061020" className="text-blue-600 hover:underline">+919973061020</a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <FiMail className="text-orange-500" size={20} />
                <div>
                  <p className="font-semibold text-gray-800">Email</p>
                  <a href="mailto:maalaxmistore99@gmail.com" className="text-orange-600 hover:underline">maalaxmistore99@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <FiMapPin className="text-purple-500 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-gray-800">Visit Us</p>
                  <p className="text-purple-600 text-sm">East Ramkrishna Nagar, sorangpur (chauraha), Patna 27</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button 
                onClick={() => setShowContactModal(false)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;