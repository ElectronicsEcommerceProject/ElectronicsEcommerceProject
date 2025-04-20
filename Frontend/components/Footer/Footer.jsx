import React from 'react';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="utility-bar">
        <div className="utility-content">
          <div className="utility-contact">
            <span>Call: +91 7485000001</span>
            <span>Tech Support: 10:00 AM - 7:00 PM</span>
          </div>
          <div className="utility-email">
            <span>Email: support@maalakshmielectronics.com</span>
          </div>
        </div>
      </div>
      <div className="footer-sections">
        <div className="footer-column">
          <h4 className="footer-heading">About Us</h4>
          <ul className="footer-list">
            <li><a href="#" className="footer-link">Company Info</a></li>
            <li><a href="#" className="footer-link">Vision</a></li>
            <li><a href="#" className="footer-link">Careers</a></li>
            <li><a href="#" className="footer-link">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">Categories</h4>
          <ul className="footer-list">
            <li><a href="#" className="footer-link">Apple Laptops</a></li>
            <li><a href="#" className="footer-link">HP Laptops</a></li>
            <li><a href="#" className="footer-link">CPUs</a></li>
            <li><a href="#" className="footer-link">Accessories</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">Customer Support</h4>
          <ul className="footer-list">
            <li><a href="#" className="footer-link">FAQs</a></li>
            <li><a href="#" className="footer-link">Return Policy</a></li>
            <li><a href="#" className="footer-link">Shipping Info</a></li>
            <li><a href="#" className="footer-link">Track Order</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">Follow Us</h4>
          <div className="footer-social">
            <a href="#" className="footer-link">Facebook</a>
            <a href="#" className="footer-link">Instagram</a>
            <a href="#" className="footer-link">YouTube</a>
            <a href="#" className="footer-link">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div>Accepted Payments: Visa, Mastercard, UPI, COD</div>
        <div>© 2025 Maa Lakshmi Electronics. All rights reserved.</div>
      </div>
    </div>
  </footer>
);

export default Footer;