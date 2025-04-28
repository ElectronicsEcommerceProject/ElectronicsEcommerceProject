import React from "react";

const Footer = () => {
  const footerStyle = {
    backgroundColor: "#f8f9fa",
    padding: "2rem 1rem",
    fontFamily: "sans-serif",
    fontSize: "0.95rem",
    color: "#333",
  };

  const contentStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  };

  const utilityBarStyle = {
    borderBottom: "1px solid #ddd",
    paddingBottom: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  const utilityContentStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  };

  const footerSectionsStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "2rem",
  };

  const columnStyle = {
    flex: "1 1 200px",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  const headingStyle = {
    fontWeight: "bold",
    marginBottom: "0.5rem",
  };

  const linkListStyle = {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#007bff",
    transition: "color 0.3s",
  };

  const socialStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  };

  const bottomStyle = {
    borderTop: "1px solid #ddd",
    paddingTop: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    fontSize: "0.85rem",
    color: "#666",
    textAlign: "center",
  };

  return (
    <footer style={footerStyle}>
      <div style={contentStyle}>
        {/* Utility Bar */}
        <div style={utilityBarStyle}>
          <div style={utilityContentStyle}>
            <div>
              <span>Call: +91 7485000001</span> |{" "}
              <span>Tech Support: 10:00 AM - 7:00 PM</span>
            </div>
            <div>
              <span>Email: support@maalakshmielectronics.com</span>
            </div>
          </div>
        </div>

        {/* Footer Columns */}
        <div style={footerSectionsStyle}>
          {/* About Us */}
          <div style={columnStyle}>
            <h4 style={headingStyle}>About Us</h4>
            <ul style={linkListStyle}>
              <li>
                <a href="#" style={linkStyle}>
                  Company Info
                </a>
              </li>
              <li>
                <a href="#" style={linkStyle}>
                  Vision
                </a>
              </li>
              <li>
                <a href="#" style={linkStyle}>
                  Careers
                </a>
              </li>
              <li>
                <a href="#" style={linkStyle}>
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div style={columnStyle}>
            <h4 style={headingStyle}>Categories</h4>
            <ul style={linkListStyle}>
              <li>
                <a href="#" style={linkStyle}>
                  Apple Laptops
                </a>
              </li>
              <li>
                <a href="#" style={linkStyle}>
                  HP Laptops
                </a>
              </li>
              <li>
                <a href="#" style={linkStyle}>
                  CPUs
                </a>
              </li>
              <li>
                <a href="#" style={linkStyle}>
                  Accessories
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div style={columnStyle}>
            <h4 style={headingStyle}>Customer Support</h4>
            <ul style={linkListStyle}>
              <li>
                <a href="#" style={linkStyle}>
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" style={linkStyle}>
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" style={linkStyle}>
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" style={linkStyle}>
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div style={columnStyle}>
            <h4 style={headingStyle}>Follow Us</h4>
            <div style={socialStyle}>
              <a href="#" style={linkStyle}>
                Facebook
              </a>
              <a href="#" style={linkStyle}>
                Instagram
              </a>
              <a href="#" style={linkStyle}>
                YouTube
              </a>
              <a href="#" style={linkStyle}>
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div style={bottomStyle}>
          <div>Accepted Payments: Visa, Mastercard, UPI, COD</div>
          <div>© 2025 Maa Lakshmi Electronics. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
