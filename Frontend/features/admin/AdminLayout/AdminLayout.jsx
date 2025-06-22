import React, { useState } from "react";
import {
  House,
  Package,
  ShoppingCartSimple,
  UsersThree,
  Star,
  Ticket,
  BellRinging,
  ChartBar,
  SignOut,
  CaretDown,
} from "phosphor-react";

import {
  Dashboard,
  ProductManagement,
  OrderManagement,
  UserManagement,
  ReviewManagement,
  CouponsOffers,
  Notifications,
  ReportsAnalytics,
  AdminHeader,
  NotificationPage,
  StockManagement,
  isAuthenticated,
} from "../../../features/index.js";

const AdminLayout = () => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <AdminHeader notifications={[]} dismissNotification={() => {}} />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 text-center mb-6">
              You need to be logged in to access the admin panel.
            </p>
            <p className="text-sm text-gray-500 text-center">
              Please use the login button in the header above.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "warning",
      message: "Low stock alert: Product A is running low.",
    },
    {
      id: 2,
      type: "error",
      message: "Pending return request for Order ORD003.",
    },
  ]);

  // Sidebar navigation items
  const menuItems = [
    {
      label: "Dashboard",
      section: "dashboard",
      icon: <House size={24} weight="bold" className="text-blue-600" />,
    },
    {
      label: "Product Management",
      section: "products",
      icon: <Package size={24} weight="bold" className="text-orange-500" />,
    },
    {
      label: "Order Management",
      section: "orders",
      icon: (
        <ShoppingCartSimple size={24} weight="bold" className="text-red-500" />
      ),
    },
    {
      label: "Stock Management",
      section: "stock",
      icon: <Package size={24} weight="duotone" className="text-blue-500" />,
    },
    {
      label: "User Management",
      section: "users",
      icon: <UsersThree size={24} weight="bold" className="text-green-500" />,
    },
    {
      label: "Review Management",
      section: "reviews",
      icon: <Star size={24} weight="bold" className="text-yellow-500" />,
    },
    {
      label: "Coupons & Offers",
      section: "coupans",
      icon: <Ticket size={24} weight="bold" className="text-purple-500" />,
    },
    {
      label: "Notifications",
      section: "notifications",
      icon: <BellRinging size={24} weight="bold" className="text-pink-500" />,
    },
    {
      label: "Reports & Analytics",
      section: "reports",
      icon: <ChartBar size={24} weight="bold" className="text-teal-500" />,
    },
    {
      label: "Logout",
      section: "logout",
      icon: <SignOut size={24} weight="bold" className="text-red-600" />,
    },
  ];

  // Handle section switch
  const handleSectionChange = (section) => {
    if (section === "logout") {
      setShowLogoutModal(true);
    } else {
      setActiveSection(section);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle menu accordion
  const toggleAccordion = () => {
    setAccordionOpen(!accordionOpen);
  };

  // Simulated logout
  const logout = () => {
    alert("Logged out successfully!");
    setShowLogoutModal(false);
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="bg-gray-100 font-sans min-h-screen flex flex-col">
      {/* Fixed Header (height: 72px) */}
      <AdminHeader
        notifications={notifications}
        dismissNotification={dismissNotification}
      />

      {/* Button to toggle sidebar (mobile only) */}
      <button
        className="md:hidden fixed top-[72px] left-4 z-50 bg-gray-800 text-white p-2 rounded"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      {/* Logout Modal */}
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

      <div className="flex flex-1">
        {/* Sidebar - starts just below header */}
        <aside
          className={`w-64 bg-white shadow-md p-4 fixed left-0 top-[72px] h-[calc(100vh-72px)] z-40 transition-transform duration-300 ease-in-out overflow-y-auto ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <nav className="space-y-2">
            <div>
              {/* Menu Title Accordion */}
              <div
                className="flex items-center justify-between px-4 py-2 cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                onClick={toggleAccordion}
              >
                <span className="text-sm font-medium">Menu</span>
                <CaretDown
                  size={20}
                  weight="bold"
                  className={`transition-transform duration-200 ${
                    accordionOpen ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </div>

              {/* Menu Items */}
              <div
                className={`space-y-2 overflow-hidden transition-all duration-300 ${
                  accordionOpen ? "max-h-screen" : "max-h-0"
                }`}
              >
                {menuItems.map((item) => (
                  <div
                    key={item.section}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 relative ${
                      activeSection === item.section &&
                      item.section !== "logout"
                        ? "bg-purple-100 text-purple-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                    } ${item.section === "logout" ? "text-red-600" : ""}`}
                    onClick={() => handleSectionChange(item.section)}
                  >
                    {activeSection === item.section &&
                      item.section !== "logout" && (
                        <span className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r" />
                      )}
                    <div className="flex items-center gap-2">{item.icon}</div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content Area - padded below fixed header */}
        <main className="flex-1 pt-[130px] md:ml-64 px-4 pb-6">
          {activeSection === "dashboard" && <Dashboard />}
          {activeSection === "products" && <ProductManagement />}
          {activeSection === "orders" && <OrderManagement />}
          {activeSection === "stock" && <StockManagement />}
          {activeSection === "users" && <UserManagement />}
          {activeSection === "reviews" && <ReviewManagement />}
          {activeSection === "coupans" && <CouponsOffers />}
          {activeSection === "notifications" && <NotificationPage />}
          {activeSection === "reports" && <ReportsAnalytics />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
