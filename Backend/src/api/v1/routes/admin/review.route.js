import express from "express";
import { verifyJwtToken, isAdmin } from "../../../../middleware/index.js";
import { adminReviewController } from "../../controllers/index.js";

const router = express.Router();

// ✏️ Admin edits a review
router.put(
  "/:review_id",
  verifyJwtToken,
  isAdmin,
  adminReviewController.updateReview
);

export default router;
