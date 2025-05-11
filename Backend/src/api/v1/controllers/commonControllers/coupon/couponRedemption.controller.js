import { StatusCodes } from "http-status-codes";
import db from "../../../../../models/index.js";
import MESSAGE from "../../../../../constants/message.js";

const { CouponRedemption, Coupon, User, Order } = db;

// Redeem a coupon
export const redeemCoupon = async (req, res) => {
  try {
    const { user_id, coupon_id, order_id, discount_amount } = req.body;

    // Verify user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
      });
    }

    // Verify coupon exists and is active
    const coupon = await Coupon.findByPk(coupon_id);
    if (!coupon) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Coupon not found",
      });
    }

    if (!coupon.is_active) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Coupon is not active",
      });
    }

    // Check if coupon is expired
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Coupon is not yet valid",
      });
    }

    if (coupon.valid_to && new Date(coupon.valid_to) < now) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Coupon has expired",
      });
    }

    // Verify order exists
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Order not found",
      });
    }

    // Check if coupon has already been redeemed for this order
    const existingRedemption = await CouponRedemption.findOne({
      where: { order_id },
    });

    if (existingRedemption) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "A coupon has already been redeemed for this order",
      });
    }

    // Check if user has reached usage limit for this coupon
    if (coupon.usage_per_user) {
      const userRedemptions = await CouponRedemption.count({
        where: { user_id, coupon_id },
      });

      if (userRedemptions >= coupon.usage_per_user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "You have reached the usage limit for this coupon",
        });
      }
    }

    // Check if coupon has reached its global usage limit
    if (coupon.usage_limit) {
      const totalRedemptions = await CouponRedemption.count({
        where: { coupon_id },
      });

      if (totalRedemptions >= coupon.usage_limit) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "This coupon has reached its usage limit",
        });
      }
    }

    // Create the redemption
    const redemption = await CouponRedemption.create({
      user_id,
      coupon_id,
      order_id,
      discount_amount,
      redeemed_at: new Date(),
    });

    return res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      data: redemption,
    });
  } catch (err) {
    console.error("❌ Error in redeemCoupon:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.post.fail,
      error: err.message,
    });
  }
};

// Get all redemptions for a user
export const getUserRedemptions = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Verify user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
      });
    }

    const redemptions = await CouponRedemption.findAll({
      where: { user_id },
      include: [
        {
          model: Coupon,
          as: "coupon",
        },
        {
          model: Order,
          as: "order",
        },
      ],
    });

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: redemptions,
    });
  } catch (err) {
    console.error("❌ Error in getUserRedemptions:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Get all redemptions for a coupon
export const getCouponRedemptions = async (req, res) => {
  try {
    const { coupon_id } = req.params;

    // Verify coupon exists
    const coupon = await Coupon.findByPk(coupon_id);
    if (!coupon) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Coupon not found",
      });
    }

    const redemptions = await CouponRedemption.findAll({
      where: { coupon_id },
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Order,
          as: "order",
        },
      ],
    });

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: redemptions,
    });
  } catch (err) {
    console.error("❌ Error in getCouponRedemptions:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Get all redemptions for an order
export const getOrderRedemptions = async (req, res) => {
  try {
    const { order_id } = req.params;

    // Verify order exists
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Order not found",
      });
    }

    const redemptions = await CouponRedemption.findAll({
      where: { order_id },
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Coupon,
          as: "coupon",
        },
      ],
    });

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: redemptions,
    });
  } catch (err) {
    console.error("❌ Error in getOrderRedemptions:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Get redemption by ID
export const getRedemptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const redemption = await CouponRedemption.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Coupon,
          as: "coupon",
        },
        {
          model: Order,
          as: "order",
        },
      ],
    });

    if (!redemption) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Coupon redemption not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: redemption,
    });
  } catch (err) {
    console.error("❌ Error in getRedemptionById:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Verify if a coupon can be redeemed
export const verifyCouponRedemption = async (req, res) => {
  try {
    const { coupon_id } = req.body;
    const user_id = req.user.user_id; // Get user ID from JWT token

    // Verify coupon exists and is active
    const coupon = await Coupon.findByPk(coupon_id);
    if (!coupon) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Coupon not found",
        valid: false,
      });
    }

    if (!coupon.is_active) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Coupon is not active",
        valid: false,
      });
    }

    // Check if coupon is expired
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Coupon is not yet valid",
        valid: false,
      });
    }

    if (coupon.valid_to && new Date(coupon.valid_to) < now) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Coupon has expired",
        valid: false,
      });
    }

    // Check if user has reached usage limit for this coupon
    if (coupon.usage_per_user) {
      const userRedemptions = await CouponRedemption.count({
        where: { user_id, coupon_id },
      });

      if (userRedemptions >= coupon.usage_per_user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "You have reached the usage limit for this coupon",
          valid: false,
        });
      }
    }

    // Check if coupon has reached its global usage limit
    if (coupon.usage_limit) {
      const totalRedemptions = await CouponRedemption.count({
        where: { coupon_id },
      });

      if (totalRedemptions >= coupon.usage_limit) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "This coupon has reached its usage limit",
          valid: false,
        });
      }
    }

    // If we get here, the coupon can be redeemed
    return res.status(StatusCodes.OK).json({
      message: "Coupon is valid and can be redeemed",
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        discount_value: coupon.discount_value,
        max_discount_value: coupon.max_discount_value,
      },
    });
  } catch (err) {
    console.error("❌ Error in verifyCouponRedemption:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      valid: false,
      error: err.message,
    });
  }
};

export default {
  redeemCoupon,
  getUserRedemptions,
  getCouponRedemptions,
  getOrderRedemptions,
  getRedemptionById,
  verifyCouponRedemption,
};
