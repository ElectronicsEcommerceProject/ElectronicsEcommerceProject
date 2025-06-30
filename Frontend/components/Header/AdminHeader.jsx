import React, { useState, useEffect } from "react";
import { FiUser, FiBell, FiLogOut, FiMenu, FiX, FiChevronDown, FiEye, FiEyeOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { getUserFromToken, isAuthenticated, createApi, userPanelLoginRoute, userPanelForgotPasswordRoute } from "../../src/index.js";

const AdminHeader = ({ notifications, dismissNotification }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastLoginTime] = useState(new Date());
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const formatTime = (date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  // Check for existing token on component mount
  useEffect(() => {
    const checkExistingToken = () => {
      if (isAuthenticated()) {
        const userData = getUserFromToken();
        setUser(userData);
      } else {
        setUser(null);
      }
    };

    checkExistingToken();

    const handleTokenChange = () => {
      checkExistingToken();
    };

    window.addEventListener('tokenChanged', handleTokenChange);
    return () => window.removeEventListener('tokenChanged', handleTokenChange);
  }, []);

  const handleLogin = () => {
    setShowLoginModal(true);
    setModalContent('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('tokenChanged'));
    setUser(null);
    setMessage('Logged out successfully!');
    window.location.reload();
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setModalContent(null);
    setMessage("");
    setLoginData({ email: "", password: "" });
    setErrors({});
    setForgotEmail("");
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!loginData.email) {
      newErrors.email = "Please enter your email";
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!loginData.password) {
      newErrors.password = "Please enter your password";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await createApi(userPanelLoginRoute, loginData);

      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        window.dispatchEvent(new Event('tokenChanged'));
        setModalContent('success');
        setMessage('Login successful!');
        setLoginData({ email: "", password: "" });
      } else {
        setErrors({ general: response.message || 'Login failed. Please try again.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: error.message || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setErrors({ forgotEmail: "Please enter your email address" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await createApi(userPanelForgotPasswordRoute, { email: forgotEmail });
      setMessage('Password reset link sent to your email!');
      setModalContent('success');
      setForgotEmail("");
    } catch (error) {
      console.error('Forgot password error:', error);
      setErrors({ forgotEmail: error.message || 'Failed to send reset link. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle success modal auto-close and page refresh
  useEffect(() => {
    if (modalContent === 'success' && message === 'Login successful!') {
      const timer = setTimeout(() => {
        closeModal();
        window.location.reload();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [modalContent, message]);

  return (
<header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow">
      <div className="container mx-auto px-4 py-3">
        {/* Main Header Content */}
        <div className="flex items-center justify-between">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            
            {/* Logo */}
            <div className="flex items-center cursor-pointer group">
              <span className="w-8 h-8 bg-white mr-2 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <span className="text-blue-800 font-bold">A</span>
              </span>
              <span className="text-xl font-semibold tracking-tight group-hover:text-blue-100 transition-colors">
                AdminPanel
              </span>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications Bell Icon */}
            <div 
              className="relative"
              onMouseEnter={() => setIsNotificationsOpen(true)}
              onMouseLeave={() => setIsNotificationsOpen(false)}
            >
              <button 
                className="p-1 hover:text-blue-200 transition-colors relative"
                onClick={toggleNotifications}
              >
                <FiBell size={20} />
                {notifications?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg py-1 z-50 max-h-72 overflow-y-auto">
                  {notifications?.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`border-l-4 p-2 flex justify-between items-center gap-2 ${
                          notification.type === 'warning'
                            ? 'bg-yellow-50 border-yellow-400'
                            : notification.type === 'error'
                            ? 'bg-red-50 border-red-400'
                            : 'bg-green-50 border-green-400'
                        }`}
                      >
                        <p className="text-[10px] text-gray-800 leading-tight flex-1">{notification.message}</p>
                        <button
                          className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                          onClick={() => dismissNotification(notification.id)}
                        >
                          <i className="fas fa-times text-[10px]"></i>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="px-2 py-1 text-[10px] text-gray-600">No new notifications.</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Login/Logout Buttons */}
            <div className="flex items-center space-x-2">
              {!user ? (
                <button 
                  onClick={handleLogin}
                  className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors"
                >
                  <FiUser size={16} />
                  <span className="text-sm font-medium">Login</span>
                </button>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-500/80 hover:bg-red-600 px-3 py-1.5 rounded-md transition-colors"
                >
                  <FiLogOut size={16} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="flex flex-col md:flex-row md:justify-between mt-2 space-y-1 md:space-y-0">
          {/* Last Login Time */}
          <div className="text-xs md:text-sm bg-blue-700/50 px-3 py-1 rounded-md inline-block w-fit">
            Last Login: {formatTime(lastLoginTime)}
          </div>
          
          {/* Welcome Message */}
          <div className="text-sm md:text-base font-medium bg-white/10 px-3 py-1 rounded-md inline-block w-fit">
            {user ? `Welcome, ${user.name || user.email}` : "Welcome, Guest"}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-2 border-t border-blue-500/30">
            <div className="flex flex-col space-y-2">
              {!user ? (
                <button 
                  onClick={handleLogin}
                  className="flex items-center space-x-2 px-2 py-1 hover:bg-white/10 rounded"
                >
                  <FiUser size={16} />
                  <span>Login</span>
                </button>
              ) : (
                <span className="flex items-center space-x-2 px-2 py-1 text-sm">
                  <FiUser size={16} />
                  <span>{user.name || user.email}</span>
                </span>
              )}
              <button 
                className="flex items-center space-x-2 px-2 py-1 hover:bg-white/10 rounded"
                onClick={toggleNotifications}
              >
                <FiBell size={16} />
                <span>Notifications</span>
              </button>
              {user && (
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-2 py-1 hover:bg-white/10 rounded"
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[999] px-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white rounded-xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {modalContent === "login" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 text-center">Admin Login</h2>
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        placeholder="Enter your email"
                        autoFocus
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          placeholder="Enter password"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                        onClick={() => setModalContent("forgotPassword")}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    {errors.general && (
                      <div className="text-red-500 text-sm text-center">
                        {errors.general}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </button>
                  </form>
                  <div className="text-center">
                    <button
                      className="text-blue-600 text-sm underline hover:text-blue-800"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
              {modalContent === "forgotPassword" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 text-center">
                    Reset Password
                  </h2>
                  <p className="text-gray-600 text-center text-sm">
                    Enter your email to receive a password reset link.
                  </p>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        required
                      />
                      {errors.forgotEmail && (
                        <p className="text-red-500 text-xs mt-1">{errors.forgotEmail}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </form>
                  <div className="text-center">
                    <button
                      className="text-blue-600 text-sm underline hover:text-blue-800"
                      onClick={() => setModalContent("login")}
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              )}
              {modalContent === "success" && (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Success!</h2>
                  <p className="text-gray-600">{message}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default AdminHeader;