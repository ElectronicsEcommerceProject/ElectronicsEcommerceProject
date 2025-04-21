import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
  Offcanvas,
} from "react-bootstrap";
import logo from "../../assets/logo1.png";

const CustomerHeader = ({ setSearchQuery }) => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleToggle = () => setShowOffcanvas(!showOffcanvas);

  return (
    <>
      <Navbar
        expand="lg"
        bg="light"
        variant="light"
        className="shadow-sm py-2 sticky-top"
      >
        <Container fluid>
          {/* Brand */}
          <Navbar.Brand href="/" className="d-flex align-items-center">
            <img
              src={logo}
              alt="Maa Lakshmi Logo"
              width="40"
              height="40"
              className="d-inline-block align-top rounded-circle me-2"
            />
            <span className="fw-bold">Maa Lakshmi Electronics</span>
          </Navbar.Brand>

          {/* Toggle for mobile */}
          <Navbar.Toggle
            aria-controls="customer-header-offcanvas"
            onClick={handleToggle}
          />

          {/* Search bar - visible on larger screens */}
          <Form className="d-none d-lg-flex mx-auto w-50">
            <FormControl
              type="search"
              placeholder="Search for Products, Brands and More"
              className="me-2"
              aria-label="Search"
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query
            />
            <Button variant="outline-success">Search</Button>
          </Form>

          {/* Right Side Icons */}
          <div className="d-flex align-items-center gap-3">
            {/* Account */}
            <Button
              variant="outline-secondary"
              className="d-flex align-items-center gap-1"
            >
              <i className="bi bi-person-circle"></i>
              <span>Account</span>
            </Button>

            {/* Cart */}
            <Button variant="outline-secondary" className="position-relative">
              <i className="bi bi-cart3"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                1
              </span>
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Offcanvas for mobile navigation */}
      <Offcanvas show={showOffcanvas} onHide={handleToggle} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Search bar for mobile */}
          <Form className="mb-3 d-block d-lg-none">
            <FormControl
              type="search"
              placeholder="Search for Products, Brands and More"
              className="me-2"
              aria-label="Search"
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query
            />
            <Button variant="outline-success" className="mt-2 w-100">
              Search
            </Button>
          </Form>

          {/* Navigation Links */}
          <Nav className="flex-column">
            <Nav.Link href="#">Kilos</Nav.Link>
            <Nav.Link href="#">Appliances</Nav.Link>
            <Nav.Link href="#">Flight Bookings</Nav.Link>
            <Nav.Link href="#">Beauty, Toys & More ▼</Nav.Link>
            <Nav.Link href="#">Fashion ▼</Nav.Link>
            <Nav.Link href="#">Mobiles</Nav.Link>
            <Nav.Link href="#">Electronics ▼</Nav.Link>
            <Nav.Link href="#">Home & Furniture ▼</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default CustomerHeader;
