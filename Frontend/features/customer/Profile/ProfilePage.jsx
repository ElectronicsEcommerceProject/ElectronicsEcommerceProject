import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import React from "react";
import { OrderSummary } from "../../customer/index.js";
import { AddressForm } from "../../../src/index.js";

const Profile = () => {
  // User data based on actual User model
  const [user, setUser] = useState({
    user_id: "123e4567-e89b-12d3-a456-426614174000",
    name: "Sunil Kumar",
    email: "rohitsweetdream@gmail.com",
    phone_number: "+916202670526",
    profileImage_url: "https://via.placeholder.com/48",
    current_address_id: null,
    status: "active",
    role: "customer",
  });

  const [activeSection, setActiveSection] = useState("Profile Information");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Sample notifications based on Notification model
  const inAppNotificationsSample = [
    {
      notification_id: "1",
      title: "Order Shipped",
      message: "Your order #1234 has been shipped!",
      is_read: false,
      createdAt: "2025-06-18T10:00:00Z",
      channel: "in_app",
      status: "sent",
    },
    {
      notification_id: "2",
      title: "Welcome!",
      message: "Thank you for registering with us.",
      is_read: true,
      createdAt: "2025-06-15T09:00:00Z",
      channel: "in_app",
      status: "sent",
    },
  ];
  const [notifications, setNotifications] = useState(inAppNotificationsSample);

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((n) =>
        n.notification_id === id ? { ...n, is_read: true } : n
      )
    );
  };

  const InAppNotifications = () => (
    <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
        In-App Notifications
      </h2>
      <ul className="space-y-3">
        {notifications.length === 0 && (
          <li className="text-gray-500">No notifications.</li>
        )}
        {notifications.map((n) => (
          <li
            key={n.notification_id}
            className={`p-3 rounded border flex flex-col sm:flex-row sm:justify-between sm:items-center ${
              n.is_read ? "bg-gray-50" : "bg-blue-50"
            }`}
          >
            <div>
              <div className="font-medium text-gray-800">{n.title}</div>
              <div className="text-gray-600 text-sm">{n.message}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
            {!n.is_read && (
              <button
                className="mt-2 sm:mt-0 bg-blue-600 text-white px-3 py-1 rounded text-xs"
                onClick={() => handleMarkAsRead(n.notification_id)}
              >
                Mark as read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  // Password change functionality (simplified since no session tracking in models)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle query params to set active section
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");
    if (section === "OrderSummary") {
      setActiveSection("OrderSummary");
    } else if (section === "wishlist") {
      setActiveSection("Wishlist");
    } else {
      setActiveSection("Profile Information");
    }
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const Sidebar = () => {
    const [activeMenu, setActiveMenu] = useState("Profile Information");
    const menuItems = [
      { name: "MY ORDERS", icon: "🏠", subItems: [] },
      {
        name: "ACCOUNT SETTINGS",
        icon: "👤",
        subItems: ["Profile Information", "Manage Addresses"],
      },
      { name: "WISHLIST", icon: "❤️", subItems: [] },
      {
        name: "SETTINGS",
        icon: "⚙️",
        subItems: ["Change Password", "In-App Notifications"],
      },
    ];

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setUser((prev) => ({ ...prev, profileImage_url: reader.result }));
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please upload a valid image file (PNG/JPG).");
      }
    };

    const handleMenuClick = (item, subItem) => {
      if (item === "MY ORDERS") {
        setActiveSection("OrderSummary");
        setActiveMenu("OrderSummary");
      } else if (item === "WISHLIST") {
        setActiveSection("Wishlist");
        setActiveMenu("Wishlist");
      } else if (subItem) {
        setActiveSection(subItem);
        setActiveMenu(subItem);
      }
      if (window.innerWidth < 768) {
        toggleSidebar();
      }
    };

    return (
      <>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
        <div
          className={`w-64 bg-gradient-to-b from-gray-50 to-gray-200 h-screen fixed overflow-y-auto z-50 transform md:transform-none ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <div className="p-4 sm:p-6 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center space-x-4">
              <img
                src={user.profileImage_url || "https://via.placeholder.com/48"}
                alt="User Avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
              />
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Hello, <span className="font-bold">{user.name}</span>
                </h2>
                <label className="text-sm text-blue-600 hover:underline cursor-pointer">
                  Change Avatar
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="p-4">
            {menuItems.map((item, index) => (
              <div key={index} className="mb-3">
                <div
                  className={`px-4 py-2 text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center cursor-pointer rounded-lg ${
                    activeMenu === item.name ||
                    item.subItems.includes(activeMenu)
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleMenuClick(item.name)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                  <span className="ml-auto">
                    {item.subItems.length > 0 ? "›" : ""}
                  </span>
                </div>
                {item.subItems.length > 0 && (
                  <div className="ml-6">
                    {item.subItems.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        className={`px-4 py-2 text-sm flex items-center cursor-pointer rounded-lg ${
                          activeMenu === subItem
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-200"
                        }`}
                        onClick={() => handleMenuClick(item.name, subItem)}
                      >
                        {activeMenu === subItem && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        )}
                        {subItem}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  // Personal Information component based on User model
  const PersonalInformation = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
      setFormData(user);
      setIsEditing(false);
    };
    const handleSave = () => {
      if (!formData.name.trim()) {
        alert("Name is required.");
        return;
      }
      if (!formData.email.trim()) {
        alert("Email is required.");
        return;
      }
      if (!formData.phone_number.trim()) {
        alert("Phone number is required.");
        return;
      }
      setUser(formData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    };
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    return (
      <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Personal Information
          </h2>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="text-blue-600 hover:underline text-sm font-medium mt-2 sm:mt-0"
            >
              Edit
            </button>
          ) : (
            <div className="flex space-x-3 mt-2 sm:mt-0">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded-lg text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 text-white rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div>
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={isEditing ? formData.name : user.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full p-2 border border-gray-300 rounded-lg ${
                  isEditing
                    ? "focus:outline-none focus:ring-2 focus:ring-blue-600"
                    : "bg-gray-100"
                }`}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={isEditing ? formData.email : user.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full p-2 border border-gray-300 rounded-lg ${
                  isEditing
                    ? "focus:outline-none focus:ring-2 focus:ring-blue-600"
                    : "bg-gray-100"
                }`}
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                value={isEditing ? formData.phone_number : user.phone_number}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full p-2 border border-gray-300 rounded-lg ${
                  isEditing
                    ? "focus:outline-none focus:ring-2 focus:ring-blue-600"
                    : "bg-gray-100"
                }`}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Status
              </label>
              <input
                type="text"
                value={user.status}
                disabled
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 capitalize"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <input
                type="text"
                value={user.role}
                disabled
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 capitalize"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Simplified Change Password component (since no session tracking in models)
  const ChangePassword = () => {
    const handleChangePassword = () => {
      if (newPassword.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
      }
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      alert("Password changed successfully!");
      setNewPassword("");
      setConfirmPassword("");
    };

    return (
      <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
          Change Password
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Confirm new password"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded-lg text-sm font-medium"
          >
            Change Password
          </button>
        </div>
      </div>
    );
  };

  // Wishlist component placeholder (would need to fetch from API)
  const Wishlist = () => (
    <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
        My Wishlist
      </h2>
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Your wishlist is empty</p>
        <p className="text-sm text-gray-400">
          Add items to your wishlist to see them here
        </p>
      </div>
    </div>
  );

  // Manage Addresses component that directly uses the AddressForm component
  const ManageAddresses = () => {
    const [showAddressForm, setShowAddressForm] = useState(true);
    const [showPlaceholder, setShowPlaceholder] = useState(false);
    
    // If close button is clicked, show a placeholder with button to reopen the form
    if (showPlaceholder) {
      return (
        <div className="mb-6 p-8 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Your Addresses</h2>
            <p className="text-gray-600 mb-6">Add, edit, or remove your delivery addresses</p>
            <button
              onClick={() => {
                setShowAddressForm(true);
                setShowPlaceholder(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Manage Addresses
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <AddressForm 
        isOpen={showAddressForm} 
        onClose={() => {
          setShowAddressForm(false);
          setShowPlaceholder(true);
        }} 
        mode="select" 
      />
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "Profile Information":
        return <PersonalInformation />;
      case "Manage Addresses":
        return <ManageAddresses />;
      case "OrderSummary":
        return <OrderSummary />;
      case "Wishlist":
        return <Wishlist />;
      case "Change Password":
        return <ChangePassword />;
      case "In-App Notifications":
        return <InAppNotifications />;
      default:
        return <PersonalInformation />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">
      <div className="md:hidden fixed top-0 left-0 p-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isSidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
                className="transition-transform duration-300"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
                className="transition-transform duration-300"
              />
            )}
          </svg>
        </button>
      </div>

      <Sidebar />

      <div className="flex flex-col min-h-screen">
        <div
          className={`flex-grow transition-all duration-300 ${
            isSidebarOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-64"
          }`}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pt-16 md:pt-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
