import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import React from "react";
import { OrderSummary } from "../../customer/index.js";
import { AddressForm } from "../../../src/index.js";

const Profile = () => {
  const [user, setUser] = useState({
    firstName: "Sunil",
    lastName: "Kumar",
    gender: "Male",
  });
  const [email, setEmail] = useState("rohitsweetdream@gmail.com");
  const [mobile, setMobile] = useState("+916202670526");
  const [avatar, setAvatar] = useState("https://via.placeholder.com/48");
  const [activeSection, setActiveSection] = useState("Profile Information");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const [addresses, setAddresses] = useState([
    { id: 1, address: "123 Main Street, City, Country, 123456" },
    { id: 2, address: "456 Park Avenue, City, Country, 654321" },
  ]);

  const [wishlistItems, setWishlistItems] = useState([
    { id: 1, item: "Smartphone", price: "₹25,000" },
    { id: 2, item: "Laptop", price: "₹65,000" },
  ]);

  const [savedUPIs, setSavedUPIs] = useState([
    { id: 1, upi: "sunil@upi" },
    { id: 2, upi: "sunil2@upi" },
  ]);

  const [savedCards, setSavedCards] = useState([
    { id: 1, card: "**** **** **** 1234", expiry: "12/26" },
  ]);

  const [panCard, setPanCard] = useState("ABCDE1234F");
  const [isEditingPan, setIsEditingPan] = useState(false);
  const [tempPan, setTempPan] = useState(panCard);

  const inAppNotificationsSample = [
    {
      notification_id: "1",
      title: "Order Shipped",
      message: "Your order #1234 has been shipped!",
      is_read: false,
      createdAt: "2025-06-18T10:00:00Z",
    },
    {
      notification_id: "2",
      title: "Welcome!",
      message: "Thank you for registering with us.",
      is_read: true,
      createdAt: "2025-06-15T09:00:00Z",
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

  const [security, setSecurity] = useState({
    trustedDevices: [{ id: 1, device: "iPhone 14", remembered: true }],
    activeSessions: [
      {
        id: 1,
        device: "iPhone 14",
        location: "Mumbai, IN",
        lastActive: "2025-05-29 17:30 IST",
      },
      {
        id: 2,
        device: "MacBook Pro",
        location: "Delhi, IN",
        lastActive: "2025-05-28 14:20 IST",
      },
    ],
    loginActivity: [
      {
        id: 1,
        device: "iPhone 14",
        location: "Mumbai, IN",
        time: "2025-05-29 17:30 IST",
      },
      {
        id: 2,
        device: "MacBook Pro",
        location: "Delhi, IN",
        time: "2025-05-28 14:20 IST",
      },
    ],
  });

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
        subItems: ["Account Security", "In-App Notifications"],
      },
    ];

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setAvatar(reader.result);
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
          className={`w-72 bg-gradient-to-b from-gray-50 to-gray-200 h-screen fixed overflow-y-auto z-50 transform md:transform-none ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <div className="p-4 sm:p-6 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center space-x-4">
              <img
                src={avatar || "https://via.placeholder.com/48"}
                alt="User Avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
              />
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Hello,{" "}
                  <span className="font-bold">
                    {user.firstName} {user.lastName}
                  </span>
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

  // Other components (PersonalInformation, EmailAddress, MobileNumber, etc.) remain unchanged
  const PersonalInformation = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
      setFormData(user);
      setIsEditing(false);
    };
    const handleSave = () => {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        alert("First Name and Last Name are required.");
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={isEditing ? formData.firstName : user.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full p-2 border border-gray-300 rounded-lg ${
                  isEditing
                    ? "focus:outline-none focus:ring-2 focus:ring-blue-600"
                    : "bg-gray-100"
                }`}
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={isEditing ? formData.lastName : user.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full p-2 border border-gray-300 rounded-lg ${
                  isEditing
                    ? "focus:outline-none focus:ring-2 focus:ring-blue-600"
                    : "bg-gray-100"
                }`}
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Gender
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={
                    (isEditing ? formData.gender : user.gender) === "Male"
                  }
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-600"
                />
                <span className="ml-2 text-gray-900">Male</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={
                    (isEditing ? formData.gender : user.gender) === "Female"
                  }
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-600"
                />
                <span className="ml-2 text-gray-900">Female</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EmailAddress = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempEmail, setTempEmail] = useState(email);

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
      setTempEmail(email);
      setIsEditing(false);
    };
    const handleSave = () => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempEmail)) {
        alert("Please enter a valid email address.");
        return;
      }
      setEmail(tempEmail);
      setIsEditing(false);
      alert("Email updated successfully!");
    };

    return (
      <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Email Address
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
          <input
            type="email"
            value={isEditing ? tempEmail : email}
            onChange={(e) => setTempEmail(e.target.value)}
            disabled={!isEditing}
            className={`w-full p-2 border border-gray-300 rounded-lg ${
              isEditing
                ? "focus:outline-none focus:ring-2 focus:ring-blue-600"
                : "bg-gray-100"
            }`}
            placeholder="Enter email address"
          />
        </div>
      </div>
    );
  };

  const MobileNumber = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempMobile, setTempMobile] = useState(mobile);

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
      setTempMobile(mobile);
      setIsEditing(false);
    };
    const handleSave = () => {
      if (!/^\+\d{10,12}$/.test(tempMobile)) {
        alert("Please enter a valid mobile number (e.g., +91xxxxxxxxxx).");
        return;
      }
      setMobile(tempMobile);
      setIsEditing(false);
      alert("Mobile number updated successfully!");
    };

    return (
      <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Mobile Number
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
          <input
            type="tel"
            value={isEditing ? tempMobile : mobile}
            onChange={(e) => setTempMobile(e.target.value)}
            disabled={!isEditing}
            className={`w-full p-2 border border-gray-300 rounded-lg ${
              isEditing
                ? "focus:outline-none focus:ring-2 focus:ring-blue-600"
                : "bg-gray-100"
            }`}
            placeholder="Enter mobile number (e.g., +91xxxxxxxxxx)"
          />
        </div>
      </div>
    );
  };

  const AccountSecurity = () => {
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

    const handleSignOutSession = (sessionId) => {
      setSecurity({
        ...security,
        activeSessions: security.activeSessions.filter(
          (session) => session.id !== sessionId
        ),
      });
      alert("Session signed out successfully!");
    };

    const handleToggleTrustedDevice = (deviceId) => {
      setSecurity({
        ...security,
        trustedDevices: security.trustedDevices.map((device) =>
          device.id === deviceId
            ? { ...device, remembered: !device.remembered }
            : device
        ),
      });
      alert("Trusted device updated successfully!");
    };

    return (
      <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
          Account Security
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Trusted Devices
            </h3>
            {security.trustedDevices.length > 0 ? (
              <ul className="space-y-2">
                {security.trustedDevices.map((device) => (
                  <li
                    key={device.id}
                    className="flex items-center justify-between p-2 border border-gray-200 rounded-lg"
                  >
                    <p className="text-sm text-gray-600">{device.device}</p>
                    <button
                      onClick={() => handleToggleTrustedDevice(device.id)}
                      className={`text-sm font-medium ${
                        device.remembered
                          ? "text-blue-600 hover:underline"
                          : "text-gray-600 hover:underline"
                      }`}
                    >
                      {device.remembered
                        ? "Remove from Trusted"
                        : "Add to Trusted"}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No trusted devices found.</p>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Change Password
            </h3>
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
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Active Sessions
            </h3>
            {security.activeSessions.length > 0 ? (
              <ul className="space-y-2">
                {security.activeSessions.map((session) => (
                  <li
                    key={session.id}
                    className="flex items-center justify-between p-2 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {session.device}
                      </p>
                      <p className="text-sm text-gray-600">
                        Location: {session.location}
                      </p>
                      <p className="text-sm text-gray-600">
                        Last Active: {session.lastActive}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSignOutSession(session.id)}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      Sign Out
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No active sessions found.</p>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Recent Login Activity
            </h3>
            {security.loginActivity.length > 0 ? (
              <ul className="space-y-2">
                {security.loginActivity.map((activity) => (
                  <li
                    key={activity.id}
                    className="p-2 border border-gray-200 rounded-lg"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {activity.device}
                    </p>
                    <p className="text-sm text-gray-600">
                      Location: {activity.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      Time: {activity.time}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">
                No recent login activity found.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "Profile Information":
        return (
          <>
            <PersonalInformation />
            <EmailAddress />
            <MobileNumber />
          </>
        );
      case "Manage Addresses":
        return <AddressForm />;
      case "OrderSummary":
        return <OrderSummary />;
      case "Wishlist":
        return <Wishlist />;
      case "Account Security":
        return <AccountSecurity />;
      case "In-App Notifications":
        return <InAppNotifications />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
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

      <div
        className={`p-4 sm:p-8 w-full transition-all duration-300 ${
          isSidebarOpen ? "ml-0 md:ml-72" : "ml-0 md:ml-72"
        } md:max-w-4xl mx-auto pt-16 md:pt-0`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;
