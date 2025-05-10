import express from "express";
import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import { adminCouponUserController } from "../../controllers/index.js";

const router = express.Router();

// Create a new coupon-user association
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.couponUser.couponUserValidator, null),
  adminCouponUserController.createCouponUser
);

// Get all coupon-user associations
router.get(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  adminCouponUserController.getAllCouponUsers
);

// Get coupon-user association by ID
router.get(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.couponUser.couponUserIdValidator, "params"),
  adminCouponUserController.getCouponUserById
);

// Get coupon-user associations by coupon ID
router.get(
  "/coupon/:coupon_id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.couponUser.couponIdValidator, "params"),
  adminCouponUserController.getCouponUsersByCouponId
);

// Get coupon-user associations by user ID
router.get(
  "/user/:user_id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.couponUser.userIdValidator, "params"),
  adminCouponUserController.getCouponUsersByUserId
);

// Delete a coupon-user association
router.delete(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.couponUser.couponUserIdValidator, "params"),
  adminCouponUserController.deleteCouponUser
);

export default router;
