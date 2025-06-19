import React, { useState, useEffect } from "react";
import {
  FiClock,
  FiCheck,
  FiAlertTriangle,
  FiFilter,
  FiCalendar,
  FiRefreshCw,
} from "react-icons/fi";
import { FiBell } from "react-icons/fi";

import {
  getApiById,
  userNotificationRoute,
  getUserIdFromToken,
  updateApiById,
} from "../../src/index.js";

const UserNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // all, read, unread
  const [timeFilter, setTimeFilter] = useState("all"); // all, today, yesterday, lastWeek
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const userId = getUserIdFromToken();
      const response = await getApiById(userNotificationRoute, userId);

      if (response.success) {
        setNotifications(response.data.notifications || []);
        setError(null);
      } else {
        setError(response.message || "Failed to fetch notifications");
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Could not load notifications");
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      // First update UI optimistically
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === id ? { ...n, is_read: true } : n
        )
      );

      // Then make API call to mark as read
      const response = await updateApiById(userNotificationRoute, id);

      if (!response.success) {
        console.error("Failed to mark notification as read:", response.message);
        // Revert the optimistic update if API call fails
        fetchNotifications();
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
      // Revert the optimistic update if API call fails
      fetchNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    try {
      // Mark each unread notification as read
      const unreadNotifications = notifications.filter((n) => !n.is_read);

      // Update UI optimistically
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      // Refresh notifications to get current state
      fetchNotifications();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  const getTimeFilterLabel = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return "lastWeek";
    return "older";
  };

  const filteredNotifications = notifications.filter((n) => {
    const matchesReadStatus =
      filter === "all" ? true : filter === "read" ? n.is_read : !n.is_read;

    const timeLabel = getTimeFilterLabel(n.createdAt);
    const matchesTime =
      timeFilter === "all" ||
      (timeFilter === "today" && timeLabel === "today") ||
      (timeFilter === "yesterday" && timeLabel === "yesterday") ||
      (timeFilter === "lastWeek" && timeLabel === "lastWeek");

    return matchesReadStatus && matchesTime;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return (
        "Today, " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } else if (diffDays === 1) {
      return (
        "Yesterday, " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <FiCheck className="text-green-500" size={16} />;
      case "pending":
        return <FiClock className="text-yellow-500" size={16} />;
      case "failed":
        return <FiAlertTriangle className="text-red-500" size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header with enhanced styling */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 p-5 flex flex-col sm:flex-row justify-between items-center relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white"></div>
        </div>

        <div className="flex items-center space-x-3 mb-3 sm:mb-0 z-10">
          <div className="bg-white/20 p-2 rounded-lg">
            <FiBell className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Notifications</h2>
            <p className="text-xs text-blue-100">
              Stay updated with your activity
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-full animate-pulse shadow-lg">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto z-10">
          {/* Read/Unread Filter - Responsive buttons */}
          <div className="flex bg-white/20 rounded-md p-1 flex-1 sm:flex-initial shadow-inner">
            {["all", "unread", "read"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-2 py-1 text-xs sm:px-3 sm:py-1 rounded-md transition-all duration-200 ${
                  filter === type
                    ? "bg-white text-blue-700 shadow-sm font-medium"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Time Period Filter - Mobile dropdown */}
          <div className="relative block sm:hidden flex-1 sm:flex-initial">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full sm:w-auto bg-white/20 text-white text-xs sm:text-sm rounded-md p-1.5 pl-2 pr-8 appearance-none focus:outline-none shadow-inner"
            >
              <option value="all">All Notifications</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="lastWeek">Last 7 Days</option>
            </select>
            <FiCalendar className="absolute right-2 top-1.5 text-white pointer-events-none" />
          </div>

          {/* Time Period Filter - Desktop buttons */}
          <div className="hidden sm:flex bg-white/20 rounded-md p-1 flex-1 sm:flex-initial">
            {['all', 'today', 'yesterday', 'lastWeek'].map((type) => (
              <button
                key={type}
                onClick={() => setTimeFilter(type)}
                className={`px-2 py-1 text-xs sm:px-3 sm:py-1 transition-colors ${
                  timeFilter === type 
                    ? "bg-white text-blue-700 shadow-sm" 
                    : "text-white hover:bg-white hover:bg-opacity-10"
                }`}
              >
                {type === 'all' ? 'All' : 
                 type === 'lastWeek' ? '7D' : 
                 type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Removed Mark all as read button */}
        </div>
      </div>

      {/* Notification List with enhanced responsiveness */}
      <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto bg-gray-50">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-white">
            <div className="animate-spin mb-3">
              <FiRefreshCw className="text-4xl text-blue-500" />
            </div>
            <p className="font-medium text-gray-600">
              Loading notifications...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-white">
            <div className="bg-red-100 p-5 rounded-full mb-3">
              <FiAlertTriangle className="text-4xl text-red-500" />
            </div>
            <p className="font-medium text-gray-600">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 text-blue-500 hover:text-blue-700 flex items-center"
            >
              <FiRefreshCw className="mr-1" size={14} /> Try again
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-white">
            <div className="bg-gray-100 p-5 rounded-full mb-3">
              <FiBell className="text-4xl text-gray-400" />
            </div>
            <p className="font-medium text-gray-600">No notifications found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try changing your filters
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.notification_id}
              className={`p-4 transition-all duration-200 hover:bg-white ${
                !notification.is_read
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : "bg-white border-l-4 border-transparent"
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Status Icon - Enhanced visual hierarchy */}
                <div
                  className={`flex-shrink-0 p-2.5 rounded-full shadow-sm ${
                    notification.status === "sent"
                      ? "bg-green-100"
                      : notification.status === "pending"
                      ? "bg-yellow-100"
                      : "bg-red-100"
                  }`}
                >
                  {getStatusIcon(notification.status)}
                </div>

                {/* Content - Better spacing and typography */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <h3
                      className={`font-medium truncate max-w-xs sm:max-w-md md:max-w-lg ${
                        !notification.is_read
                          ? "text-blue-900 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {notification.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-gray-500 whitespace-nowrap flex items-center">
                        <FiClock className="mr-1 text-gray-400" size={10} />
                        {formatDate(notification.createdAt)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${
                          notification.audience_type === "all_users"
                            ? "bg-purple-100 text-purple-700"
                            : notification.audience_type === "all_customers"
                            ? "bg-blue-100 text-blue-700"
                            : notification.audience_type === "all_retailers"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {notification.audience_type.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  <p
                    className={`text-sm mt-2 ${
                      !notification.is_read ? "text-gray-800" : "text-gray-600"
                    } line-clamp-2`}
                  >
                    {notification.message}
                  </p>

                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {notification.channel.replace("_", " ")}
                    </span>

                    {!notification.is_read && (
                      <button
                        onClick={() =>
                          handleMarkAsRead(notification.notification_id)
                        }
                        className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors flex items-center shadow-sm"
                      >
                        <FiCheck className="mr-1" size={12} /> Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="bg-white p-3 border-t border-gray-100 text-center text-xs text-gray-500">
        Showing {filteredNotifications.length} of {notifications.length}{" "}
        notifications
      </div>
    </div>
  );
};

export default UserNotification;
