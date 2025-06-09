import express from "express";
import {
  verifyJwtToken,
  isAdmin,
  validator,
} from "../../../../middleware/index.js";
import { adminStockManagementController } from "../../controllers/index.js";
import { validators } from "../../validators/index.js";

const router = express.Router();

/**
 * @route GET /api/v1/admin/stock-management/stock-variants
 * @desc Get all product variants with stock data including reserved/sold quantities
 * @access Private (Admin only)
 * @returns {Object} { message: string, data: Array<ProductVariant> }
 */
router.get(
  "/stock-Variants",
  verifyJwtToken,
  isAdmin,
  adminStockManagementController.getAllProductVariantsWithStock
);

/**
 * @route PUT /api/v1/admin/stock-management/stock-Variants/:variant_id
 * @desc Update stock quantity for a specific product variant
 * @access Private (Admin only)
 * @param {string} variant_id - UUID of the product variant
 * @body {number} stock_quantity - New stock quantity
 * @returns {Object} { message: string, data: Object }
 */
router.put(
  "/stock-Variants/:variant_id",
  verifyJwtToken,
  isAdmin,
  // Add validation for UUID format and stock quantity
  // validator(validators.productVariant.updateStockValidator, null),
  adminStockManagementController.updateProductVariantStock
);

/**
 * @route GET /api/v1/admin/stock-management/stock-analytics
 * @desc Get stock summary analytics
 * @access Private (Admin only)
 * @returns {Object} { message: string, data: Object }
 */
router.get(
  "/stock-Analytics",
  verifyJwtToken,
  isAdmin,
  adminStockManagementController.getStockAnalytics
);

export default router;
