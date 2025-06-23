import { StatusCodes } from "http-status-codes";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";

const { CouponUser, Coupon, User } = db;

// Create a new coupon-user association
export const createCouponUser = async (req, res) => {
  try {
    const { coupon_id, user_id } = req.body;

    // Verify admin user
    const admin = await User.findOne({
      where: { email: req.user.email, role: "admin" },
    });
    if (!admin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Unauthorized: Only admin can create coupon-user associations",
      });
    }

    // Check if coupon exists
    const coupon = await Coupon.findByPk(coupon_id);
    if (!coupon) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Coupon not found",
      });
    }

    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
      });
    }

    // Check if association already exists
    const existingAssociation = await CouponUser.findOne({
      where: { coupon_id, user_id },
    });

    if (existingAssociation) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "This user already has this coupon assigned",
      });
    }

    // Create new coupon-user association
    const newCouponUser = await CouponUser.create({
      coupon_id,
      user_id,
    });

    return res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      data: newCouponUser,
    });
  } catch (err) {
    console.error("❌ Error in createCouponUser:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.post.fail,
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
      data: couponUsers,
    });
  } catch (err) {
    console.error("❌ Error in getAllCouponUsers:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
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
      });
    }

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: couponUser,
    });
  } catch (err) {
    console.error("❌ Error in getCouponUserById:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Get coupon-user associations by coupon ID
export const getCouponUsersByCouponId = async (req, res) => {
  try {
    const { coupon_id } = req.params;

    // Check if coupon exists
    const coupon = await Coupon.findByPk(coupon_id);
    if (!coupon) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Coupon not found",
      });
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
      data: couponUsers,
    });
  } catch (err) {
    console.error("❌ Error in getCouponUsersByCouponId:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Get coupon-user associations by user ID
export const getCouponUsersByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
      });
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
      data: couponUsers,
    });
  } catch (err) {
    console.error("❌ Error in getCouponUsersByUserId:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Delete a coupon-user association
export const deleteCouponUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify admin user
    const admin = await User.findOne({
      where: { email: req.user.email, role: "admin" },
    });
    if (!admin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Unauthorized: Only admin can delete coupon-user associations",
      });
    }

    const couponUser = await CouponUser.findByPk(id);
    if (!couponUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Coupon-User association not found",
      });
    }

    // Delete the association
    await couponUser.destroy();

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.delete.succ,
    });
  } catch (err) {
    console.error("❌ Error in deleteCouponUser:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.delete.fail,
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
