import { StatusCodes } from "http-status-codes";
import db from "../../../../../models/index.js";
import MESSAGE from "../../../../../constants/message.js";

const { CouponUser, Coupon, User, CouponRedemption } = db;

// Create a new coupon-user association
export const createCouponUser = async (req, res) => {
  try {
    const { coupon_id, user_id, category_id, brand_id, product_id, product_variant_id } = req.body;

    // ✅ Check if coupon exists and is active
    const coupon = await Coupon.findByPk(coupon_id);
    if (!coupon) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Coupon not found", success: false });
    }

    // ✅ Verify coupon target eligibility
    if (coupon.target_type === "category" && coupon.category_id !== category_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "This coupon is not valid for the selected category",
        success: false
      });
    }
    
    if (coupon.target_type === "brand" && coupon.brand_id !== brand_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "This coupon is not valid for the selected brand",
        success: false
      });
    }
    
    if (coupon.target_type === "product" && coupon.product_id !== product_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "This coupon is not valid for the selected product",
        success: false
      });
    }
    
    if (coupon.target_type === "product_variant" && coupon.product_variant_id !== product_variant_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "This coupon is not valid for the selected product variant",
        success: false
      });
    }

    // ✅ Check if coupon is active
    if (!coupon.is_active) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Coupon is not active", success: false });
    }

    // ✅ Check if coupon is within valid date range
    const now = new Date();
    if (now < new Date(coupon.valid_from) || now > new Date(coupon.valid_to)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Coupon is not valid at this time", success: false });
    }

    // ✅ Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found", success: false });
    }

    // ✅ Check if coupon is for new users only
    if (coupon.is_user_new) {
      // Check if user has any previous orders or coupon usage
      const existingCouponUsage = await CouponUser.findOne({
        where: { user_id },
      });
      if (existingCouponUsage) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "This coupon is only for new users",
        });
      }
    }

    // ✅ Check usage per user limit (based on claims)
    if (coupon.usage_per_user) {
      const userCouponCount = await CouponUser.count({
        where: { user_id, coupon_id },
      });
      if (userCouponCount >= coupon.usage_per_user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "You have reached the usage limit for this coupon",
        });
      }
    }

    // ✅ Check overall usage limit (based on claims)
    if (coupon.usage_limit) {
      const totalUsageCount = await CouponUser.count({
        where: { coupon_id },
      });
      if (totalUsageCount >= coupon.usage_limit) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "This coupon has reached its usage limit",
        });
      }
    }

    // ✅ Create new association
    const newCouponUser = await CouponUser.create({ coupon_id, user_id });

    return res.status(StatusCodes.CREATED).json({
      message: "Coupon applied successfully",
      success: true,
      data: newCouponUser,
    });
  } catch (err) {
    console.error("❌ Error in createCouponUser:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.post.fail,
      success: false,
      error: err.message,
    });
  }
};

// Get all coupon-user associations
export const getAllCouponUsers = async (req, res) => {
  try {
    const couponUsers = await CouponUser.findAll({
      include: [
        {
          model: Coupon,
          attributes: [
            "coupon_id",
            "code",
            "description",
            "type",
            "discount_value",
          ],
        },
        {
          model: User,
          attributes: ["user_id", "name", "email", "role"],
        },
      ],
    });

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      success: true,
      data: couponUsers,
    });
  } catch (err) {
    console.error("❌ Error in getAllCouponUsers:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      success: false,
      error: err.message,
    });
  }
};

// Get coupon-user association by ID
export const getCouponUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const couponUser = await CouponUser.findByPk(id, {
      include: [
        {
          model: Coupon,
          attributes: [
            "coupon_id",
            "code",
            "description",
            "type",
            "discount_value",
          ],
        },
        {
          model: User,
          attributes: ["user_id", "name", "email", "role"],
        },
      ],
    });

    if (!couponUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Coupon-User association not found",
        success: false,
      });
    }

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      success: true,
      data: couponUser,
    });
  } catch (err) {
    console.error("❌ Error in getCouponUserById:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      success: false,
      error: err.message,
    });
  }
};

// Get coupon-user associations by coupon ID
export const getCouponUsersByCouponId = async (req, res) => {
  try {
    const { coupon_id } = req.params;

    const coupon = await Coupon.findByPk(coupon_id);
    if (!coupon) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Coupon not found", success: false });
    }

    const couponUsers = await CouponUser.findAll({
      where: { coupon_id },
      include: [
        {
          model: User,
          attributes: ["user_id", "name", "email", "role"],
        },
      ],
    });

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      success: true,
      data: couponUsers,
    });
  } catch (err) {
    console.error("❌ Error in getCouponUsersByCouponId:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      success: false,
      error: err.message,
    });
  }
};

// Get coupon-user associations by user ID
export const getCouponUsersByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found", success: false });
    }

    const couponUsers = await CouponUser.findAll({
      where: { user_id },
      include: [
        {
          model: Coupon,
          attributes: [
            "coupon_id",
            "code",
            "description",
            "type",
            "discount_value",
          ],
        },
      ],
    });

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      success: true,
      data: couponUsers,
    });
  } catch (err) {
    console.error("❌ Error in getCouponUsersByUserId:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      success: false,
      error: err.message,
    });
  }
};

// Delete a coupon-user association
export const deleteCouponUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin") {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Unauthorized: Only admin can delete coupon-user associations",
        success: false,
      });
    }

    const couponUser = await CouponUser.findByPk(id);
    if (!couponUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Coupon-User association not found",
        success: false,
      });
    }

    await couponUser.destroy();

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.delete.succ,
      success: true,
    });
  } catch (err) {
    console.error("❌ Error in deleteCouponUser:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.delete.fail,
      success: false,
      error: err.message,
    });
  }
};

export default {
  createCouponUser,
  getAllCouponUsers,
  getCouponUserById,
  getCouponUsersByCouponId,
  getCouponUsersByUserId,
  deleteCouponUser,
};
