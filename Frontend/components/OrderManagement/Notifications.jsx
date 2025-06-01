import React from "react";

const Notifications = ({
  notifications,
  dismissNotification,
  showNotifications = false,
}) => {
  // If showNotifications is false, return null to prevent rendering
  if (!showNotifications) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto space-y-2 max-w-sm sm:max-w-md z-40">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`border-l-4 p-3 sm:p-4 rounded shadow flex justify-between items-start gap-3 ${
            notification.type === "warning"
              ? "bg-yellow-100 border-yellow-500"
              : notification.type === "error"
              ? "bg-red-100 border-red-500"
              : "bg-green-100 border-green-500"
          }`}
        >
          <p className="text-sm flex-1">{notification.message}</p>
          <button
            className="text-gray-500 hover:text-gray-700 flex-shrink-0 p-1"
            onClick={() => dismissNotification(notification.id)}
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
