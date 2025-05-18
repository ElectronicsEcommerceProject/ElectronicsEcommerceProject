import React from "react";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiShoppingBag,
  FiDollarSign,
  FiSettings,
  FiMessageSquare,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle,
  FiDownload,
  FiLogOut,
  FiEye,
} from "react-icons/fi";
import { FaStore, FaProductHunt } from "react-icons/fa";
import { User } from "lucide-react";
import { useState, useEffect } from "react";

import {
  getApi,
  MESSAGE,
  userManagmentDashboardUsersOrdersDataRoute,
} from "../../../src/index.js";

const UserProfileView = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    role: "All",
    status: "All",
    search: "",
    sortBy: "Date Joined",
  });
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await getApi(
          userManagmentDashboardUsersOrdersDataRoute
        );
        if (
          response &&
          response.success === true &&
          Array.isArray(response.data)
        ) {
          // Transform the response to match the expected format in our app
          const transformedUsers = response.data.map((user) => ({
            id: user.user_id,
            name: user.name,
            email: user.email,
            phone: user.phone_number || "", // Handle if phone_number isn't in the response
            role: user.role.charAt(0).toUpperCase() + user.role.slice(1), // Capitalize the role
            status: user.status.charAt(0).toUpperCase() + user.status.slice(1), // Capitalize the status
            orders: user.orderCount || 0,
            revenue: user.totalSpent || 0,
            createdDate: new Date(user.createdAt).toISOString().split("T")[0], // Format date to YYYY-MM-DD
            lastLogin: new Date(user.updatedAt).toISOString().split("T")[0], // Using updatedAt as lastLogin
            notes: [], // Default empty notes
            totalSpent: user.totalSpent || 0,
            orderStatusCounts: user.orderStatusCounts || {
              pending: 0,
              processing: 0,
              shipped: 0,
              delivered: 0,
              cancelled: 0,
              returned: 0,
            },
            reviews: [], // Default empty reviews
            products: [], // Default empty products
          }));

          setUsers(transformedUsers);
        } else {
          console.error("Invalid response format:", response);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  const filteredUsers = users
    .filter((user) => {
      const matchesRole = filters.role === "All" || user.role === filters.role;
      const matchesStatus =
        filters.status === "All" || user.status === filters.status;
      const matchesSearch =
        filters.search === "" ||
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        (user.phone && user.phone.includes(filters.search));
      return matchesRole && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (filters.sortBy === "Date Joined")
        return new Date(b.createdDate) - new Date(a.createdDate);
      if (filters.sortBy === "Order Count") return b.orders - a.orders;
      if (filters.sortBy === "Revenue") return b.revenue - a.revenue;
      return 0;
    });

  const tabs = [
    { id: "general", label: "General Info", icon: <FiUser className="mr-2" /> },
    { id: "orders", label: "Orders", icon: <FiShoppingBag className="mr-2" /> },
    ...(selectedUser?.role === "Customer"
      ? [
          {
            id: "reviews",
            label: "Reviews",
            icon: <FiMessageSquare className="mr-2" />,
          },
        ]
      : []),
    ...(selectedUser?.role === "Retailer"
      ? [
          {
            id: "products",
            label: "Products",
            icon: <FaProductHunt className="mr-2" />,
          },
        ]
      : []),
    {
      id: "actions",
      label: "Admin Actions",
      icon: <FiSettings className="mr-2" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedUser ? (
        // User Detail View
        <div className="p-6 md:p-8 bg-gray-100 min-h-screen">
          <div className="flex items-center mb-6">
            <button
              className="flex items-center text-teal-600 hover:text-teal-800 mr-4 transition-colors"
              onClick={() => setSelectedUser(null)}
            >
              <FiArrowLeft className="mr-1" /> Back
            </button>
            <h2 className="text-2xl font-semibold text-gray-900">
              {selectedUser.name}'s Profile
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Tab Navigation */}
            <div className="md:w-1/4 bg-white p-4 rounded-lg shadow-lg">
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li
                    key={tab.id}
                    className={`p-3 rounded-lg cursor-pointer flex items-center ${
                      activeTab === tab.id
                        ? "bg-teal-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    } transition-colors`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tab Content */}
            <div className="md:w-3/4 bg-white p-6 rounded-lg shadow-lg transition-all hover:shadow-xl">
              {activeTab === "general" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    General Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <FiUser className="text-gray-500 mr-2" />
                      <span>
                        <strong>Name:</strong> {selectedUser.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiMail className="text-gray-500 mr-2" />
                      <span>
                        <strong>Email:</strong> {selectedUser.email}
                      </span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center">
                        <FiPhone className="text-gray-500 mr-2" />
                        <span>
                          <strong>Phone:</strong> {selectedUser.phone}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center">
                      {selectedUser.role === "Retailer" ? (
                        <FaStore className="text-gray-500 mr-2" />
                      ) : (
                        <FiUser className="text-gray-500 mr-2" />
                      )}
                      <span>
                        <strong>Role:</strong> {selectedUser.role}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="text-gray-500 mr-2" />
                      <span>
                        <strong>Created Date:</strong>{" "}
                        {selectedUser.createdDate}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="text-gray-500 mr-2" />
                      <span>
                        <strong>Last Login:</strong> {selectedUser.lastLogin}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {selectedUser.status === "Active" ? (
                        <FiCheckCircle className="text-green-500 mr-2" />
                      ) : selectedUser.status === "Pending" ? (
                        <FiClock className="text-yellow-500 mr-2" />
                      ) : (
                        <FiAlertCircle className="text-red-500 mr-2" />
                      )}
                      <span>
                        <strong>Status:</strong> {selectedUser.status}
                      </span>
                    </div>
                    {selectedUser.notes && selectedUser.notes.length > 0 && (
                      <div className="flex items-center">
                        <FiMessageSquare className="text-gray-500 mr-2" />
                        <span>
                          <strong>Notes/Tags:</strong>{" "}
                          {selectedUser.notes.join(", ") || "None"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Information
                  </h3>
                  <div className="flex items-center mb-2">
                    <FiShoppingBag className="text-gray-500 mr-2" />
                    <span>
                      <strong>Total Orders:</strong> {selectedUser.orders}
                    </span>
                  </div>
                  <div className="flex items-center mb-4">
                    <FiDollarSign className="text-gray-500 mr-2" />
                    <span>
                      <strong>
                        Total{" "}
                        {selectedUser.role === "Customer" ? "Spent" : "Revenue"}
                        :
                      </strong>{" "}
                      ${selectedUser.totalSpent.toFixed(2)}
                    </span>
                  </div>

                  {/* Order Status Counts */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-700 mb-3">
                      Order Status Breakdown:
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(selectedUser.orderStatusCounts).map(
                        ([status, count]) =>
                          count > 0 && (
                            <div
                              key={status}
                              className="bg-gray-50 p-3 rounded-lg border border-gray-100"
                            >
                              <div className="text-sm text-gray-500 capitalize">
                                {status}
                              </div>
                              <div className="text-2xl font-semibold">
                                {count}
                              </div>
                            </div>
                          )
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4">
                    {["Delivered", "Cancelled", "Returned"].map((filter) => (
                      <button
                        key={filter}
                        className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                  <a
                    href="#"
                    className="flex items-center text-teal-600 hover:text-teal-800 mt-4 transition-colors"
                  >
                    <FiEye className="mr-1" /> View Full Order List
                  </a>
                </div>
              )}

              {activeTab === "reviews" && selectedUser.role === "Customer" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Reviews
                  </h3>
                  <div className="flex items-center mb-4">
                    <FiMessageSquare className="text-gray-500 mr-2" />
                    <span>
                      <strong>Number of Reviews:</strong>{" "}
                      {selectedUser.reviews.length}
                    </span>
                  </div>
                  {selectedUser.reviews.length > 0 ? (
                    selectedUser.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="border-t border-gray-100 pt-4 mt-4"
                      >
                        <div className="flex items-center">
                          <FiShoppingBag className="text-gray-500 mr-2" />
                          <span>
                            <strong>Product:</strong> {review.product}
                          </span>
                        </div>
                        <div className="flex items-center mt-2">
                          <FiCheckCircle className="text-yellow-500 mr-2" />
                          <span>
                            <strong>Rating:</strong> {review.rating}/5
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No reviews available.</p>
                  )}
                </div>
              )}

              {activeTab === "products" && selectedUser.role === "Retailer" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Product List
                  </h3>
                  {selectedUser.products.length > 0 ? (
                    selectedUser.products.map((product, index) => (
                      <div
                        key={index}
                        className="border-t border-gray-100 pt-4 mt-4"
                      >
                        <div className="flex items-center">
                          <FaProductHunt className="text-gray-500 mr-2" />
                          <span>
                            <strong>Name:</strong> {product.name}
                          </span>
                        </div>
                        <div className="flex items-center mt-2">
                          {product.status === "Published" ? (
                            <FiCheckCircle className="text-green-500 mr-2" />
                          ) : (
                            <FiXCircle className="text-red-500 mr-2" />
                          )}
                          <span>
                            <strong>Status:</strong> {product.status}
                          </span>
                        </div>
                        <div className="flex items-center mt-2">
                          <FiShoppingBag className="text-gray-500 mr-2" />
                          <span>
                            <strong>Stock:</strong> {product.stock}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No products available.</p>
                  )}
                </div>
              )}

              {activeTab === "actions" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Admin Actions
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        title: "Status Control",
                        icon: <FiCheckCircle className="mr-2" />,
                        actions: ["Activate", "Deactivate", "Ban"],
                      },
                      {
                        title: "Security Actions",
                        icon: <FiLogOut className="mr-2" />,
                        actions: ["Reset Password", "Force Logout"],
                      },
                      {
                        title: "Export & Reports",
                        icon: <FiDownload className="mr-2" />,
                        actions: ["Export Order History", "Export Profile"],
                      },
                    ].map((group) => (
                      <div key={group.title} className="mb-4">
                        <h4 className="font-medium text-gray-700 flex items-center mb-2">
                          {group.icon}
                          {group.title}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {group.actions.map((action) => (
                            <button
                              key={action}
                              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm w-full"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // User List View
        <div className="p-6 md:p-8">
          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <select
              className="border border-gray-200 p-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-teal-500"
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            >
              <option>All</option>
              <option>Customer</option>
              <option>Retailer</option>
              <option>Admin</option>
            </select>
            <select
              className="border border-gray-200 p-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-teal-500"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Banned</option>
              <option>Pending</option>
            </select>
            <input
              type="text"
              placeholder="Search by Name, Email, Phone"
              className="border border-gray-200 p-3 rounded-lg w-64 shadow-sm focus:ring-2 focus:ring-teal-500"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
            <select
              className="border border-gray-200 p-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-teal-500"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({ ...filters, sortBy: e.target.value })
              }
            >
              <option>Date Joined</option>
              <option>Order Count</option>
              <option>Revenue</option>
            </select>
          </div>

          {/* User Table */}
          {filteredUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No users found.</p>
          ) : (
            <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg">
              <table className="w-full border-collapse bg-white">
                <thead className="sticky top-0 bg-gray-50">
                  <tr className="text-gray-700">
                    <th className="border-b p-4 text-left">Name</th>
                    <th className="border-b p-4 text-left">Email</th>
                    <th className="border-b p-4 text-left">Role</th>
                    <th className="border-b p-4 text-left">Status</th>
                    <th className="border-b p-4 text-left">Orders</th>
                    <th className="border-b p-4 text-left">Revenue</th>
                    <th className="border-b p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedUser(user)}
                    >
                      <td className="border-b p-4 flex items-center">
                        {user.role === "Retailer" ? (
                          <FaStore className="text-gray-500 mr-2" />
                        ) : (
                          <FiUser className="text-gray-500 mr-2" />
                        )}
                        {user.name}
                      </td>
                      <td className="border-b p-4">{user.email}</td>
                      <td className="border-b p-4">{user.role}</td>
                      <td className="border-b p-4">
                        <span
                          className={`px-2 py-1 rounded text-sm flex items-center ${
                            user.status === "Active"
                              ? "bg-teal-100 text-teal-700"
                              : user.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : user.status === "Banned"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.status === "Active" ? (
                            <FiCheckCircle className="mr-1" />
                          ) : user.status === "Pending" ? (
                            <FiClock className="mr-1" />
                          ) : (
                            <FiAlertCircle className="mr-1" />
                          )}
                          {user.status}
                        </span>
                      </td>
                      <td className="border-b p-4">{user.orders}</td>
                      <td className="border-b p-4">
                        ${user.revenue.toFixed(2)}
                      </td>
                      <td className="border-b p-4">
                        <button
                          className="flex items-center text-teal-600 hover:text-teal-800 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser(user);
                          }}
                        >
                          <FiEye className="mr-1" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile View */}
          {filteredUsers.length > 0 && (
            <div className="md:hidden space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white p-4 rounded-lg shadow-lg cursor-pointer transition-all hover:shadow-md"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center mb-2">
                    {user.role === "Retailer" ? (
                      <FaStore className="text-gray-500 mr-2" />
                    ) : (
                      <FiUser className="text-gray-500 mr-2" />
                    )}
                    <h3 className="font-medium">{user.name}</h3>
                  </div>
                  <div className="flex items-center mb-2">
                    <FiMail className="text-gray-500 mr-2" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        user.status === "Active"
                          ? "bg-teal-100 text-teal-700"
                          : user.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : user.status === "Banned"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="text-sm text-gray-600">
                      <FiShoppingBag className="inline mr-1" /> Orders:{" "}
                      {user.orders}
                    </div>
                    <div className="text-sm text-gray-600">
                      <FiDollarSign className="inline mr-1" /> $
                      {user.revenue.toFixed(2)}
                    </div>
                  </div>
                  <button
                    className="flex items-center text-teal-600 hover:text-teal-800 mt-2 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUser(user);
                    }}
                  >
                    <FiEye className="mr-1" /> View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfileView;
