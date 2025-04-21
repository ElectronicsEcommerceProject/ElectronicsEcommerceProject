import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import authService from "./authService"; // Signup API service
import alertService from "../../components/Alert/AlertService"; // Alert service
import logo from "../../assets/logo1.png";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "customer",
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.signup(formData);
      alertService.showSuccess("Registration successful!");
      // console.log("Signup success:", response);

      // Optionally redirect
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      alertService.showError(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="min-h-screen flex justify-center items-center">
      <Row className="w-full justify-center py-5">
        <Col xs={12} sm={10} md={6} lg={5}>
          <div className="bg-white p-5 shadow-lg rounded-3xl">
            <div className="text-center mb-4">
              <img src={logo} alt="Logo" className="w-16 mx-auto" />
              <h2 className="text-xl font-semibold mt-2">Sign Up</h2>
              <p className="text-gray-500 text-sm">Create your account</p>
            </div>

            <Form onSubmit={handleRegister}>
              {/* Full Name */}
              <Form.Group className="mb-3">
                <div className="flex items-center border rounded px-2">
                  <FaUser className="text-gray-500" />
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="border-0 focus:ring-0 focus:outline-none"
                    required
                  />
                </div>
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3">
                <div className="flex items-center border rounded px-2">
                  <FaEnvelope className="text-gray-500" />
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="border-0 focus:ring-0 focus:outline-none"
                    required
                  />
                </div>
              </Form.Group>

              {/* Phone_number */}
              <Form.Group className="mb-3">
                <div className="flex items-center border rounded px-2">
                  <FaPhone className="text-gray-500" />
                  <Form.Control
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Enter phone_number number"
                    className="border-0 focus:ring-0 focus:outline-none"
                    required
                  />
                </div>
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-3">
                <div className="flex items-center border rounded px-2">
                  <FaLock className="text-gray-500" />
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="border-0 focus:ring-0 focus:outline-none"
                    required
                  />
                </div>
              </Form.Group>

              {/* Role */}
              <Form.Group className="mb-4">
                <div className="flex items-center border rounded px-2">
                  <FaUser className="text-gray-500" />
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="border-0 focus:ring-0 focus:outline-none"
                    required
                  >
                    <option value="customer">Customer</option>
                    <option value="retailer">Retailer</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </div>
              </Form.Group>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Register"
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center mt-3 text-sm">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Login
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
