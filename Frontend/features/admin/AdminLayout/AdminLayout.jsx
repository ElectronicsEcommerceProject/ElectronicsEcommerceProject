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
import AdminHeader from "../../../components/Header/AdminHeader";

// Import section components
import Dashboard from "../Dashboard/AdminDashboard";
import ProductManagement from "../ProductManagement/ProductDashboard";
import OrderManagement from "../OrderDashboard/OrderDashboard";
import UserManagement from "../UserManagement/UserDashboard";
import ReviewManagement from "../ReviewManagement/ReviewDashboard";
import CouponsOffers from "../CouponManagement/CouponDashboard";
import Notifications from "../NotificationManagement/NotificationPage";
import ReportsAnalytics from "../AnalyticManagement/AnalyticDashboard";

const AdminLayout = () => {
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleAccordion = () => {
    setAccordionOpen(!accordionOpen);
  };

  const logout = () => {
    alert("Logged out successfully!");
    setShowLogoutModal(false);
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="bg-gray-100 font-sans min-h-screen flex flex-col">
      {/* Header */}
      <AdminHeader
        notifications={notifications}
        dismissNotification={dismissNotification}
      />

      {/* Container for Sidebar and Main Content */}
      <div className="flex flex-1 pt-2">
        {/* Mobile toggle button */}
        <button
          className="md:hidden fixed top-[4.5rem] left-4 z-50 bg-gray-800 text-white p-2 rounded"
          onClick={toggleSidebar}
        >
          ☰
        </button>

        {/* Logout modal */}
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

        {/* Sidebar (Drawer) */}
        <aside
          className={`w-64 bg-white shadow-md p-4 fixed left-0 h-[calc(100vh-4.5rem)] z-40 transition-transform duration-300 ease-in-out overflow-y-auto top-[4.5rem] ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <nav className="space-y-2">
            <div>
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

        {/* Main content */}
        <main className="flex-1 md:ml-64 min-h-screen">
          {activeSection === "dashboard" && <Dashboard />}
          {activeSection === "products" && <ProductManagement />}
          {activeSection === "orders" && <OrderManagement />}
          {activeSection === "users" && <UserManagement />}
          {activeSection === "reviews" && <ReviewManagement />}
          {activeSection === "coupans" && <CouponsOffers />}
          {activeSection === "notifications" && <Notifications />}
          {activeSection === "reports" && <ReportsAnalytics />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
