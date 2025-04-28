import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/logo1.png";
import authService from "./authService"; // Your login API service
import alertService from "../../components/Alert/AlertService"; // Your alert service
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authService.login(formData);
      // console.log("Login successful:", response);

      alertService.showSuccess(response.message || "Login successful!");

      // Save token or any user data
      localStorage.setItem("token", response.data.token);

      navigate("/");

      // Redirect based on role
      // if (formData.role === "Admin") {
      //   navigate("/admin/dashboard");
      // } else if (formData.role === "Retailer") {
      //   navigate("/retailer/home");
      // } else {
      //   navigate("/customer/home");
      // }
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "An error occurred during login."
      );
      alertService.showError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
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
              <h2 className="text-xl font-semibold mt-2">
                Maa Lakshmi Electronics
              </h2>
              <p className="text-gray-500 text-sm">
                Access your electronics account
              </p>
            </div>

            <Form onSubmit={handleSubmit}>
              {/* Email */}
              <Form.Group className="mb-3">
                <div className="flex items-center border rounded px-2">
                  <FaEnvelope className="text-gray-500" />
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
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
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="border-0 focus:ring-0 focus:outline-none"
                    required
                  />
                  <span
                    className="cursor-pointer ml-auto"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
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
                    <option value="">Select your role</option>
                    <option value="Customer">Customer</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Admin">Admin</option>
                  </Form.Select>
                </div>
              </Form.Group>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm text-center mb-2">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Login"}
              </Button>

              {/* Links */}
              <div className="text-center mt-3 text-sm">
                Need an account?{" "}
                <a
                  href="/signup"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Sign Up
                </a>{" "}
                |{" "}
                <a
                  href="/forgot-password"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
