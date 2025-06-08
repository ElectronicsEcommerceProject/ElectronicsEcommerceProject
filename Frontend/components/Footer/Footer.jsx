import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcStripe } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-8 pb-4 px-4 sm:px-6 md:px-8 mt-3">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Company Info & Social Icons */}
        <div>
          <h3 className="text-base font-bold mb-3 flex items-center">
            <span className="w-5 h-5 bg-white mr-2 rounded-sm"></span>
            ShopEase
          </h3>
          <p className="text-xs text-gray-300 mb-3">
            Your trusted destination for quality electronics and gadgets since 2015.
          </p>
          <div className="flex space-x-3 mb-3">
            <a href="#" className="text-gray-300 hover:text-white">
              <FaFacebookF size={16} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaTwitter size={16} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaInstagram size={16} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaLinkedinIn size={16} />
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
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="font-bold text-base mb-3">Customer Service</h4>
          <ul className="space-y-1 text-xs text-gray-300">
            <li><a href="#" className="hover:text-white">FAQs</a></li>
            <li><a href="#" className="hover:text-white">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-white">Return Policy</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
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
              <span>123 Tech Park, Electronic City, Bangalore 560100</span>
            </div>
            <div className="flex items-center">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+919876543210">+91 98765 43210</a>
            </div>
            <div className="flex items-center">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:support@shopease.com">support@shopease.com</a>
            </div>
          </address>
        </div>
      </div>

      {/* Payment Icons (Aligned to the right) */}
      <div className="max-w-7xl mx-auto flex justify-end gap-4 mt-4">
        <FaCcVisa className="text-blue-500 text-2xl" />
        <FaCcMastercard className="text-red-600 text-2xl" />
        <FaCcPaypal className="text-blue-400 text-2xl" />
        <FaCcStripe className="text-indigo-600 text-2xl" />
        <span className="text-green-500 text-2xl">₹</span>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-6 mt-4 border-t border-gray-700 text-center text-xs text-gray-400 px-4 sm:px-6">
        © {new Date().getFullYear()} ShopEase. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;