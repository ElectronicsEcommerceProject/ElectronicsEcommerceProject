import { jwtDecode } from "jwt-decode";

/**
 * Get user information from JWT token stored in localStorage
 * @returns {Object|null} User object with user_id, email, role, etc. or null if no valid token
 */
export const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }

    const decodedToken = jwtDecode(token);
    
    // Check if token is not expired
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp <= currentTime) {
      // Token expired, remove it
      localStorage.removeItem("token");
      return null;
    }

    return {
      user_id: decodedToken.user_id,
      email: decodedToken.email,
      role: decodedToken.role,
      name: decodedToken.name || decodedToken.email,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem("token");
    return null;
  }
};

/**
 * Get user_id from JWT token
 * @returns {string|null} User ID or null if no valid token
 */
export const getUserIdFromToken = () => {
  const user = getUserFromToken();
  return user?.user_id || null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token, false otherwise
 */
export const isAuthenticated = () => {
  return getUserFromToken() !== null;
};

/**
 * Get user role from JWT token
 * @returns {string|null} User role or null if no valid token
 */
export const getUserRole = () => {
  const user = getUserFromToken();
  return user?.role || null;
};
