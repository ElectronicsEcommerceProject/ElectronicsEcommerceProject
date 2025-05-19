import express from "express";
import { verifyJwtToken } from "../../../../../../middleware/jwt.middleware.js";
import { validator } from "../../../../../../middleware/validator/validator.middleware.js";
import { validators } from "../../../../validators/index.js";
import { productReviewController } from "../../../../controllers/index.js";
import { isAdmin } from "../../../../../../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route POST /api/v1/product-reviews
 * @desc Create a new product review (requires authentication)
 * @access Private
 */
router.post(
  "/",
  verifyJwtToken,
  validator(validators.productReview.createReviewValidator, null),
  productReviewController.createProductReview
);

/**
 * @route GET /api/v1/product-reviews/product/:product_id
 * @desc Get all reviews for a product
 * @access Public (with optional filtering for approved reviews only)
 */
router.get(
  "/product/:product_id",
  verifyJwtToken,
  validator(validators.productReview.productIdValidator, "params"),
  productReviewController.getProductReviews
);

/**
 * @route GET /api/v1/product-reviews/:review_id
 * @desc Get a specific review by ID
 * @access Public
 */
router.get(
  "/:review_id",
  validator(validators.productReview.reviewIdValidator, "params"),
  productReviewController.getReviewById
);

/**
 * @route PUT /api/v1/product-reviews/:review_id
 * @desc Update a review (only by the reviewer)
 * @access Private
 */
router.patch(
  "/:review_id",
  verifyJwtToken,
  validator(validators.productReview.reviewIdValidator, "params"),
  validator(validators.productReview.updateReviewValidator, null),
  productReviewController.updateReview
);

/**
 * @route PUT /api/v1/product-reviews/:review_id/approve
 * @desc Approve a review (admin only)
 * @access Private (Admin)
 */

/**
 * @route DELETE /api/v1/product-reviews/:review_id
 * @desc Delete a review (only by the reviewer)
 * @access Private
 */
router.delete(
  "/:review_id",
  verifyJwtToken,
  validator(validators.productReview.reviewIdValidator, "params"),
  productReviewController.deleteReview
);

/**
 * @route GET /api/v1/product-reviews/user/me
 * @desc Get all reviews by the authenticated user
 * @access Private
 */
router.get("/user/me", verifyJwtToken, productReviewController.getUserReviews);

export default router;
