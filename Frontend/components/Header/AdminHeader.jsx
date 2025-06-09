import React, { useState, useEffect } from "react";
import { FiUser, FiBell, FiLogOut, FiMenu, FiX, FiChevronDown } from "react-icons/fi";

const AdminHeader = ({ notifications, dismissNotification }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastLoginTime] = useState(new Date());
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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
            
            {/* User Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsUserDropdownOpen(true)}
              onMouseLeave={() => setIsUserDropdownOpen(false)}
            >
              <button className="flex items-center space-x-1 hover:text-blue-200 transition-colors">
                <FiUser size={18} />
                <span className="hidden md:inline">Login</span>
                <FiChevronDown size={16} className="hidden md:inline" />
              </button>
              
              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <a 
                    href="#profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                  >
                    Profile
                  </a>
                  <a 
                    href="#logout" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                  >
                    Logout
                  </a>
                </div>
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
            Welcome, Rohit Kr.
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-2 border-t border-blue-500/30">
            <div className="flex flex-col space-y-2">
              <button className="flex items-center space-x-2 px-2 py-1 hover:bg-white/10 rounded">
                <FiUser size={16} />
                <span>Profile</span>
              </button>
              <button 
                className="flex items-center space-x-2 px-2 py-1 hover:bg-white/10 rounded"
                onClick={toggleNotifications}
              >
                <FiBell size={16} />
                <span>Notifications</span>
              </button>
              <button className="flex items-center space-x-2 px-2 py-1 hover:bg-white/10 rounded">
                <FiLogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;