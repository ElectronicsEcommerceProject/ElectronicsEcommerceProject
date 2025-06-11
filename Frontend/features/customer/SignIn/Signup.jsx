import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaEye, FaEyeSlash } from 'react-icons/fa';

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
    if (!signupData.password) newErrors.password = 'Please enter your password';
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
        setUser({
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          user_id: response.user.user_id,
          user: response.user
        });
        setModalContent('success');
        setSignupData({
          firstName: '',
          lastName: '',
          role: '',
          mobile: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
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
      </form>
      <div className="space-y-2">
        <button
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition-colors"
          onClick={() => alert("This feature will come soon")}
          aria-label="Sign up with Google"
        >
          <FcGoogle className="text-xl" />
          <span className="text-sm text-gray-800">Sign Up with Google</span>
        </button>
        <button
          className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 py-2 rounded-md hover:bg-blue-50 transition-colors"
          onClick={() => alert("This feature will come soon")}
          aria-label="Sign up with Facebook"
        >
          <FaFacebookF className="text-base" />
          <span className="text-sm">Sign Up with Facebook</span>
        </button>
      </div>
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