import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = ({ setModalContent, setUser }) => {
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    console.log(`Signup input change: ${name}=${value}`); // Debug state update
    setSignupData((prev) => {
      const newState = { ...prev, [name]: value };
      console.log('New signupData:', newState); // Debug new state
      return newState;
    });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle signup form submission
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!signupData.firstName) newErrors.firstName = 'Please enter your first name';
    if (!signupData.lastName) newErrors.lastName = 'Please enter your last name';
    if (!signupData.gender) newErrors.gender = 'Please select your gender';
    if (!signupData.mobile) newErrors.mobile = 'Please enter your mobile number';
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

    // Simulate successful signup
    setUser({ email: signupData.email });
    setModalContent('success');
    setErrors({});
    setSignupData({
      firstName: '',
      lastName: '',
      gender: '',
      mobile: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  // Close modal
  const closeModal = () => {
    setModalContent(null);
    setSignupData({
      firstName: '',
      lastName: '',
      gender: '',
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
            name="gender"
            value={signupData.gender}
            onChange={handleSignupChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            aria-label="Gender"
          >
            <option value="" disabled>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          aria-label="Submit signup"
        >
          Sign Up
        </button>
      </form>
      <div className="space-y-2">
        <button
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition-colors"
          aria-label="Sign up with Google"
        >
          <FcGoogle className="text-xl" />
          <span className="text-sm text-gray-800">Sign Up with Google</span>
        </button>
        <button
          className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 py-2 rounded-md hover:bg-blue-50 transition-colors"
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