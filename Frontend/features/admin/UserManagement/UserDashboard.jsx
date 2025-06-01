import React, { useState, useEffect } from "react";
import { UserProfileView } from "../../../features/admin/index.js";
import { jsPDF } from "jspdf";
import {
  FiDownload,
  FiFileText,
  FiUser,
  FiShoppingBag,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import {
  getApi,
  userManagmentDashboardDataRoute,
  userManagmentDashboardUsersOrdersDataRoute,
  MESSAGE,
} from "../../../src/index.js";

const UserDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [userManagementDashboardData, setUserManagementDashboardData] =
    useState({
      totalUsers: 0,
      activeCustomers: 0,
      activeRetailers: 0,
      activeUsers: 0,
      suspendedUsers: 0,
      pendingRetailers: 0,
      newSignups: 0,
      avgOrdersPerUser: 0,
      avgRevenuePerUser: 0,
      topBuyers: [],
      topSellers: [],
    });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    role: "All",
    status: "All",
    search: "",
    sortBy: "Date Joined",
  });

  useEffect(() => {
    const fetchUserManagementDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getApi(userManagmentDashboardDataRoute);
        if (response.success === true) {
          setUserManagementDashboardData(response.data);
          setError(null);
        } else {
          setError("Failed to fetch dashboard data");
          console.error("Error fetching data:", response);
        }
      } catch (error) {
        setError("An error occurred while fetching data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserManagementDashboardData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getApi(
          userManagmentDashboardUsersOrdersDataRoute
        );
        if (
          response &&
          response.success === true &&
          Array.isArray(response.data)
        ) {
          const transformedUsers = response.data.map((user) => ({
            id: user.user_id,
            name: user.name,
            email: user.email,
            phone: user.phone_number || "",
            role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
            status: user.status.charAt(0).toUpperCase() + user.status.slice(1),
            orders: user.orderCount || 0,
            revenue: user.totalSpent || 0,
            createdDate: new Date(user.createdAt).toISOString().split("T")[0],
            lastLogin: new Date(user.updatedAt).toISOString().split("T")[0],
            totalSpent: user.totalSpent || 0,
          }));
          setUsers(transformedUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Function to filter users based on current filters
  const filterUsers = () => {
    const filtered = users
      .filter((user) => {
        const matchesRole =
          filters.role === "All" || user.role === filters.role;
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

    setFilteredUsers(filtered);
  };

  // Update filtered users when filters or users change
  useEffect(() => {
    filterUsers();
  }, [users, filters]);

  const exportUsersToCsv = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add headers
    csvContent +=
      "Name,Email,Phone,Role,Status,Orders,Revenue,Date Joined,Last Login\n";

    // Add user data
    filteredUsers.forEach((user) => {
      const row = [
        user.name,
        user.email,
        user.phone || "N/A",
        user.role,
        user.status,
        user.orders,
        `₹${user.revenue.toFixed(2)}`,
        user.createdDate,
        user.lastLogin,
      ].join(",");

      csvContent += row + "\n";
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `users_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);

    // Trigger download
    link.click();
    document.body.removeChild(link);
  };

  const exportUsersToPdf = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("User Management Export", 14, 22);

    // Add filter information
    doc.setFontSize(11);
    doc.text(
      `Applied Filters: Role: ${filters.role}, Status: ${filters.status}${
        filters.search ? `, Search: "${filters.search}"` : ""
      }`,
      14,
      30
    );

    // Add timestamp and count
    doc.setFontSize(10);
    doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 14, 38);
    doc.text(`Total Users: ${filteredUsers.length}`, 14, 44);

    // Table headers
    const headers = ["Name", "Email", "Role", "Status", "Orders", "Revenue"];
    let y = 55;

    // Draw header row
    doc.setFillColor(240, 240, 240);
    doc.rect(14, y - 5, 180, 8, "F");
    doc.setFont("helvetica", "bold");

    headers.forEach((header, i) => {
      const x = 14 + i * 30;
      doc.text(header, x, y);
    });

    // Draw data rows
    doc.setFont("helvetica", "normal");

    // Limit the number of rows to prevent oversized PDFs
    const maxUsersPerPage = 25;
    const usersToPrint = filteredUsers.slice(0, maxUsersPerPage);

    usersToPrint.forEach((user, index) => {
      y += 8;
      doc.text(user.name.substring(0, 15), 14, y);
      doc.text(user.email.substring(0, 15), 44, y);
      doc.text(user.role, 74, y);
      doc.text(user.status, 104, y);
      doc.text(user.orders.toString(), 134, y);
      doc.text(`₹${user.revenue.toFixed(2)}`, 164, y);
    });

    // Add note if more users exist
    if (filteredUsers.length > maxUsersPerPage) {
      y += 10;
      doc.text(
        `... and ${filteredUsers.length - maxUsersPerPage} more users`,
        14,
        y
      );
    }

    // Save the PDF
    doc.save(`users_export_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        .gradient-border {
          position: relative;
          border-radius: 0.75rem;
          background-clip: padding-box;
        }
        .gradient-border::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(to right, #facc15, #3b82f6);
          border-radius: 0.75rem;
          padding: 2px;
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
      <nav className="bg-white shadow-md p-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex gap-4 mb-3 sm:mb-0">
          <button
            onClick={() => setActivePage("dashboard")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activePage === "dashboard"
                ? "bg-blue-500 text-white border-b-2 border-blue-700"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActivePage("users")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activePage === "users"
                ? "bg-blue-500 text-white border-b-2 border-blue-700"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            User Management
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={exportUsersToCsv}
          >
            <FiDownload className="mr-2" /> Export CSV
          </button>
          <button
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={exportUsersToPdf}
          >
            <FiFileText className="mr-2" /> Export PDF
          </button>
        </div>
      </nav>

      <main className="p-6">
        {activePage === "dashboard" &&
          (loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          ) : (
            <DashboardContent data={userManagementDashboardData} />
          ))}
        {activePage === "users" && (
          <UserProfileView
            onFilterChange={handleFilterChange}
            filters={filters}
          />
        )}
      </main>
    </div>
  );
};

const DashboardContent = ({ data }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="gradient-border bg-white p-6 rounded-xl shadow-md">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiUser className="w-5 h-5 mr-2 text-blue-500" />
            Total Users
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {data.totalUsers}
          </p>
          <p className="text-sm text-gray-500 mt-1">Customers + Retailers</p>
        </div>
      </div>
      <div className="gradient-border bg-white p-6 rounded-xl shadow-md">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiUser className="w-5 h-5 mr-2 text-green-500" />
            Active Customers
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {data.activeCustomers}
          </p>
          <p className="text-sm text-gray-500 mt-1">30d activity</p>
        </div>
      </div>
      <div className="gradient-border bg-white p-6 rounded-xl shadow-md">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaStore className="w-5 h-5 mr-2 text-purple-500" />
            Active Retailers
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {data.activeRetailers}
          </p>
          <p className="text-sm text-gray-500 mt-1">Verified partners</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="gradient-border bg-white p-6 rounded-xl shadow-md">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiCheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Active Users
          </h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {data.activeUsers}
          </p>
          <p className="text-sm text-gray-500 mt-1">Fully Active</p>
          <div className="mt-4 flex items-center text-sm text-green-500">
            <FiTrendingUp className="mr-1" /> Updated
          </div>
        </div>
      </div>
      <div className="gradient-border bg-white p-6 rounded-xl shadow-md">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiAlertCircle className="w-5 h-5 mr-2 text-red-500" />
            Suspended Users
          </h2>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {data.suspendedUsers}
          </p>
          <p className="text-sm text-gray-500 mt-1">Banned/Suspended</p>
        </div>
      </div>
      <div className="gradient-border bg-white p-6 rounded-xl shadow-md">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiClock className="w-5 h-5 mr-2 text-yellow-500" />
            Pending Retailers
          </h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {data.pendingRetailers}
          </p>
          <p className="text-sm text-gray-500 mt-1">Awaiting Approval</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="gradient-border bg-white p-6 rounded-xl shadow-md">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiActivity className="w-5 h-5 mr-2 text-blue-400" />
            New Signups
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {data.newSignups}
          </p>
          <p className="text-sm text-gray-500 mt-1">Recent Registrations</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">{data.newSignups}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="gradient-border bg-white p-6 rounded-xl shadow-md">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiShoppingCart className="w-5 h-5 mr-2 text-purple-400" />
            Avg Orders/User
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {data.avgOrdersPerUser}
          </p>
          <p className="text-sm text-gray-500 mt-1">Per Active User</p>
          <div className="mt-4 flex items-center text-sm text-green-500">
            <FiTrendingUp className="mr-1" /> Current Average
          </div>
        </div>
      </div>
      <div className="gradient-border bg-white p-6 rounded-xl shadow-md">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiDollarSign className="w-5 h-5 mr-2 text-green-400" />
            Avg Revenue/User
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            ₹{data.avgRevenuePerUser}
          </p>
          <p className="text-sm text-gray-500 mt-1">Per Active User</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="gradient-border bg-white p-6 rounded-xl shadow-md">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiShoppingBag className="w-5 h-5 mr-2 text-blue-500" />
            Top Buyers (by Total Spend)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-900">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Total Spend</th>
                  <th className="py-3 px-4 text-left">Orders</th>
                </tr>
              </thead>
              <tbody>
                {data.topBuyers && data.topBuyers.length > 0 ? (
                  data.topBuyers.map((buyer, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4 flex items-center">
                        <FiUser className="mr-2 text-gray-500" /> {buyer.name}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ₹{buyer.totalSpend.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">{buyer.orders}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t">
                    <td
                      colSpan="3"
                      className="py-3 px-4 text-center text-gray-500"
                    >
                      No buyer data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="gradient-border bg-white p-6 rounded-xl shadow-md">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FaStore className="w-5 h-5 mr-2 text-purple-500" />
            Top Sellers (by Order Volume)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-900">
                  <th className="py-3 px-4 text-left">Retailer</th>
                  <th className="py-3 px-4 text-left">Orders</th>
                  <th className="py-3 px-4 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.topSellers && data.topSellers.length > 0 ? (
                  data.topSellers.map((seller, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4 flex items-center">
                        <FaStore className="mr-2 text-gray-500" /> {seller.name}
                      </td>
                      <td className="py-3 px-4">{seller.orders}</td>
                      <td className="py-3 px-4 font-medium">
                        ₹{seller.revenue.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t">
                    <td
                      colSpan="3"
                      className="py-3 px-4 text-center text-gray-500"
                    >
                      No seller data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default UserDashboard;
