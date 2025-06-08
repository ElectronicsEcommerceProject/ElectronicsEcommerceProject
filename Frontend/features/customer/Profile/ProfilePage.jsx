import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import React from 'react';

const Profile = () => {
  const [user, setUser] = useState({
    firstName: 'Sunil',
    lastName: 'Kumar',
    gender: 'Male',
  });
  const [email, setEmail] = useState('rohitsweetdream@gmail.com');
  const [mobile, setMobile] = useState('+916202670526');
  const [avatar, setAvatar] = useState('https://via.placeholder.com/48');
  const [activeSection, setActiveSection] = useState('Profile Information');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const [addresses, setAddresses] = useState([
    { id: 1, address: '123 Main Street, City, Country, 123456' },
    { id: 2, address: '456 Park Avenue, City, Country, 654321' },
  ]);
  const [orders, setOrders] = useState([
    { id: 1, date: '2025-05-20', item: 'Laptop', status: 'Delivered', tracking: 'Track Here' },
    { id: 2, date: '2025-05-18', item: 'Headphones', status: 'Shipped', tracking: 'Track Here' },
    { id: 3, date: '2025-05-15', item: 'Mouse', status: 'Processing', tracking: 'Not Available' },
  ]);
  const [wishlistItems, setWishlistItems] = useState([
    { id: 1, item: 'Smartphone', price: '₹25,000' },
    { id: 2, item: 'Laptop', price: '₹65,000' },
  ]);

  const [savedUPIs, setSavedUPIs] = useState([
    { id: 1, upi: 'sunil@upi' },
    { id: 2, upi: 'sunil2@upi' },
  ]);
  const [savedCards, setSavedCards] = useState([
    { id: 1, card: '**** **** **** 1234', expiry: '12/26' },
  ]);

  const [panCard, setPanCard] = useState('ABCDE1234F');
  const [isEditingPan, setIsEditingPan] = useState(false);
  const [tempPan, setTempPan] = useState(panCard);

  const [notifications, setNotifications] = useState({
    orderUpdatesEmail: true,
    orderUpdatesSMS: true,
    promotionsEmail: false,
    promotionsSMS: false,
    accountUpdatesEmail: true,
    accountUpdatesSMS: false,
    reviewRemindersEmail: true,
    wishlistPriceDropEmail: true,
  });

  const [privacy, setPrivacy] = useState({
    shareDataWithThirdParties: false,
    allowAnalytics: true,
    allowPersonalizedAds: false,
  });
  const [consentHistory, setConsentHistory] = useState([
    { date: '2025-05-29', action: 'Updated privacy settings' },
  ]);

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    trustedDevices: [
      { id: 1, device: 'iPhone 14', remembered: true },
    ],
    activeSessions: [
      { id: 1, device: 'iPhone 14', location: 'Mumbai, IN', lastActive: '2025-05-29 17:30 IST' },
      { id: 2, device: 'MacBook Pro', location: 'Delhi, IN', lastActive: '2025-05-28 14:20 IST' },
    ],
    loginActivity: [
      { id: 1, device: 'iPhone 14', location: 'Mumbai, IN', time: '2025-05-29 17:30 IST' },
      { id: 2, device: 'MacBook Pro', location: 'Delhi, IN', time: '2025-05-28 14:20 IST' },
    ],
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle query params to set active section
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    if (section === 'orders') {
      setActiveSection('My Orders');
    } else if (section === 'wishlist') {
      setActiveSection('Wishlist');
    } else {
      setActiveSection('Profile Information');
    }
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const Sidebar = () => {
    const [activeMenu, setActiveMenu] = useState('Profile Information');
    const menuItems = [
      { name: 'MY ORDERS', icon: '🏠', subItems: [] },
      {
        name: 'ACCOUNT SETTINGS',
        icon: '👤',
        subItems: ['Profile Information', 'Manage Addresses', 'PAN Card Information'],
      },
      {
        name: 'PAYMENTS',
        icon: '💳',
        subItems: ['Saved UPI', 'Saved Cards'],
      },
      { name: 'WISHLIST', icon: '❤️', subItems: [] },
      {
        name: 'SETTINGS',
        icon: '⚙️',
        subItems: ['Notification Preferences', 'Privacy Settings', 'Account Security'],
      },
    ];

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setAvatar(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload a valid image file (PNG/JPG).');
      }
    };

    const handleMenuClick = (item, subItem) => {
      if (item === 'MY ORDERS') {
        setActiveSection('My Orders');
        setActiveMenu('My Orders');
      } else if (item === 'WISHLIST') {
        setActiveSection('Wishlist');
        setActiveMenu('Wishlist');
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
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <div className="p-4 sm:p-6 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center space-x-4">
              <img
                src={avatar || 'https://via.placeholder.com/48'}
                alt="User Avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
              />
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Hello, <span className="font-bold">{user.firstName} {user.lastName}</span>
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
                    activeMenu === item.name || item.subItems.includes(activeMenu)
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-200'
                  }`}
                  onClick={() => handleMenuClick(item.name)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                  <span className="ml-auto">{item.subItems.length > 0 ? '›' : ''}</span>
                </div>
                {item.subItems.length > 0 && (
                  <div className="ml-6">
                    {item.subItems.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        className={`px-4 py-2 text-sm flex items-center cursor-pointer rounded-lg ${
                          activeMenu === subItem
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-200'
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
        alert('First Name and Last Name are required.');
        return;
      }
      setUser(formData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    };
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    return (
      <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Personal Information</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={isEditing ? formData.firstName : user.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full p-2 border border-gray-300 rounded-lg ${
                  isEditing ? 'focus:outline-none focus:ring-2 focus:ring-blue-600' : 'bg-gray-100'
                }`}
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={isEditing ? formData.lastName : user.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full p-2 border border-gray-300 rounded-lg ${
                  isEditing ? 'focus:outline-none focus:ring-2 focus:ring-blue-600' : 'bg-gray-100'
                }`}
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Gender</label>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={(isEditing ? formData.gender : user.gender) === 'Male'}
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
                  checked={(isEditing ? formData.gender : user.gender) === 'Female'}
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
        alert('Please enter a valid email address.');
        return;
      }
      setEmail(tempEmail);
      setIsEditing(false);
      alert('Email updated successfully!');
    };

    return (
      <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Email Address</h2>
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
              isEditing ? 'focus:outline-none focus:ring-2 focus:ring-blue-600' : 'bg-gray-100'
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
        alert('Please enter a valid mobile number (e.g., +91xxxxxxxxxx).');
        return;
      }
      setMobile(tempMobile);
      setIsEditing(false);
      alert('Mobile number updated successfully!');
    };

    return (
      <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Mobile Number</h2>
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
              isEditing ? 'focus:outline-none focus:ring-2 focus:ring-blue-600' : 'bg-gray-100'
            }`}
            placeholder="Enter mobile number (e.g., +91xxxxxxxxxx)"
          />
        </div>
      </div>
    );
  };

  const PANCardInformation = () => {
    const handleEdit = () => setIsEditingPan(true);
    const handleCancel = () => {
      setTempPan(panCard);
      setIsEditingPan(false);
    };
    const handleSave = () => {
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(tempPan)) {
        alert('Please enter a valid PAN card number (e.g., ABCDE1234F).');
        return;
      }
      setPanCard(tempPan);
      setIsEditingPan(false);
      alert('PAN Card updated successfully!');
    };

    return (
      <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">PAN Card Information</h2>
          {!isEditingPan ? (
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
            type="text"
            value={isEditingPan ? tempPan : panCard}
            onChange={(e) => setTempPan(e.target.value.toUpperCase())}
            disabled={!isEditingPan}
            className={`w-full p-2 border border-gray-300 rounded-lg ${
              isEditingPan ? 'focus:outline-none focus:ring-2 focus:ring-blue-600' : 'bg-gray-100'
            }`}
            placeholder="Enter PAN card number (e.g., ABCDE1234F)"
          />
        </div>
      </div>
    );
  };

  const ManageAddresses = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [newAddress, setNewAddress] = useState('');

    const handleAddAddress = () => {
      if (!newAddress.trim()) {
        alert('Please enter a valid address.');
        return;
      }
      const newAddr = { id: addresses.length + 1, address: newAddress };
      setAddresses([...addresses, newAddr]);
      setNewAddress('');
      setIsAdding(false);
      alert('Address added successfully!');
    };

    return (
      <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Manage Addresses</h2>
          <button
            onClick={() => setIsAdding(true)}
            className="text-blue-600 hover:underline text-sm font-medium mt-2 sm:mt-0"
          >
            Add Address
          </button>
        </div>
        {isAdding && (
          <div className="mb-4">
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter new address"
            />
            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleAddAddress}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded-lg text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 text-white rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div>
          {addresses.length > 0 ? (
            <ul className="space-y-2">
              {addresses.map((addr) => (
                <li key={addr.id} className="p-2 border border-gray-200 rounded-lg text-sm">
                  {addr.address}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm">No addresses found.</p>
          )}
        </div>
      </div>
    );
  };

  const MyOrders = () => {
    const handleTrackOrder = (tracking) => {
      if (tracking === 'Not Available') {
        alert('Tracking information is not available yet.');
        return;
      }
      alert(`Tracking Link: ${tracking}`);
    };

    const handleCancelOrder = (orderId) => {
      const order = orders.find((o) => o.id === orderId);
      if (order.status !== 'Processing') {
        alert('Only orders in "Processing" status can be canceled.');
        return;
      }
      if (window.confirm('Are you sure you want to cancel this order?')) {
        setOrders(orders.filter((o) => o.id !== orderId));
        alert('Order canceled successfully!');
      }
    };

    return (
      <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">My Orders</h2>
        <div>
          {orders.length > 0 ? (
            <ul className="space-y-2">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="p-2 border border-gray-200 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">Order #{order.id}: {order.item}</p>
                    <p className="text-sm text-gray-600">Date: {order.date}</p>
                    <p className="text-sm text-gray-600">Status: {order.status}</p>
                  </div>
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleTrackOrder(order.tracking)}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      Track Order
                    </button>
                    {order.status === 'Processing' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-red-600 hover:underline text-sm font-medium"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm">No orders found.</p>
          )}
        </div>
      </div>
    );
  };

  const Wishlist = () => {
    const handleRemoveItem = (itemId) => {
      setWishlistItems(wishlistItems.filter((item) => item.id !== itemId));
      alert('Item removed from wishlist!');
    };

    const handleAddToCart = (item) => {
      alert(`${item.item} added to cart!`);
    };

    return (
      <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Wishlist</h2>
        <div>
          {wishlistItems.length > 0 ? (
            <ul className="space-y-2">
              {wishlistItems.map((item) => (
                <li
                  key={item.id}
                  className="p-2 border border-gray-200 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.item}</p>
                    <p className="text-sm text-gray-600">{item.price}</p>
                  </div>
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:underline text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm">No items in your wishlist.</p>
          )}
        </div>
      </div>
    );
  };

  const SavedUPI = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [newUPI, setNewUPI] = useState('');

    const handleAddUPI = () => {
      if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/.test(newUPI)) {
        alert('Please enter a valid UPI ID (e.g., user@upi).');
        return;
      }
      const newUPIEntry = { id: savedUPIs.length + 1, upi: newUPI };
      setSavedUPIs([...savedUPIs, newUPIEntry]);
      setNewUPI('');
      setIsAdding(false);
      alert('UPI added successfully!');
    };

    const handleRemoveUPI = (upiId) => {
      setSavedUPIs(savedUPIs.filter((upi) => upi.id !== upiId));
      alert('UPI removed successfully!');
    };

    return (
      <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Saved UPI</h2>
          <button
            onClick={() => setIsAdding(true)}
            className="text-blue-600 hover:underline text-sm font-medium mt-2 sm:mt-0"
          >
            Add UPI
          </button>
        </div>
        {isAdding && (
          <div className="mb-4">
            <input
              type="text"
              value={newUPI}
              onChange={(e) => setNewUPI(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter UPI ID (e.g., user@upi)"
            />
            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleAddUPI}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded-lg text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 text-white rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div>
          {savedUPIs.length > 0 ? (
            <ul className="space-y-2">
              {savedUPIs.map((upi) => (
                <li
                  key={upi.id}
                  className="p-2 border border-gray-200 rounded-lg flex items-center justify-between"
                >
                  <p className="text-sm text-gray-800">{upi.upi}</p>
                  <button
                    onClick={() => handleRemoveUPI(upi.id)}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm">No saved UPI IDs found.</p>
          )}
        </div>
      </div>
    );
  };

  const SavedCards = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [newCard, setNewCard] = useState({ number: '', expiry: '' });

    const handleAddCard = () => {
      if (!/^\d{16}$/.test(newCard.number.replace(/\s/g, ''))) {
        alert('Please enter a valid 16-digit card number.');
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(newCard.expiry)) {
        alert('Please enter a valid expiry date (MM/YY).');
        return;
      }
      const newCardEntry = {
        id: savedCards.length + 1,
        card: `**** **** **** ${newCard.number.slice(-4)}`,
        expiry: newCard.expiry,
      };
      setSavedCards([...savedCards, newCardEntry]);
      setNewCard({ number: '', expiry: '' });
      setIsAdding(false);
      alert('Card added successfully!');
    };

    const handleRemoveCard = (cardId) => {
      setSavedCards(savedCards.filter((card) => card.id !== cardId));
      alert('Card removed successfully!');
    };

    return (
      <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Saved Cards</h2>
          <button
            onClick={() => setIsAdding(true)}
            className="text-blue-600 hover:underline text-sm font-medium mt-2 sm:mt-0"
          >
            Add Card
          </button>
        </div>
        {isAdding && (
          <div className="mb-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                value={newCard.number}
                onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter card number (16 digits)"
                maxLength="16"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="text"
                value={newCard.expiry}
                onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="MM/YY"
                maxLength="5"
              />
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleAddCard}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded-lg text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 text-white rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div>
          {savedCards.length > 0 ? (
            <ul className="space-y-2">
              {savedCards.map((card) => (
                <li
                  key={card.id}
                  className="p-2 border border-gray-200 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-gray-800">{card.card}</p>
                    <p className="text-sm text-gray-600">Expires: {card.expiry}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveCard(card.id)}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm">No saved cards found.</p>
          )}
        </div>
      </div>
    );
  };

  const NotificationPreferences = () => {
    const handleNotificationChange = (e) => {
      const { name, checked } = e.target;
      setNotifications({ ...notifications, [name]: checked });
    };

    const handleSaveNotifications = () => {
      alert('Notification preferences updated successfully!');
    };

    return (
      <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Order Updates</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="orderUpdatesEmail"
                checked={notifications.orderUpdatesEmail}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-600">Email Notifications</span>
            </label>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                name="orderUpdatesSMS"
                checked={notifications.orderUpdatesSMS}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-600">SMS Notifications</span>
            </label>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Promotions & Offers</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="promotionsEmail"
                checked={notifications.promotionsEmail}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-600">Email Notifications</span>
            </label>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                name="promotionsSMS"
                checked={notifications.promotionsSMS}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-600">SMS Notifications</span>
            </label>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Account Updates</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="accountUpdatesEmail"
                checked={notifications.accountUpdatesEmail}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-600">Email Notifications</span>
            </label>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                name="accountUpdatesSMS"
                checked={notifications.accountUpdatesSMS}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-600">SMS Notifications</span>
            </label>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Review Reminders</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="reviewRemindersEmail"
                checked={notifications.reviewRemindersEmail}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-600">Email Notifications</span>
            </label>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Wishlist Price Drop Alerts</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="wishlistPriceDropEmail"
                checked={notifications.wishlistPriceDropEmail}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-600">Email Notifications</span>
            </label>
          </div>
          <button
            onClick={handleSaveNotifications}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded-lg text-sm font-medium mt-4"
          >
            Save Preferences
          </button>
        </div>
      </div>
    );
  };

  const PrivacySettings = () => {
    const handlePrivacyChange = (e) => {
      const { name, checked } = e.target;
      setPrivacy({ ...privacy, [name]: checked });
    };

    const handleDownloadData = () => {
      alert('Your data download request has been initiated. You will receive an email shortly.');
    };

    const handleDeleteAccount = () => {
      if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        alert('Your account has been deleted. You will be logged out.');
        setUser({ firstName: '', lastName: '', gender: '' });
        setEmail('');
        setMobile('');
        setAvatar('');
        setActiveSection('Profile Information');
      }
    };

    const handleRequestDataCorrection = () => {
      alert('Your data correction request has been submitted. We will contact you for further details.');
    };

    const handleSavePrivacy = () => {
      setConsentHistory([...consentHistory, { date: '2025-06-06', action: 'Updated privacy settings' }]);
      alert('Privacy settings updated successfully!');
    };

    return (
      <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Privacy Settings</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Data Sharing</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="shareDataWithThirdParties"
                checked={privacy.shareDataWithThirdParties}
                onChange={handlePrivacyChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-600">Share data with third parties for marketing</span>
            </label>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                name="allowAnalytics"
                checked={privacy.allowAnalytics}
                onChange={handlePrivacyChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-600">Allow analytics for improving services</span>
            </label>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                name="allowPersonalizedAds"
                checked={privacy.allowPersonalizedAds}
                onChange={handlePrivacyChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-600">Allow personalized ads</span>
            </label>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Manage Your Data</h3>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
              <button
                onClick={handleDownloadData}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Download My Data
              </button>
              <button
                onClick={handleRequestDataCorrection}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Request Data Correction
              </button>
              <button
                onClick={handleDeleteAccount}
                className="text-red-600 hover:underline text-sm font-medium"
              >
                Delete My Account
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Privacy Policy</h3>
            <a
              href="https://example.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              View our Privacy Policy
            </a>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Consent History</h3>
            {consentHistory.length > 0 ? (
              <ul className="space-y-2">
                {consentHistory.map((entry, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {entry.date}: {entry.action}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">No consent history available.</p>
            )}
          </div>
          <button
            onClick={handleSavePrivacy}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded-lg text-sm font-medium mt-4"
          >
            Save Settings
          </button>
        </div>
      </div>
    );
  };

  const AccountSecurity = () => {
    const handle2FAChange = (e) => {
      const { checked } = e.target;
      setSecurity({ ...security, twoFactorAuth: checked });
      alert(`Two-Factor Authentication ${checked ? 'enabled' : 'disabled'} successfully!`);
    };

    const handleChangePassword = () => {
      if (newPassword.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }
      alert('Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
    };

    const handleSignOutSession = (sessionId) => {
      setSecurity({
        ...security,
        activeSessions: security.activeSessions.filter((session) => session.id !== sessionId),
      });
      alert('Session signed out successfully!');
    };

    const handleToggleTrustedDevice = (deviceId) => {
      setSecurity({
        ...security,
        trustedDevices: security.trustedDevices.map((device) =>
          device.id === deviceId ? { ...device, remembered: !device.remembered } : device
        ),
      });
      alert('Trusted device updated successfully!');
    };

    return (
      <div className="mb-6 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Account Security</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Two-Factor Authentication</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={security.twoFactorAuth}
                onChange={handle2FAChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-600">Enable Two-Factor Authentication</span>
            </label>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Trusted Devices</h3>
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
                        device.remembered ? 'text-blue-600 hover:underline' : 'text-gray-600 hover:underline'
                      }`}
                    >
                      {device.remembered ? 'Remove from Trusted' : 'Add to Trusted'}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No trusted devices found.</p>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
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
            <h3 className="text-sm font-medium text-gray-700 mb-2">Active Sessions</h3>
            {security.activeSessions.length > 0 ? (
              <ul className="space-y-2">
                {security.activeSessions.map((session) => (
                  <li
                    key={session.id}
                    className="flex items-center justify-between p-2 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">{session.device}</p>
                      <p className="text-sm text-gray-600">Location: {session.location}</p>
                      <p className="text-sm text-gray-600">Last Active: {session.lastActive}</p>
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
            <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Login Activity</h3>
            {security.loginActivity.length > 0 ? (
              <ul className="space-y-2">
                {security.loginActivity.map((activity) => (
                  <li
                    key={activity.id}
                    className="p-2 border border-gray-200 rounded-lg"
                  >
                    <p className="text-sm font-medium text-gray-800">{activity.device}</p>
                    <p className="text-sm text-gray-600">Location: {activity.location}</p>
                    <p className="text-sm text-gray-600">Time: {activity.time}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No recent login activity found.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Profile Information':
        return (
          <>
            <PersonalInformation />
            <EmailAddress />
            <MobileNumber />
          </>
        );
      case 'Manage Addresses':
        return <ManageAddresses />;
      case 'PAN Card Information':
        return <PANCardInformation />;
      case 'My Orders':
        return <MyOrders />;
      case 'Wishlist':
        return <Wishlist />;
      case 'Saved UPI':
        return <SavedUPI />;
      case 'Saved Cards':
        return <SavedCards />;
      case 'Notification Preferences':
        return <NotificationPreferences />;
      case 'Privacy Settings':
        return <PrivacySettings />;
      case 'Account Security':
        return <AccountSecurity />;
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
          isSidebarOpen ? 'ml-0 md:ml-72' : 'ml-0 md:ml-72'
        } md:max-w-4xl mx-auto pt-16 md:pt-0`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;