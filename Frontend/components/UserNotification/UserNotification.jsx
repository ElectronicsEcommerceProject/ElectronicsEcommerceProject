import React, { useState } from "react";

// Sample hardcoded notifications based on notification.model.js
const sampleNotifications = [
  {
    notification_id: "1",
    title: "Order Delivered!",
    message: "Your order #1234 has been delivered.",
    channel: "in_app",
    status: "sent",
    is_read: false,
    createdAt: "2025-06-18T10:00:00Z",
    user_id: "user-1",
    created_by: "admin-1",
    audience_type: "specific_users",
  },
  {
    notification_id: "2",
    title: "Welcome to ElectroShop!",
    message: "Thank you for joining us. Enjoy shopping!",
    channel: "in_app",
    status: "sent",
    is_read: true,
    createdAt: "2025-06-15T09:00:00Z",
    user_id: "user-1",
    created_by: "admin-1",
    audience_type: "all_users",
  },
  {
    notification_id: "3",
    title: "Payment Failed",
    message: "Your payment for order #1235 failed. Please try again.",
    channel: "in_app",
    status: "failed",
    is_read: false,
    createdAt: "2025-06-14T12:30:00Z",
    user_id: "user-1",
    created_by: "admin-2",
    audience_type: "specific_users",
  },
];

const UserNotification = () => {
  const [notifications, setNotifications] = useState(sampleNotifications);

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Notifications</h2>
      <ul className="space-y-3">
        {notifications.length === 0 && (
          <li className="text-gray-500">No notifications.</li>
        )}
        {notifications.map((n) => (
          <li
            key={n.notification_id}
            className={`p-4 rounded border flex flex-col sm:flex-row sm:justify-between sm:items-center transition-colors duration-200 ${
              n.is_read ? "bg-gray-50" : "bg-blue-50"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-800">{n.title}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ml-2 ${
                    n.status === "sent"
                      ? "bg-green-100 text-green-700"
                      : n.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {n.status.charAt(0).toUpperCase() + n.status.slice(1)}
                </span>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full ml-2">
                  {n.channel.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <div className="text-gray-600 text-sm mb-1">{n.message}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
            {!n.is_read && (
              <button
                className="mt-2 sm:mt-0 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
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
};

export default UserNotification;
