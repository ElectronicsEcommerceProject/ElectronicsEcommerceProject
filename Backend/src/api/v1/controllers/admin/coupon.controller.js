import sequelize from "sequelize";
import { StatusCodes } from "http-status-codes";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";

const { Coupon, User, Product, ProductVariant, CouponUser, CouponRedemption } =
  db;

// Create a new coupon
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      type,
      discount_value,
      target_type,
      product_id,
      product_variant_id,
      target_role,
      min_cart_value,
      max_discount_value,
      usage_limit,
      usage_per_user,
      valid_from,
      valid_to,
      is_active,
      is_user_new,
    } = req.body;

    // Verify admin user
    const admin = await User.findOne({
      where: { email: req.user.email, role: "admin" },
    });
    if (!admin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Unauthorized: Only admin can create coupons",
      });
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ where: { code } });
    if (existingCoupon) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "Coupon code already exists",
      });
    }

    // Verify product exists if product-specific coupon
    if (product_id) {
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product not found",
        });
      }
    }

    // Verify product variant exists if specified
    if (product_variant_id) {
      const variant = await ProductVariant.findByPk(product_variant_id);
      if (!variant) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product variant not found",
        });
      }
    }

    // Create new coupon
    const newCoupon = await Coupon.create({
      code,
      description,
      type,
      discount_value,
      target_type,
      product_id,
      product_variant_id,
      target_role,
      min_cart_value,
      max_discount_value,
      usage_limit,
      usage_per_user,
      valid_from,
      valid_to,
      is_active,
      is_user_new,
      created_by: admin.user_id,
    });

    return res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      data: newCoupon,
    });
  } catch (err) {
    console.error("❌ Error in createCoupon:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.post.fail,
      error: err.message,
    });
  }
};

// Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
        {
          model: Product,
          attributes: ["product_id", "name", "slug"],
        },
        {
          model: ProductVariant,
          attributes: ["product_variant_id", "sku", "price"],
        },
      ],
    });

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: coupons,
    });
  } catch (err) {
    console.error("❌ Error in getAllCoupons:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Get coupon by ID
export const getCouponById = async (req, res) => {
  try {
    const { coupon_id } = req.params;

    const coupon = await Coupon.findByPk(coupon_id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
        {
          model: Product,
          attributes: ["product_id", "name", "slug"],
        },
        {
          model: ProductVariant,
          attributes: ["product_variant_id", "sku", "price"],
        },
      ],
    });

    if (!coupon) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Coupon not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: coupon,
    });
  } catch (err) {
    console.error("❌ Error in getCouponById:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const { coupon_id } = req.params;
    const updateData = req.body;

    // Verify admin user
    const admin = await User.findOne({
      where: { email: req.user.email, role: "admin" },
    });
    if (!admin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Unauthorized: Only admin can update coupons",
      });
    }

    const coupon = await Coupon.findByPk(coupon_id);
    if (!coupon) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Coupon not found",
      });
    }

    // Check if updating code and if it already exists
    if (updateData.code && updateData.code !== coupon.code) {
      const existingCoupon = await Coupon.findOne({
        where: { code: updateData.code },
      });
      if (existingCoupon) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "Coupon code already exists",
        });
      }
    }

    // Verify product exists if updating to product-specific coupon
    if (updateData.product_id) {
      const product = await Product.findByPk(updateData.product_id);
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product not found",
        });
      }
    }

    // Verify product variant exists if updating
    if (updateData.product_variant_id) {
      const variant = await ProductVariant.findByPk(
        updateData.product_variant_id
      );
      if (!variant) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product variant not found",
        });
      }
    }

    // Add updated_by field
    updateData.updated_by = admin.user_id;

    // Update coupon
    await coupon.update(updateData);

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.put.succ,
      data: coupon,
    });
  } catch (err) {
    console.error("❌ Error in updateCoupon:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.put.fail,
      error: err.message,
    });
  }
};

// Delete coupon (soft delete by setting is_active to false)
export const deleteCoupon = async (req, res) => {
  try {
    const { coupon_id } = req.params;

    // Verify admin user
    const admin = await User.findOne({
      where: { email: req.user.email, role: "admin" },
    });
    if (!admin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Unauthorized: Only admin can delete coupons",
      });
    }

    const coupon = await Coupon.findByPk(coupon_id);
    if (!coupon) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Coupon not found",
      });
    }

    // Soft delete by setting is_active to false
    await coupon.update({
      is_active: false,
      updated_by: admin.user_id,
    });

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.delete.succ,
    });
  } catch (err) {
    console.error("❌ Error in deleteCoupon:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.delete.fail,
      error: err.message,
    });
  }
};

export const changeCouponStatus = async (req, res) => {
  try {
    const { coupon_id } = req.params;
    const { is_active } = req.body;

    // Verify admin user
    const admin = await User.findOne({
      where: { email: req.user.email, role: "admin" },
    });
    if (!admin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Unauthorized: Only admin can change coupon status",
      });
    }

    const coupon = await Coupon.findByPk(coupon_id);
    if (!coupon) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Coupon not found",
      });
    }

    // Update coupon status
    await coupon.update({
      is_active,
      updated_by: admin.user_id,
    });

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.patch.succ,
      data: coupon,
    });
  } catch (err) {
    console.error("❌ Error in changeCouponStatus:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.patch.fail,
      error: err.message,
    });
  }
};

/**
 * Controller to fetch coupon analytics data
 */
export const getCouponAnalytics = async (req, res) => {
  try {
    // Step 1: Fetch Usage Statistics (redemptions per quarter)
    const usageStats = await CouponRedemption.findAll({
      attributes: [
        [sequelize.fn("QUARTER", sequelize.col("redeemed_at")), "quarter"],
        [sequelize.fn("COUNT", sequelize.col("coupon_redemption_id")), "count"],
      ],
      group: [sequelize.fn("QUARTER", sequelize.col("redeemed_at"))],
      order: [[sequelize.literal("quarter"), "ASC"]],
      raw: true,
    });

    // Format usage statistics into { Q1: count, Q2: count, ... }
    const usageStatistics = {
      Q1: 0,
      Q2: 0,
      Q3: 0,
      Q4: 0,
    };
    usageStats.forEach((stat) => {
      usageStatistics[`Q${stat.quarter}`] = parseInt(stat.count);
    });

    // Step 2: Fetch Redemption Rate (total redemptions / total assigned coupons)
    const totalRedemptions = await CouponRedemption.count();
    const totalAssignedCoupons = await CouponUser.count();
    const redemptionRate =
      totalAssignedCoupons > 0
        ? Math.round((totalRedemptions / totalAssignedCoupons) * 100)
        : 0;

    // Step 3: Fetch Top-Performing Coupons
    // First get all coupons
    const coupons = await Coupon.findAll({
      attributes: ["coupon_id", "code"],
      raw: true,
    });

    // Then for each coupon, get its assignment and redemption counts
    const couponPerformanceData = await Promise.all(
      coupons.map(async (coupon) => {
        const assignmentCount = await CouponUser.count({
          where: { coupon_id: coupon.coupon_id },
        });

        const redemptionCount = await CouponRedemption.count({
          where: { coupon_id: coupon.coupon_id },
        });

        const redemptionRate =
          assignmentCount > 0
            ? Math.round((redemptionCount / assignmentCount) * 100)
            : 0;

        return {
          code: coupon.code,
          assignmentCount,
          redemptionCount,
          redemptionRate,
        };
      })
    );

    // Sort by redemption rate and get top 3
    const topCoupons = couponPerformanceData
      .filter((coupon) => coupon.assignmentCount > 0)
      .sort((a, b) => b.redemptionRate - a.redemptionRate)
      .slice(0, 3)
      .map((coupon) => ({
        code: coupon.code,
        redemptionRate: `${coupon.redemptionRate}%`,
      }));

    // Step 4: Prepare the response
    const response = {
      success: true,
      message: "Coupon analytics data fetched successfully",
      data: {
        usageStatistics,
        redemptionRate: `${redemptionRate}%`,
        topCoupons,
      },
    };

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching coupon analytics:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching coupon analytics.",
      error: error.message,
    });
  }
};

export default {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  changeCouponStatus,
  getCouponAnalytics, // Add this line to export the getCouponAnalytics function as well.
};
