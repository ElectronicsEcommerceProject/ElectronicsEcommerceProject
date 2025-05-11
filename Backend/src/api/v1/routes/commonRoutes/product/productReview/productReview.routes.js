import express from "express";
import { verifyJwtToken } from "../../../../../../middleware/jwt.middleware.js";
import { validator } from "../../../../../../middleware/validator/validator.middleware.js";
import { validators } from "../../../../validators/index.js";
import { productReviewController } from "../../../../controllers/index.js";
import { isAdmin } from "../../../../../../middleware/auth.middleware.js";

const router = express.Router();

// Create a new product review (requires authentication)
router.post(
  "/",
  verifyJwtToken,
  validator(validators.productReview.createReviewValidator, null),
  productReviewController.createProductReview
);

// Get all reviews for a product (public)
router.get(
  "/product/:product_id",
  verifyJwtToken,
  validator(validators.productReview.productIdValidator, "params"),
  productReviewController.getProductReviews
);

// Get a specific review by ID (public)
router.get(
  "/:review_id",
  validator(validators.productReview.reviewIdValidator, "params"),
  productReviewController.getReviewById
);

// Update a review (only by the reviewer)
router.put(
  "/:review_id",
  verifyJwtToken,
  validator(validators.productReview.reviewIdValidator, "params"),
  validator(validators.productReview.updateReviewValidator, null),
  productReviewController.updateReview
);

// Approve a review (admin only)
router.put(
  "/:review_id/approve",
  verifyJwtToken,
  isAdmin,
  validator(validators.productReview.reviewIdValidator, "params"),
  productReviewController.approveReview
);

// Delete a review (only by the reviewer)
router.delete(
  "/:review_id",
  verifyJwtToken,
  validator(validators.productReview.reviewIdValidator, "params"),
  productReviewController.deleteReview
);

// Get all reviews by the authenticated user
router.get("/user/me", verifyJwtToken, productReviewController.getUserReviews);

export default router;
