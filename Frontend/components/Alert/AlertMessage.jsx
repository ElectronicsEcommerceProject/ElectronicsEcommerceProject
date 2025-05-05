const alertMessages = {
    // --- Authentication Alerts ---
    AUTH: {
      LOGIN_SUCCESS: "Login successful.",
      LOGIN_FAILED: "Invalid email or password.",
      LOGOUT_SUCCESS: "You have been logged out.",
      SESSION_EXPIRED: "Your session has expired. Please login again.",
      SIGNUP_SUCCESS: "Account created successfully. Please login.",
      SIGNUP_FAILED: "Signup failed. Please try again.",
      PASSWORD_MISMATCH: "Passwords do not match.",
      PASSWORD_RESET_LINK_SENT: "Reset link sent to your email.",
      PASSWORD_RESET_SUCCESS: "Password reset successfully.",
      PASSWORD_RESET_FAILED: "Failed to reset password. Try again.",
      INVALID_EMAIL: "Please enter a valid email address.",
      CAPTCHA_FAILED: "Captcha verification failed. Please try again."
    },
  
    // --- Profile Alerts ---
    PROFILE: {
      UPDATE_SUCCESS: "Profile updated successfully.",
      UPDATE_FAILED: "Failed to update profile.",
      PASSWORD_CHANGE_SUCCESS: "Password changed successfully.",
      PASSWORD_CHANGE_FAILED: "Current password is incorrect.",
      CARD_SAVED: "Card saved successfully.",
      CARD_REMOVED: "Card removed.",
      ADDRESS_ADDED: "Address added successfully.",
      ADDRESS_UPDATED: "Address updated.",
      ADDRESS_REMOVED: "Address removed.",
      PRIVACY_UPDATED: "Privacy settings updated.",
      NOTIFICATION_UPDATED: "Notification preferences updated."
    },
  
    // --- Product & Category ---
    PRODUCT: {
      NOT_FOUND: "Product not found.",
      OUT_OF_STOCK: "This product is currently out of stock.",
      LOW_STOCK_ALERT: "Stock is low for selected product.",
      ADDED_SUCCESS: "Product added successfully.",
      UPDATED_SUCCESS: "Product updated successfully.",
      DELETED_SUCCESS: "Product deleted successfully.",
      RETAILER_ONLY: "This product is available for retailers only.",
      CUSTOMER_ONLY: "This product is available for customers only."
    },
  
    // --- Cart & Wishlist ---
    CART: {
      ITEM_ADDED: "Product added to cart.",
      ITEM_REMOVED: "Product removed from cart.",
      ITEM_UPDATED: "Cart updated.",
      EMPTY: "Your cart is empty.",
      RETAILER_MIN_QTY_ERROR: "Minimum quantity required for retailer order not met.",
      NOT_LOGGED_IN: "Please login to access your cart."
    },
  
    WISHLIST: {
      ITEM_ADDED: "Product added to wishlist.",
      ITEM_REMOVED: "Product removed from wishlist.",
      NOT_LOGGED_IN: "Please login to access your wishlist."
    },
  
    // --- Order Alerts ---
    ORDER: {
      PLACED_SUCCESS: "Order placed successfully.",
      PLACED_FAILED: "Order placement failed. Try again.",
      ORDER_CANCEL_REQUESTED: "Cancellation request sent.",
      ORDER_CANCEL_SUCCESS: "Order cancelled successfully.",
      ORDER_CANCEL_FAILED: "Unable to cancel order.",
      BULK_DISCOUNT_APPLIED: "Bulk discount applied.",
      COUPON_APPLIED: "Coupon applied successfully.",
      COUPON_INVALID: "Invalid coupon code.",
      STATUS_UPDATED: "Order status updated.",
      NOT_FOUND: "Order not found.",
      ADDRESS_REQUIRED: "Please add a delivery address to proceed."
    },
  
    // --- Review Alerts ---
    REVIEW: {
      SUBMITTED: "Review submitted successfully.",
      UPDATED: "Review updated.",
      DELETED: "Review deleted.",
      ALREADY_SUBMITTED: "You have already reviewed this product."
    },
  
    // --- Stock Alerts ---
    STOCK: {
      LOW_ALERT: "Stock is below threshold.",
      OUT_OF_STOCK_ADMIN: "Product is out of stock. Please restock.",
      STOCK_UPDATED: "Stock updated successfully."
    },
  
    // --- Admin Alerts ---
    ADMIN: {
      PRODUCT_ADDED: "New product added.",
      CATEGORY_ADDED: "New category created.",
      COUPON_CREATED: "Coupon created successfully.",
      COUPON_DELETED: "Coupon deleted.",
      USER_BLOCKED: "User account blocked.",
      USER_UNBLOCKED: "User account unblocked."
    },
  
    // --- Filters & Search ---
    SEARCH: {
      NO_RESULTS: "No products matched your search.",
      INVALID_FILTER: "Invalid filter option."
    },
  
    // --- General Errors ---
    ERROR: {
      UNKNOWN: "Something went wrong. Please try again.",
      NETWORK: "Network error. Check your connection.",
      UNAUTHORIZED: "You are not authorized to perform this action.",
      FORBIDDEN: "Access denied.",
      NOT_FOUND: "Requested resource not found.",
      SERVER_ERROR: "Internal server error."
    }
  };
  
  export default alertMessages;