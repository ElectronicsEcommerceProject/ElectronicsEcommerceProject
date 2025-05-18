import express from "express";
import {
  verifyJwtToken,
  validator,
  isAdmin,
} from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import {
  productReviewController,
  adminProductReviewController,
} from "../../controllers/index.js";

const router = express.Router();

router.post("/", verifyJwtToken, productReviewController.createProductReview);

/**
 * @route POST /api/v1/product-reviews
 * @desc Create a new product review (requires authentication)
 * @access Private
 */
router.get(
  "/",
  verifyJwtToken,
  isAdmin,
  adminProductReviewController.getAllProductReviews
);

/**
 * @route GET /api/v1/admin/product-reviews/product/:product_id
 * @desc Get all reviews for a specific product
 * @access Private (Admin)
 */
router.get(
  "/product/:product_id",
  verifyJwtToken,
  isAdmin,
  validator(validators.productReview.productIdValidator, "params"),
  adminProductReviewController.getProductReviews
);

/**
 * @route GET /api/v1/admin/product-reviews/:review_id
 * @desc Get a specific review by ID
 * @access Private (Admin)
 */
router.get(
  "/:review_id",
  verifyJwtToken,
  isAdmin,
  validator(validators.productReview.reviewIdValidator, "params"),
  adminProductReviewController.getReviewById
);

/**
 * @route PUT /api/v1/product-reviews/:review_id
 * @desc Update a review (only by the reviewer)
 * @access Private
 */
router.put(
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
router.patch(
  "/change-Status/:review_id",
  verifyJwtToken,
  isAdmin,
  validator(validators.productReview.reviewIdValidator, "params"),
  adminProductReviewController.changeReviewStatus
);

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
