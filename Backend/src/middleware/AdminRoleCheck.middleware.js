import { StatusCodes } from "http-status-codes"; // Import http-status-codes
import db from "../models/index.js"; // Import the database models
const { User } = db;

/**
 * Middleware to check if the user has the 'admin' role.
 * If the user is an admin, it calls next().
 * Otherwise, it sends a 403 Forbidden response.
 */
export const adminRoleCheck = async (req, res, next) => {
  try {
    // Ensure req.user exists and contains the email (usually set by authentication middleware)
    if (!req.user || !req.user.email) {
      // Use 401 Unauthorized if the user isn't properly identified
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Authentication required. User email not found in request.",
      });
    }

    // Fetch the user from the database using the email
    const user = await User.findOne({
      where: { email: req.user.email },
      attributes: ["role"], // Only fetch the role
    });

    // Handle case where user exists in token but not in DB (e.g., deleted user)
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User associated with token not found." });
    }

    const role = user.role;

    // Check if the user role is 'admin'
    if (role === "admin") {
      // User is an admin, allow them to proceed
      console.log(`Role Check Passed: User ${req.user.email} is an Admin.`);
      next();
    } else {
      // User is not an admin (customer, retailer, or other)
      console.log(
        `Role Check Failed: User ${req.user.email} has role '${role}'. Admin privileges required.`
      );
      // Send a 403 Forbidden status code and a specific message
      return res.status(StatusCodes.FORBIDDEN).json({
        error: `Access denied. Role '${role}' is not authorized to perform this action. Admin privileges required.`,
      });
    }
  } catch (error) {
    console.error("Error during role check:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error during role check." });
  }
};
