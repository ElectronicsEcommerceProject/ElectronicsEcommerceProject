import express from "express";
import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import { adminCouponController } from "../../controllers/index.js";

const router = express.Router();

// Create a new coupon
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.coupon.couponValidator, null),
  adminCouponController.createCoupon
);

// Get all coupons
router.get(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  adminCouponController.getAllCoupons
);

// Get coupon by ID
router.get(
  "/:coupon_id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.coupon.couponIdValidator, "params"),
  adminCouponController.getCouponById
);

// Update coupon
router.put(
  "/:coupon_id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.coupon.couponIdValidator, "params"),
  validator(validators.coupon.couponUpdateValidator, null),
  adminCouponController.updateCoupon
);

// Delete coupon (soft delete)
router.delete(
  "/:coupon_id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.coupon.couponIdValidator, "params"),
  adminCouponController.deleteCoupon
);

export default router;
