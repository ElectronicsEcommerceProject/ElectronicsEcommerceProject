import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import logo from "../../assets/logo1.png";
import "../../src/styles/global.css";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { name, email, phone, password, role } = formData;

    if (name && email && phone && password && role) {
      alert(`Registration successful for ${role}!`);
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <Container className="login-container">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="form">
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" />
            </div>
            <h1 className="form-title">Sign Up</h1>
            <p className="form-subtitle">Create your account</p>
            <Form onSubmit={handleRegister}>
              <Form.Group className="input-group">
                <Form.Label className="input-label">
                  <FaUser className="input-icon" />
                  Full Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </Form.Group>
              <Form.Group className="input-group">
                <Form.Label className="input-label">
                  <FaEnvelope className="input-icon" />
                  Email
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </Form.Group>
              <Form.Group className="input-group">
                <Form.Label className="input-label">
                  <FaPhone className="input-icon" />
                  Phone
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your phone number"
                  required
                />
              </Form.Group>
              <Form.Group className="input-group">
                <Form.Label className="input-label">
                  <FaLock className="input-icon" />
                  Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                />
              </Form.Group>
              <Form.Group className="input-group">
                <Form.Label className="input-label">
                  <FaUser className="input-icon" />
                  Role
                </Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="retailer">Retailer</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>
              <Button type="submit" className="submit-button">
                Register
              </Button>
              <div className="links">
                <a href="/login" className="link">
                  Already have an account? Login
                </a>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupForm;
