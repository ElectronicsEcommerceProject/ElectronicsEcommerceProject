import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { createApi, userPanelRegisterRoute } from '../../../src/index.js';

const Signup = ({ setModalContent, setUser }) => {
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    console.log(`Signup input change: ${name}=${value}`); // Debug state update
    
    // Handle mobile number input with masking
    if (name === 'mobile') {
      // Remove all non-digit characters
      let digits = value.replace(/[^0-9]/g, '');
      
      // Limit to 10 digits
      if (digits.length > 10) {
        digits = digits.slice(0, 10);
      }
      
      // Format as XXX-XXX-XXXX
      let formattedValue = '';
      if (digits.length > 3) {
        formattedValue += digits.substring(0, 3) + '-';
        if (digits.length > 6) {
          formattedValue += digits.substring(3, 6) + '-';
          formattedValue += digits.substring(6);
        } else {
          formattedValue += digits.substring(3);
        }
      } else {
        formattedValue = digits;
      }
      
      // Update the value in the signupData state
      setSignupData((prev) => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    // Handle other fields normally
    setSignupData((prev) => {
      const newState = { ...prev, [name]: value };
      console.log('New signupData:', newState); // Debug new state
      return newState;
    });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle signup form submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!signupData.firstName) newErrors.firstName = 'Please enter your first name';
    if (!signupData.lastName) newErrors.lastName = 'Please enter your last name';
    if (!signupData.role) newErrors.role = 'Please select your role';
    if (!signupData.mobile) {
      newErrors.mobile = 'Please enter your mobile number';
    } else {
      // Check if it's exactly 10 digits
      const digits = signupData.mobile.replace(/[^0-9]/g, '');
      if (digits.length !== 10) {
        newErrors.mobile = 'Mobile number must be exactly 10 digits';
      }
    }
    if (!signupData.email) newErrors.email = 'Please enter your email';
    if (!signupData.password) {
      newErrors.password = 'Please enter your password';
    } else if (signupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    if (!signupData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (signupData.password && signupData.confirmPassword && signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Prepare data for API call
      const apiData = {
        name: `${signupData.firstName} ${signupData.lastName}`.trim(),
        email: signupData.email,
        phone_number: signupData.mobile.replace(/[^0-9]/g, ''),
        password: signupData.password,
        role: signupData.role.toLowerCase()
      };

      console.warn('Signup data:', apiData)

      // Make API call
      const response = await createApi(userPanelRegisterRoute, apiData);

      console.log('Signup successful:', response);

      // Handle successful signup
      if (response.success && response.user) {
        // Reset form data
        setSignupData({
          firstName: '',
          lastName: '',
          role: '',
          mobile: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        
        // Special handling for retailer accounts that require approval
        if (response.requiresApproval) {
          // Show approval pending message
          setErrors({
            approvalMessage: response.message,
            adminEmail: response.adminContact?.email,
            adminPhone: response.adminContact?.phone
          });
        } else {
          // Redirect to login form after successful signup for customers
          setModalContent('login');
        }
      } else {
        setErrors({ general: response.message || 'Registration failed. Please try again.' });
      }

    } catch (error) {
      console.error('Signup error:', error);

      // Handle API errors
      if (error.message) {
        if (error.message.includes('email')) {
          setErrors({ email: error.message });
        } else if (error.message.includes('phone')) {
          setErrors({ mobile: error.message });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setModalContent(null);
    setSignupData({
      firstName: '',
      lastName: '',
      role: '',
      mobile: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 text-center">Sign Up</h2>
      <div className="flex justify-end">
        <button
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
          onClick={() => setModalContent('login')}
          aria-label="Switch to login"
        >
          Login
        </button>
      </div>
      <form onSubmit={handleSignupSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="firstName"
            value={signupData.firstName}
            onChange={handleSignupChange}
            placeholder="First Name"
            autoFocus
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            aria-label="First Name"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            name="lastName"
            value={signupData.lastName}
            onChange={handleSignupChange}
            placeholder="Last Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            aria-label="Last Name"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
        <div>
          <select
            name="role"
            value={signupData.role}
            onChange={handleSignupChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            aria-label="Role"
          >
            <option value="" disabled>Select Role</option>
            <option value="Customer">Customer</option>
            <option value="Retailer">Retailer</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">{errors.role}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            name="mobile"
            value={signupData.mobile}
            onChange={handleSignupChange}
            placeholder="Mobile Number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            aria-label="Mobile Number"
            maxLength="12" // Adding maxLength for better UX with our formatting (XXX-XXX-XXXX)
          />
          {errors.mobile && (
            <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
          )}
        </div>
        <div>
          <input
            type="email"
            name="email"
            value={signupData.email}
            onChange={handleSignupChange}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            aria-label="Email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div className="relative">
          <input
            type={showSignupPassword ? 'text' : 'password'}
            name="password"
            value={signupData.password}
            onChange={handleSignupChange}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            aria-label="Password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowSignupPassword(!showSignupPassword)}
            aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
          >
            {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={signupData.confirmPassword}
            onChange={handleSignupChange}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            aria-label="Confirm Password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>
        {errors.general && (
          <div className="text-red-500 text-sm text-center">
            {errors.general}
          </div>
        )}
        
        {/* Retailer Approval Message */}
        {errors.approvalMessage && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm">
            <div className="flex items-center mb-2">
              <svg className="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-yellow-800">Retailer Account Pending Approval</span>
            </div>
            <p className="text-yellow-700 mb-3">{errors.approvalMessage}</p>
            
            <div className="bg-white p-3 rounded border border-yellow-100">
              <p className="text-gray-700 font-medium mb-2">For faster approval, contact our admin:</p>
              <div className="space-y-1">
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${errors.adminEmail}`} className="text-blue-600 hover:underline">{errors.adminEmail}</a>
                </div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${errors.adminPhone}`} className="text-green-600 hover:underline">{errors.adminPhone}</a>
                </div>
              </div>
            </div>
          </div>
        )}
        {!errors.approvalMessage ? (
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
            aria-label="Submit signup"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setModalContent('login')}
            className="w-full py-2 rounded-md transition-colors bg-green-600 hover:bg-green-700 text-white"
          >
            Go to Login
          </button>
        )}
      </form>
      <div className="text-center">
        <button
          className="text-blue-600 text-sm underline hover:text-blue-800"
          onClick={closeModal}
          aria-label="Close signup modal"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Signup;