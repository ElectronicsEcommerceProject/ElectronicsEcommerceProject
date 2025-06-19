import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import React from "react";
import { OrderSummary } from "../../customer/index.js";

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
    role: "customer"
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
      status: "sent"
    },
    {
      notification_id: "2",
      title: "Welcome!",
      message: "Thank you for registering with us.",
      is_read: true,
      createdAt: "2025-06-15T09:00:00Z",
      channel: "in_app",
      status: "sent"
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
          setUser(prev => ({ ...prev, profileImage_url: reader.result }));
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
                  Hello,{" "}
                  <span className="font-bold">
                    {user.name}
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

  // Manage Addresses component based on Address model
  const ManageAddresses = () => {
    const [addresses, setAddresses] = useState([
      // Sample addresses based on Address model
      {
        address_id: "addr-123",
        address_line1: "123 Main Street",
        address_line2: "Apartment 4B",
        city: "Mumbai",
        state: "Maharashtra",
        postal_code: "400001",
        country: "India",
        is_default: true,
        is_active: true
      },
      {
        address_id: "addr-456",
        address_line1: "456 Park Avenue",
        address_line2: "",
        city: "Delhi",
        state: "Delhi",
        postal_code: "110001",
        country: "India",
        is_default: false,
        is_active: true
      }
    ]);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [formData, setFormData] = useState({
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      is_default: false
    });

    const handleAddClick = () => {
      setFormData({
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "India",
        is_default: false
      });
      setIsAddingAddress(true);
      setIsEditingAddress(false);
    };

    const handleEditClick = (address) => {
      setCurrentAddress(address);
      setFormData({
        address_line1: address.address_line1,
        address_line2: address.address_line2 || "",
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
        is_default: address.is_default
      });
      setIsEditingAddress(true);
      setIsAddingAddress(false);
    };

    const handleDeleteClick = (addressId) => {
      if (window.confirm("Are you sure you want to delete this address?")) {
        setAddresses(addresses.filter(addr => addr.address_id !== addressId));
        alert("Address deleted successfully!");
      }
    };

    const handleSetDefaultClick = (addressId) => {
      setAddresses(addresses.map(addr => ({
        ...addr,
        is_default: addr.address_id === addressId
      })));
      alert("Default address updated successfully!");
    };

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Validate form
      if (!formData.address_line1 || !formData.city || !formData.state || !formData.postal_code) {
        alert("Please fill all required fields.");
        return;
      }

      if (isEditingAddress) {
        // Update existing address
        setAddresses(addresses.map(addr => 
          addr.address_id === currentAddress.address_id 
            ? { ...addr, ...formData } 
            : formData.is_default 
              ? { ...addr, is_default: false } 
              : addr
        ));
        setIsEditingAddress(false);
        alert("Address updated successfully!");
      } else {
        // Add new address
        const newAddress = {
          ...formData,
          address_id: `addr-${Date.now()}`,
          is_active: true,
          user_id: user.user_id
        };
        
        // If this is the first address or set as default, update all other addresses
        if (formData.is_default || addresses.length === 0) {
          setAddresses([
            ...addresses.map(addr => ({ ...addr, is_default: false })),
            newAddress
          ]);
        } else {
          setAddresses([...addresses, newAddress]);
        }
        
        setIsAddingAddress(false);
        alert("Address added successfully!");
      }
      
      // Reset form
      setFormData({
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "India",
        is_default: false
      });
    };

    const handleCancel = () => {
      setIsAddingAddress(false);
      setIsEditingAddress(false);
      setCurrentAddress(null);
    };

    // List of Indian states for dropdown
    const indianStates = [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
      "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
      "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
      "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
      "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
      "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
      "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];

    return (
      <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Manage Addresses
            </h2>
            {!isAddingAddress && !isEditingAddress && (
              <button
                onClick={handleAddClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-medium flex items-center whitespace-nowrap"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add New Address
              </button>
            )}
          </div>
        </div>

        {/* Address Form */}
        {(isAddingAddress || isEditingAddress) && (
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-800 mb-4">
              {isAddingAddress ? "Add New Address" : "Edit Address"}
            </h3>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="House/Flat No., Building, Street"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Landmark, Area (Optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="">Select State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="PIN Code"
                    required
                    pattern="[0-9]{6}"
                    title="Please enter a valid 6-digit PIN code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                    disabled
                  />
                </div>
                <div className="col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_default"
                      name="is_default"
                      checked={formData.is_default}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700">
                      Set as default address
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto"
                >
                  {isAddingAddress ? "Add Address" : "Update Address"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        <div className="p-4 sm:p-6">
          {addresses.length === 0 ? (
            <div className="text-center py-10 px-4">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <p className="text-gray-500 mb-4">You don't have any saved addresses</p>
              <button
                onClick={handleAddClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add New Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div
                  key={address.address_id}
                  className={`border ${
                    address.is_default ? "border-blue-400 bg-blue-50" : "border-gray-200"
                  } rounded-lg p-4 sm:p-5 relative hover:shadow-md transition-shadow duration-200`}
                >
                  {address.is_default && (
                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                  <div className="mb-3">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-gray-700">{address.address_line1}</p>
                    {address.address_line2 && <p className="text-gray-700">{address.address_line2}</p>}
                    <p className="text-gray-700">
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                    <p className="text-gray-700">{address.country}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3 border-t pt-3 justify-start">
                    <button
                      onClick={() => handleEditClick(address)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(address.address_id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                    {!address.is_default && (
                      <button
                        onClick={() => handleSetDefaultClick(address.address_id)}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
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