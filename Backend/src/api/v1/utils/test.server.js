import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { validators } from "../validators/index.js";
import {
  registerController,
  loginController,
  adminCategoryController,
  adminBrandController,
} from "../controllers/index.js";
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

  // Enhanced middleware for test environment to handle the x-test-user header
  app.use((req, res, next) => {
    const testUserHeader = req.headers["x-test-user"];
    if (testUserHeader) {
      try {
        req.user = JSON.parse(testUserHeader);
        // console.log("Test user set:", req.user); // Debug logging
      } catch (error) {
        console.error("Error parsing test user header:", error);
      }
    }
    next();
  });

  /**
   * Middleware function to validate request using Joi schema
   * @param {Object} schema - Joi validation schema
   * @returns {Function} Express middleware
   */
  function validateRequest(schema) {
    return (req, res, next) => {
      if (!schema) {
        return next();
      }

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

  // Routes
  // Auth routes
  app.post(
    "/api/v1/auth/register",
    validateRequest(validators.auth.register),
    registerController
  );

  app.post(
    "/api/v1/auth/login",
    validateRequest(validators.auth.login),
    loginController
  );

  //category routes...

  // Add a new category
  app.post(
    "/api/v1/admin/category",
    validateRequest(validators.category.categoryValidator),
    adminCategoryController.addCategory
  );

  // Get all categories
  app.get("/api/v1/admin/category", adminCategoryController.getAllCategories);

  // Update a category by ID
  app.put(
    "/api/v1/admin/category/:id",
    adminCategoryController.updateCategoryById
  );

  // Delete a category by ID
  app.delete(
    "/api/v1/admin/category/:id",
    validateRequest(validators.category?.category_id),
    adminCategoryController.deleteCategory
  );

  // Brand routes
  app.post(
    "/api/v1/admin/brands",
    validateRequest(validators.brand.brandValidator),
    adminBrandController.addBrand
  );

  app.get("/api/v1/admin/brands", adminBrandController.getAllBrands);

  app.put(
    "/api/v1/admin/brands/:id",
    validateRequest(validators.brand.brand_id),
    // validateRequest(validators.brand.brandUpdateValidator),
    adminBrandController.updateBrand
  );

  app.delete(
    "/api/v1/admin/brands/:id",
    validateRequest(validators.brand?.brand_id),
    adminBrandController.deleteBrand
  );

  // If no routes match
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error("Express error:", err.stack);
    res
      .status(500)
      .json({ message: "Something went wrong!", error: err.message });
  });

  return app;
}
