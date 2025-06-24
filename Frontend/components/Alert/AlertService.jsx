import { toast } from 'react-toastify';
import { AlertMessage } from '../index.js';
 
// Function to show Success Alerts (with 🎉)
const showSuccess = (message) => {
  toast.success(`🎉 ${message}`, {
    position: "top-center",
    autoClose: 2000,
  });
};

// Function to show Error Alerts (with ❌)
const showError = (message) => {
  toast.error(`❌ ${message}`, {
    position: "top-center",
    autoClose: 3000,
  });
};

// Function to show Info Alerts (with ℹ️)
const showInfo = (message) => {
  toast.info(`ℹ️ ${message}`, {
    position: "top-center",
    autoClose: 2000,
  });
};

// Function to show Warning Alerts (with ⚠️)
const showWarning = (message) => {
  toast.warn(`⚠️ ${message}`, {
    position: "top-center",
    autoClose: 2000,
  });
};

// Function to show Default Alerts (no emoji)
const showDefault = (message) => {
  toast(message, {
    position: "top-center",
    autoClose: 2000,
  });
};

// Get Alert Message by category & type
const getAlertMessage = (category, alertType) => {
  return alertMessages[category]?.[alertType] || "Something went wrong.";
};

// Export everything
export default {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showDefault,
  getAlertMessage
};
