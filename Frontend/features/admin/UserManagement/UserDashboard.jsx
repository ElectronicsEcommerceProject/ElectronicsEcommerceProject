import React, { useState } from 'react';
import UserProfileView from '../UserManagement/UserProfileView';
import { 
  FiDownload,
  FiFileText,
  FiPlus,
  FiUser,
  FiShoppingBag,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';
import { FaStore } from 'react-icons/fa';

const UserDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');

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
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={() => setActivePage('dashboard')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activePage === 'dashboard'
                ? 'bg-blue-500 text-white border-b-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActivePage('users')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activePage === 'users'
                ? 'bg-blue-500 text-white border-b-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            User Management
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            <FiDownload className="mr-2" /> Export CSV
          </button>
          <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            <FiFileText className="mr-2" /> Export PDF
          </button>
          <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            <FiPlus className="mr-2" /> Add User
          </button>
        </div>
      </nav>

      <main className="p-6">
        {activePage === 'dashboard' && <DashboardContent />}
        {activePage === 'users' && <UserProfileView />}
      </main>
    </div>
  );
};

const DashboardContent = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="gradient-border bg-white p-6 rounded-xl shadow-md">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiUser className="w-5 h-5 mr-2 text-blue-500" />
            Total Users
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">5,248</p>
          <p className="text-sm text-gray-500 mt-1">Customers + Retailers</p>
        </div>
      </div>
      <div className="gradient-border bg-white p-6 rounded-xl shadow-md">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiUser className="w-5 h-5 mr-2 text-green-500" />
            Active Customers
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">3,872</p>
          <p className="text-sm text-gray-500 mt-1">30d activity</p>
        </div>
      </div>
      <div className="gradient-border bg-white p-6 rounded-xl shadow-md">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaStore className="w-5 h-5 mr-2 text-purple-500" />
            Active Retailers
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">1,376</p>
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
          <p className="text-3xl font-bold text-green-600 mt-2">4,915</p>
          <p className="text-sm text-gray-500 mt-1">Fully Active</p>
          <div className="mt-4 flex items-center text-sm text-green-500">
            <FiTrendingUp className="mr-1" /> 12.5% from last month
          </div>
        </div>
      </div>
      <div className="gradient-border bg-white p-6 rounded-xl shadow-md">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiAlertCircle className="w-5 h-5 mr-2 text-red-500" />
            Suspended Users
          </h2>
          <p className="text-3xl font-bold text-red-600 mt-2">156</p>
          <p className="text-sm text-gray-500 mt-1">Banned/Suspended</p>
        </div>
      </div>
      <div className="gradient-border bg-white p-6 rounded-xl shadow-md">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiClock className="w-5 h-5 mr-2 text-yellow-500" />
            Pending Retailers
          </h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">48</p>
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
          <p className="text-3xl font-bold text-gray-900 mt-2">328</p>
          <p className="text-sm text-gray-500 mt-1">Last 7 Days</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Today:</span>
              <span className="font-medium">52</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">This Week:</span>
              <span className="font-medium">215</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">This Month:</span>
              <span className="font-medium">842</span>
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
          <p className="text-3xl font-bold text-gray-900 mt-2">3.4</p>
          <p className="text-sm text-gray-500 mt-1">Per Active User</p>
          <div className="mt-4 flex items-center text-sm text-green-500">
            <FiTrendingUp className="mr-1" /> 8.2% from last quarter
          </div>
        </div>
      </div>
      <div className="gradient-border bg-white p-6 rounded-xl shadow-md">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiDollarSign className="w-5 h-5 mr-2 text-green-400" />
            Avg Revenue/User
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹475</p>
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
                {[
                  { name: 'Aarav Sharma', spend: '₹14,800', orders: 28 },
                  { name: 'Priya Patel', spend: '₹12,350', orders: 22 },
                  { name: 'Rohan Singh', spend: '₹9,670', orders: 17 }
                ].map((user, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 flex items-center">
                      <FiUser className="mr-2 text-gray-500" /> {user.name}
                    </td>
                    <td className="py-3 px-4 font-medium">{user.spend}</td>
                    <td className="py-3 px-4">{user.orders}</td>
                  </tr>
                ))}
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
                {[
                  { name: 'Urban Styles', orders: 168, revenue: '₹52,400' },
                  { name: 'Tech Haven', orders: 142, revenue: '₹46,800' },
                  { name: 'Home & Living', orders: 125, revenue: '₹39,200' }
                ].map((retailer, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 flex items-center">
                      <FaStore className="mr-2 text-gray-500" /> {retailer.name}
                    </td>
                    <td className="py-3 px-4">{retailer.orders}</td>
                    <td className="py-3 px-4 font-medium">{retailer.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default UserDashboard;