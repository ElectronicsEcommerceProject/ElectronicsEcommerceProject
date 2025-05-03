import express from "express";

import { verifyJwtToken, isAdmin } from "../../../../middleware/index.js";
import { adminCouponController } from "../../controllers/index.js";

const router = express.Router();

// Route to create a new coupon
// router.post("/", verifyJwtToken, isAdmin, adminCouponController.createCoupon);

export default router;
