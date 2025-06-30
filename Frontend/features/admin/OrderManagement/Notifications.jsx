import React from 'react';

const Notifications = ({ notifications, dismissNotification, showNotifications = false }) => {
    // If showNotifications is false, return null to prevent rendering
    if (!showNotifications) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 space-y-2 max-w-sm">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`border-l-4 p-4 rounded shadow flex justify-between items-center ${
                        notification.type === 'warning'
                            ? 'bg-yellow-100 border-yellow-500'
                            : notification.type === 'error'
                            ? 'bg-red-100 border-red-500'
                            : 'bg-green-100 border-green-500'
                    }`}
                >
                    <p className="text-sm">{notification.message}</p>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => dismissNotification(notification.id)}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Notifications;