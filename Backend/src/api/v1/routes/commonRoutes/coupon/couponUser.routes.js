import express from "express";
import { verifyJwtToken, validator } from "../../../../../middleware/index.js";
import { validators } from "../../../validators/index.js";
import { userCouponUserController } from "../../../controllers/index.js";

const router = express.Router();

// Create a new coupon-user association
router.post(
  "/",
  verifyJwtToken,
  validator(validators.couponUser.couponUserValidator, null),
  userCouponUserController.createCouponUser
);

// Get all coupon-user associations
router.get("/", verifyJwtToken, userCouponUserController.getAllCouponUsers);

// Get coupon-user association by ID
router.get(
  "/:id",
  verifyJwtToken,
  validator(validators.couponUser.couponUserIdValidator, "params"),
  userCouponUserController.getCouponUserById
);

// Get coupon-user associations by coupon ID
router.get(
  "/coupon/:coupon_id",
  verifyJwtToken,
  validator(validators.couponUser.couponIdValidator, "params"),
  userCouponUserController.getCouponUsersByCouponId
);

// Get coupon-user associations by user ID
router.get(
  "/user/:user_id",
  verifyJwtToken,
  validator(validators.couponUser.userIdValidator, "params"),
  userCouponUserController.getCouponUsersByUserId
);

// Delete a coupon-user association
router.delete(
  "/:id",
  verifyJwtToken,
  validator(validators.couponUser.couponUserIdValidator, "params"),
  userCouponUserController.deleteCouponUser
);

export default router;
