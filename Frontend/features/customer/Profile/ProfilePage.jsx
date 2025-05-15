import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddressForm from '../features/customer/Addresses/AddressForm';
import {
  House,
  Package,
  ShoppingCartSimple,
  Star,
  Ticket,
  BellRinging,
  Coin,
  Gear,
  UserCircleGear,
} from 'phosphor-react';

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dummy data - to be replaced with backend fetch
  const [addresses, setAddresses] = useState([
    {
      name: "John Doe",
      phone: "+91 9876543210",
      alternatePhone: "+91 9123456789",
      pincode: "400001",
      state: "Maharashtra",
      city: "Mumbai",
      houseNo: "123",
      area: "MG Road",
      landmark: "Near Station",
      type: "Home",
    },
    {
      name: "Jane Doe",
      phone: "+91 8765432109",
      alternatePhone: "",
      pincode: "110001",
      state: "Delhi",
      city: "Delhi",
      houseNo: "456",
      area: "Park Street",
      landmark: "Opposite Mall",
      type: "Work",
    },
  ]);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    gender: "Male",
    profileImage: "https://via.placeholder.com/100",
    email: "john.doe@example.com",
    mobile: "+91 9876543210",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Menu items with icons mapped to profile sections
  const menuItems = [
    { label: "Profile", section: "profile", icon: <UserCircleGear size={24} weight="bold" className="text-indigo-600" /> },
    { label: "Orders", section: "orders", icon: <ShoppingCartSimple size={24} weight="bold" className="text-red-500" /> },
    { label: "Wishlist", section: "wishlist", icon: <Star size={24} weight="bold" className="text-yellow-500" /> },
    { label: "Addresses", section: "addresses", icon: <House size={24} weight="bold" className="text-blue-600" /> },
    { label: "Coupons", section: "coupons", icon: <Ticket size={24} weight="bold" className="text-purple-500" /> },
    { label: "Gift Cards", section: "giftcards", icon: <Package size={24} weight="bold" className="text-orange-500" /> },
    { label: "SuperCoins", section: "supercoins", icon: <Coin size={24} weight="bold" className="text-teal-500" /> },
    { label: "Reviews", section: "reviews", icon: <Star size={24} weight="bold" className="text-yellow-500" /> },
    { label: "Notifications", section: "notifications", icon: <BellRinging size={24} weight="bold" className="text-pink-500" /> },
    { label: "Security", section: "security", icon: <Gear size={24} weight="bold" className="text-gray-600" /> },
  ];

  // Fetch initial data
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const section = queryParams.get("section") || "profile";
    setActiveSection(section);

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/profile');
        // if (!response.ok) throw new Error('Failed to fetch profile data');
        // const data = await response.json();
        // setProfileData(data.profile);
        // setAddresses(data.addresses);
        // setNotifications(data.notifications);
      } catch (err) {
        setError("Failed to load profile data. Please try again.");
        console.error("Error fetching profile data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [location.search]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`/profile?section=${section}`);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData((prev) => ({ ...prev, profileImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement API call to save profile
      // await fetch('/api/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profileData)
      // });
      alert("Profile updated successfully!");
      setShowEditForm(false);
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      console.error("Error saving profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = async (addressData) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement API call to add address
      // await fetch('/api/addresses', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(addressData)
      // });
      setAddresses([...addresses, addressData]);
      setShowAddressForm(false);
    } catch (err) {
      setError("Failed to add address. Please try again.");
      console.error("Error adding address:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement API call to change password
      // await fetch('/api/password', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ currentPassword, newPassword })
      // });
      alert("Password changed successfully!");
      e.target.reset();
    } catch (err) {
      setError("Failed to change password. Please try again.");
      console.error("Error changing password:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotification = (type) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const saveNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement API call to save notifications
      // await fetch('/api/notifications', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(notifications)
      // });
      alert("Notification preferences saved!");
    } catch (err) {
      setError("Failed to save notifications. Please try again.");
      console.error("Error saving notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // TODO: Implement actual logout API call
    // await fetch('/api/logout', { method: 'POST' });
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="bg-gray-100 font-sans min-h-screen flex flex-col">
      <button
        className="text-2xl focus:outline-none"
        onClick={() => setShowLogoutModal(true)}
      >
        👤
      </button>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Logout</h3>
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 pt-16">
        <button
          className="md:hidden fixed top-20 left-4 z-50 bg-gray-800 text-white p-2 rounded"
          onClick={toggleSidebar}
        >
          ☰
        </button>

        <aside
          className={`w-64 bg-white shadow-md p-4 fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static`}
        >
连锁

          <h2 className="text-xl font-semibold mb-4">My Account</h2>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <div
                key={item.section}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 relative ${
                  activeSection === item.section
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                }`}
                onClick={() => handleSectionChange(item.section)}
              >
                {activeSection === item.section && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r" />
                )}
                <div className="flex items-center gap-2">{item.icon}</div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
            <div
              className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-red-600 hover:bg-gray-100"
              onClick={() => setShowLogoutModal(true)}
            >
              <span className="text-sm font-medium">Logout</span>
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {isLoading && <div className="text-center py-4">Loading...</div>}

          {activeSection === "profile" && !isLoading && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">My Profile</h2>
              <div className="flex flex-col md:flex-row items-center mb-4">
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mb-4 md:mb-0 md:mr-4 object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold">{`${profileData.firstName} ${profileData.lastName}`}</h3>
                  <p className="text-gray-600">{profileData.email}</p>
                  <p className="text-gray-600">{profileData.mobile}</p>
                  <p className="text-gray-600">Gender: {profileData.gender}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditForm(!showEditForm)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {showEditForm ? "Cancel" : "Edit Profile"}
              </button>

              {showEditForm && (
                <form onSubmit={saveProfile} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700">Gender</label>
                    <select
                      name="gender"
                      value={profileData.gender}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700">Profile Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Mobile</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={profileData.mobile}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    disabled={isLoading}
                  >
                    Save Changes
                  </button>
                </form>
              )}
            </div>
          )}

          {activeSection === "addresses" && !isLoading && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">Saved Addresses</h2>
              {!showAddressForm && (
                <div className="flex items-center mb-4">
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    <span className="mr-2">+</span> Add New Address
                  </button>
                </div>
              )}
              {showAddressForm && (
                <AddressForm
                  onSubmit={addAddress}
                  onCancel={() => setShowAddressForm(false)}
                />
              )}
              <ul className="mt-4 space-y-4">
                {addresses.map((address, index) => (
                  <li key={index} className="border p-4 rounded">
                    <p>
                      <strong>{address.name}</strong>
                    </p>
                    <p>
                      {address.houseNo}, {address.area}, {address.landmark}
                    </p>
                    <p>
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p>Phone: {address.phone}</p>
                    {address.alternatePhone && (
                      <p>Alternate Phone: {address.alternatePhone}</p>
                    )}
                    <p>Type: {address.type}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeSection === "orders" && !isLoading && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">My Orders</h2>
              <div className="space-y-4">
                <div className="border p-4 rounded">
                  <p>
                    <strong>Order #12345</strong> - Placed on 2025-05-01
                  </p>
                  <p>Items: Laptop, Mouse</p>
                  <p>Status: Delivered</p>
                </div>
                <div className="border p-4 rounded">
                  <p>
                    <strong>Order #12346</strong> - Placed on 2025-05-03
                  </p>
                  <p>Items: Headphones</p>
                  <p>Status: In Transit</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "wishlist" && !isLoading && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
              <div className="space-y-4">
                <div className="border p-4 rounded">
                  <p>
                    <strong>Smartphone XYZ</strong>
                  </p>
                  <p>Price: ₹30,000</p>
                </div>
                <div className="border p-4 rounded">
                  <p>
                    <strong>Wireless Earbuds</strong>
                  </p>
                  <p>Price: ₹5,000</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "coupons" && !isLoading && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">Coupons</h2>
              <div className="space-y-4">
                <div className="border p-4 rounded">
                  <p>
                    <strong>DIWALI10</strong> - 10% off on electronics
                  </p>
                  <p>Valid till: 2025-11-01</p>
                </div>
                <div className="border p-4 rounded">
                  <p>
                    <strong>FREESHIP</strong> - Free shipping on orders above ₹500
                  </p>
                  <p>Valid till: 2025-12-31</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "giftcards" && !isLoading && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">Gift Cards</h2>
              <div className="space-y-4">
                <div className="border p-4 rounded">
                  <p>
                    <strong>Gift Card #GC001</strong> - ₹1,000
                  </p>
                  <p>Expires: 2026-01-01</p>
                </div>
                <div className="border p-4 rounded">
                  <p>
                    <strong>Gift Card #GC002</strong> - ₹500
                  </p>
                  <p>Expires: 2026-06-01</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "supercoins" && !isLoading && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">SuperCoins</h2>
              <p>Your SuperCoins balance: 150</p>
              <div className="space-y-4 mt-4">
                <div className="border p-4 rounded">
                  <p>Earned 100 coins on 2025-05-01</p>
                  <p>Order #12345</p>
                </div>
                <div className="border p-4 rounded">
                  <p>Earned 50 coins on 2025-05-03</p>
                  <p>Order #12346</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "reviews" && !isLoading && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">Reviews & Ratings</h2>
              <div className="space-y-4">
                <div className="border p-4 rounded">
                  <p>
                    <strong>Laptop XYZ</strong> - Rated 4/5
                  </p>
                  <p>Review: Great performance, battery life could be better.</p>
                  <p>Date: 2025-05-02</p>
                </div>
                <div className="border p-4 rounded">
                  <p>
                    <strong>Headphones ABC</strong> - Rated 5/5
                  </p>
                  <p>Review: Amazing sound quality!</p>
                  <p>Date: 2025-05-04</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "notifications" && !isLoading && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">Notifications</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={() => toggleNotification("email")}
                      className="mr-2"
                    />
                    Email Notifications
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.sms}
                      onChange={() => toggleNotification("sms")}
                      className="mr-2"
                    />
                    SMS Notifications
                  </label>
                </div>
                <button
                  onClick={saveNotifications}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={isLoading}
                >
                  Save Preferences
                </button>
              </div>
              <div className="space-y-4 mt-4">
                <div className="border p-4 rounded">
                  <p>Order #12345 Delivered</p>
                  <p>Date: 2025-05-05</p>
                </div>
                <div className="border p-4 rounded">
                  <p>New Coupon Available</p>
                  <p>Date: 2025-05-06</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "security" && !isLoading && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">Security</h2>
              <form onSubmit={changePassword}>
                <div className="mb-4">
                  <label className="block text-gray-700">Current Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">New Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={isLoading}
                >
                  Change Password
                </button>
              </form>
              <div className="space-y-4 mt-4">
                <div className="border p-4 rounded">
                  <p>Device: iPhone 13</p>
                  <p>Last Login: 2025-05-10</p>
                </div>
                <div className="border p-4 rounded">
                  <p>Device: Windows Laptop</p>
                  <p>Last Login: 2025-05-11</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;