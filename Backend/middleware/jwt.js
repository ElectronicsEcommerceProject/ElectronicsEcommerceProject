import jwt from "jsonwebtoken";

import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: '../.env' });

// Get the secret key from environment variables
const secretKey = process.env.SECRET_KEY;


// Function to encode user JWT
export const encodeJwtToken = (email,role) => {
  // Payload data to include in the token
  const payload = { email ,role};
  // Options for the token (e.g., expiration time)
<<<<<<< Updated upstream:Backend/middleware/jwt.js
  const options = { expiresIn: "10h" }; // Token expires in 1 hour
=======
  const options = { expiresIn: "60h" }; // Token expires in 10 hours
>>>>>>> Stashed changes:Backend/src/middleware/jwt.middleware.js

  // Generate the token
  const token = jwt.sign(payload, secretKey, options);
  return token;
};

// Function to verify user JWT
<<<<<<< Updated upstream:Backend/middleware/jwt.js

export const verifyJwtToken = (req, res, next) => {
=======
export const 
verifyJwtToken = (req, res, next) => {
>>>>>>> Stashed changes:Backend/src/middleware/jwt.middleware.js
  // Get the token from the request headers
  console.log("req.headers.authorization", req.headers.authorization);
  const token = req.headers.authorization?.split(" ")[1];
  console.log("token", token);
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token and attach the decoded data to the request object
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach the decoded payload to the request object
    req.userID = decoded.user_id;
    console.log(`JWT Verification Passed: User ${decoded.user_id} is authenticated.`);
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(400).json({ error: "Invalid token." });
  }
};
