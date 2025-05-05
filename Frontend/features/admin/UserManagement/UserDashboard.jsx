import React, { useState } from 'react';
import UserProfileView from '../UserManagement/UserProfileView';
import { 
  FiHome, 
  FiUsers, 
  FiMenu, 
  FiSun, 
  FiMoon, 
  FiSearch,
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
  FiActivity,
  FiArrowLeft
} from 'react-icons/fi';
import { 
  FaUserTie,
  FaStore
} from 'react-icons/fa';

const UserDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setActivePage('user');
  };

  const handleBackToDashboard = () => {
    setSelectedUser(null);
    setActivePage('dashboard');
  };

  return (
    <div className={`${darkMode ? 'dark' : ''} font-sans`}>
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
        .dark .gradient-border::before {
          background: linear-gradient(to right, #facc15, #3b82f6);
        }
        .hover-scale {
          transition: transform 0.2s ease-in-out;
        }
        .hover-scale:hover {
          transform: scale(1.02);
        }
        .button-gradient {
          background-image: linear-gradient(to right, #facc15, #3b82f6);
          transition: all 0.3s ease;
        }
        .button-gradient:hover {
          background-image: linear-gradient(to right, #eab308, #2563eb);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        }
      `}</style>

      <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <aside 
          className={`w-56 bg-white dark:bg-gray-900/95 shadow-lg fixed h-full ${sidebarOpen ? 'block' : 'hidden'} sm:block transition-all duration-300 z-20`}
        >
          <div className="gradient-border p-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 relative z-10 flex items-center">
              <FaUserTie className="mr-2" /> Admin Panel
            </h1>
          </div>
          <nav className="mt-6">
            <button 
              onClick={() => setActivePage('dashboard')}
              className={`flex items-center w-full px-4 py-3 text-left ${activePage === 'dashboard' ? 'bg-gray-100 dark:bg-gray-800' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'} hover-scale transition-all`}
            >
              <FiHome className="w-5 h-5 mr-3" />
              Dashboard
            </button>
            <button 
              onClick={() => setActivePage('users')}
              className={`flex items-center w-full px-4 py-3 text-left ${activePage === 'users' ? 'bg-gray-100 dark:bg-gray-800' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'} hover-scale transition-all`}
            >
              <FiUsers className="w-5 h-5 mr-3" />
              User Management
            </button>
          </nav>
        </aside>

        <main className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'sm:ml-56'}`}>
          <button 
            className="sm:hidden mb-6 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover-scale" 
            onClick={toggleSidebar}
          >
            <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-gradient-to-r from-yellow-400 to-blue-500 p-5 rounded-xl shadow-lg">
            <div className="flex items-center">
              {activePage === 'users' && (
                <button 
                  onClick={handleBackToDashboard}
                  className="mr-4 p-1 rounded-full bg-white/20 hover:bg-white/30"
                >
                  <FiArrowLeft className="w-5 h-5 text-white" />
                </button>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">
                {activePage === 'dashboard' && <><FiHome className="inline mr-3" /> Dashboard</>}
                {activePage === 'users' && <><FiUsers className="inline mr-3" /> User Management</>}
              </h1>
            </div>
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <button 
                onClick={toggleDarkMode} 
                className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover-scale"
              >
                {darkMode ? (
                  <FiSun className="w-5 h-5 text-white" />
                ) : (
                  <FiMoon className="w-5 h-5 text-white" />
                )}
              </button>
              {activePage !== 'users' && (
                <>
                  <div className="relative flex-grow md:flex-grow-0 md:w-64">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/90 dark:bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-900 gradient-border" 
                    />
                  </div>
                  <button className="flex items-center text-white px-4 py-2 rounded-lg button-gradient hover-scale">
                    <FiDownload className="mr-2" /> Export CSV
                  </button>
                  <button className="flex items-center text-white px-4 py-2 rounded-lg button-gradient hover-scale">
                    <FiFileText className="mr-2" /> Export PDF
                  </button>
                  <button className="flex items-center text-white px-4 py-2 rounded-lg button-gradient hover-scale">
                    <FiPlus className="mr-2" /> Add User
                  </button>
                </>
              )}
            </div>
          </div>

          {activePage === 'dashboard' && <DashboardContent />}
          {activePage === 'users' && <UserProfileView />}
        </main>
      </div>
    </div>
  );
};

const DashboardContent = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="gradient-border bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover-scale relative">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FiUser className="w-5 h-5 mr-2 text-blue-500" />
            Total Users
          </h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">5,248</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Customers + Retailers</p>
        </div>
      </div>
      <div className="gradient-border bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover-scale relative">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FiUser className="w-5 h-5 mr-2 text-green-500" />
            Active Customers
          </h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">3,872</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">30d activity</p>
        WATCHDOG: Remediation Suggestions
        </div>
      </div>
      <div className="gradient-border bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover-scale relative">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FaStore className="w-5 h-5 mr-2 text-purple-500" />
            Active Retailers
          </h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">1,376</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Verified partners</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="gradient-border bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover-scale relative">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FiCheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Active Users
          </h2>
          <p className="text-3xl font-bold text-green-600 mt-2">4,915</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fully Active</p>
          <div className="mt-4 flex items-center text-sm text-green-500">
            <FiTrendingUp className="mr-1" /> 12.5% from last month
          </div>
        </div>
      </div>
      <div className="gradient-border bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover-scale relative">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FiAlertCircle className="w-5 h-5 mr-2 text-red-500" />
            Suspended Users
          </h2>
          <p className="text-3xl font-bold text-red-600 mt-2">156</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Banned/Suspended</p>
        </div>
      </div>
      <div className="gradient-border bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover-scale relative">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FiClock className="w-5 h-5 mr-2 text-yellow-500" />
            Pending Retailers
          </h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">48</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Awaiting Approval</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="gradient-border bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover-scale relative">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FiActivity className="w-5 h-5 mr-2 text-blue-400" />
            New Signups
          </h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">328</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last 7 Days</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Today:</span>
              <span className="font-medium">52</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">This Week:</span>
              <span className="font-medium">215</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">This Month:</span>
              <span className="font-medium">842</span>
            </div>
          </div>
        </div>
      </div>
      <div className="gradient-border bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover-scale relative">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FiShoppingCart className="w-5 h-5 mr-2 text-purple-400" />
            Avg Orders/User
          </h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">3.4</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Per Active User</p>
          <div className="mt-4 flex items-center text-sm text-green-500">
            <FiTrendingUp className="mr-1" /> 8.2% from last quarter
          </div>
        </div>
      </div>
      <div className="gradient-border bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover-scale relative">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FiDollarSign className="w-5 h-5 mr-2 text-green-400" />
            Avg Revenue/User
          </h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">₹475</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Per Active User</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="gradient-border bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover-scale relative">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <FiShoppingBag className="w-5 h-5 mr-2 text-blue-500" />
            Top Buyers (by Total Spend)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300">
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
                  <tr key={index} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover-scale">
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
      <div className="gradient-border bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover-scale relative">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <FaStore className="w-5 h-5 mr-2 text-purple-500" />
            Top Sellers (by Order Volume)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300">
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
                  <tr key={index} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover-scale">
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