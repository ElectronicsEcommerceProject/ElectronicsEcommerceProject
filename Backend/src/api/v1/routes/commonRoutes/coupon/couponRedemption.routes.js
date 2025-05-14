import express from "express";
import { verifyJwtToken, validator } from "../../../../../middleware/index.js";
import { validators } from "../../../validators/index.js";
import { couponRedemptionController } from "../../../controllers/index.js";
const router = express.Router();

// Redeem a coupon
router.post(
  "/",
  verifyJwtToken,
  validator(validators.couponRedemption.couponRedemptionValidator, null),
  couponRedemptionController.redeemCoupon
);

// Get all redemptions for a user
router.get(
  "/user/:user_id",
  verifyJwtToken,
  validator(validators.couponRedemption.userIdValidator, "params"),
  couponRedemptionController.getUserRedemptions
);

// Get all redemptions for a coupon
router.get(
  "/coupon/:coupon_id",
  verifyJwtToken,
  validator(validators.couponRedemption.couponIdValidator, "params"),
  couponRedemptionController.getCouponRedemptions
);

// Get all redemptions for an order
router.get(
  "/order/:order_id",
  verifyJwtToken,
  validator(validators.couponRedemption.orderIdValidator, "params"),
  couponRedemptionController.getOrderRedemptions
);

// Get redemption by ID
router.get(
  "/:id",
  verifyJwtToken,
  validator(validators.couponRedemption.couponRedemptionIdValidator, "params"),
  couponRedemptionController.getRedemptionById
);

// Verify if a coupon can be redeemed
router.post(
  "/verify",
  verifyJwtToken,
  validator(validators.couponRedemption.couponIdValidator, null),
  couponRedemptionController.verifyCouponRedemption
);

export default router;
