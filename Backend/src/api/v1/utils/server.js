import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { registerValidator } from "../validators/auth/register.validators.js";
import register from "../controllers/auth/register.controller.js";

/**
 * Creates and configures an Express server instance
 * This is used both by the main server and for testing
 * @returns {express.Application} Express app
 */
export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Routes
  // Auth routes
  app.post(
    "/api/v1/auth/register",
    validateRequest(registerValidator),
    register
  );

  // If no routes match
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  });

  return app;
}

/**
 * Middleware function to validate request using Joi schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
function validateRequest(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));

      return res.status(400).json({
        message: errors[0].message,
        errors,
      });
    }

    next();
  };
}
