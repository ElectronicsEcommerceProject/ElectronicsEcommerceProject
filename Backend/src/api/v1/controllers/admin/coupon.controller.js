import { StatusCodes } from "http-status-codes";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";

const { Coupon, User, Product, ProductVariant } = db;

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

export default {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  changeCouponStatus,
};
