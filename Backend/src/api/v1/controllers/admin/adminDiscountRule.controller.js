import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";

const { DiscountRule, Product, Category, Brand, ProductVariant, User } = db;

// Create a new discount rule
export const createDiscountRule = async (req, res) => {
  try {
    const {
      rule_type,
      product_id,
      category_id,
      brand_id,
      product_variant_id,
      min_retailer_quantity,
      bulk_discount_quantity,
      bulk_discount_percentage,
      discount_quantity,
      discount_percentage,
      is_active,
    } = req.body;

    // Verify admin user
    const admin = await User.findOne({
      where: { email: req.user.email, role: "admin" },
    });

    // console.log("test", admin);

    if (!admin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Unauthorized: Only admin can create discount rules",
      });
    }

    // Validate that at least one target (product, category, brand, or variant) is specified
    if (!product_id && !category_id && !brand_id && !product_variant_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          "At least one of product_id, category_id, brand_id, or product_variant_id must be specified",
      });
    }

    // Validate rule type specific fields
    if (
      rule_type === "bulk" &&
      (!bulk_discount_quantity || !bulk_discount_percentage)
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          "Bulk discount rules require both bulk_discount_quantity and bulk_discount_percentage",
      });
    }

    if (rule_type === "percentage" && !discount_percentage) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Percentage discount rules require discount_percentage",
      });
    }

    if (
      rule_type === "quantity" &&
      (!discount_quantity || !discount_percentage)
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          "Quantity discount rules require both discount_quantity and discount_percentage",
      });
    }

    if (rule_type === "retailer" && !min_retailer_quantity) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Retailer discount rules require min_retailer_quantity",
      });
    }

    // Create new discount rule
    const newDiscountRule = await DiscountRule.create({
      rule_type,
      product_id,
      category_id,
      brand_id,
      product_variant_id,
      min_retailer_quantity,
      bulk_discount_quantity,
      bulk_discount_percentage,
      discount_quantity,
      discount_percentage,
      is_active,
      created_by: admin.dataValues.user_id,
    });

    return res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      data: newDiscountRule,
    });
  } catch (err) {
    console.error("❌ Error in createDiscountRule:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.post.fail,
      error: err.message,
    });
  }
};

// Get all discount rules with optional filters
export const getAllDiscountRules = async (req, res) => {
  try {
    const {
      rule_type,
      product_id,
      category_id,
      brand_id,
      product_variant_id,
      is_active,
    } = req.query;

    // Build filter conditions
    const whereConditions = {};

    if (rule_type) whereConditions.rule_type = rule_type;
    if (product_id) whereConditions.product_id = product_id;
    if (category_id) whereConditions.category_id = category_id;
    if (brand_id) whereConditions.brand_id = brand_id;
    if (product_variant_id)
      whereConditions.product_variant_id = product_variant_id;
    if (is_active !== undefined)
      whereConditions.is_active = is_active === "true";

    const discountRules = await DiscountRule.findAll({
      where: whereConditions,
      include: [
        { model: Product, attributes: ["product_id", "name", "slug"] },
        { model: Category, attributes: ["category_id", "name", "slug"] },
        { model: Brand, attributes: ["brand_id", "name", "slug"] },
        {
          model: ProductVariant,
          attributes: ["product_variant_id", "sku", "price"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
        {
          model: User,
          as: "updater",
          attributes: ["user_id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: discountRules,
    });
  } catch (err) {
    console.error("❌ Error in getAllDiscountRules:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Get discount rule by ID
export const getDiscountRuleById = async (req, res) => {
  try {
    const { id } = req.params;

    const discountRule = await DiscountRule.findByPk(id, {
      include: [
        { model: Product, attributes: ["product_id", "name", "slug"] },
        { model: Category, attributes: ["category_id", "name", "slug"] },
        { model: Brand, attributes: ["brand_id", "name", "slug"] },
        {
          model: ProductVariant,
          attributes: ["product_variant_id", "sku", "price"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
        {
          model: User,
          as: "updater",
          attributes: ["user_id", "name", "email"],
        },
      ],
    });

    if (!discountRule) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Discount rule not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: discountRule,
    });
  } catch (err) {
    console.error("❌ Error in getDiscountRuleById:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Update discount rule
export const updateDiscountRule = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      rule_type,
      product_id,
      category_id,
      brand_id,
      product_variant_id,
      min_retailer_quantity,
      bulk_discount_quantity,
      bulk_discount_percentage,
      discount_quantity,
      discount_percentage,
      is_active,
    } = req.body;

    // Verify admin user
    const admin = await User.findOne({
      where: { email: req.user.email, role: "admin" },
    });
    if (!admin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Unauthorized: Only admin can update discount rules",
      });
    }

    // Find the discount rule
    const discountRule = await DiscountRule.findByPk(id);
    if (!discountRule) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Discount rule not found",
      });
    }

    // Validate rule type specific fields if rule_type is being updated
    if (rule_type) {
      if (
        rule_type === "bulk" &&
        ((!bulk_discount_quantity &&
          discountRule.bulk_discount_quantity === null) ||
          (!bulk_discount_percentage &&
            discountRule.bulk_discount_percentage === null))
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message:
            "Bulk discount rules require both bulk_discount_quantity and bulk_discount_percentage",
        });
      }

      if (
        rule_type === "percentage" &&
        !discount_percentage &&
        discountRule.discount_percentage === null
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Percentage discount rules require discount_percentage",
        });
      }

      if (
        rule_type === "quantity" &&
        ((!discount_quantity && discountRule.discount_quantity === null) ||
          (!discount_percentage && discountRule.discount_percentage === null))
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message:
            "Quantity discount rules require both discount_quantity and discount_percentage",
        });
      }

      if (
        rule_type === "retailer" &&
        !min_retailer_quantity &&
        discountRule.min_retailer_quantity === null
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Retailer discount rules require min_retailer_quantity",
        });
      }
    }

    // Update the discount rule
    await discountRule.update({
      rule_type: rule_type || discountRule.rule_type,
      product_id:
        product_id !== undefined ? product_id : discountRule.product_id,
      category_id:
        category_id !== undefined ? category_id : discountRule.category_id,
      brand_id: brand_id !== undefined ? brand_id : discountRule.brand_id,
      product_variant_id:
        product_variant_id !== undefined
          ? product_variant_id
          : discountRule.product_variant_id,
      min_retailer_quantity:
        min_retailer_quantity !== undefined
          ? min_retailer_quantity
          : discountRule.min_retailer_quantity,
      bulk_discount_quantity:
        bulk_discount_quantity !== undefined
          ? bulk_discount_quantity
          : discountRule.bulk_discount_quantity,
      bulk_discount_percentage:
        bulk_discount_percentage !== undefined
          ? bulk_discount_percentage
          : discountRule.bulk_discount_percentage,
      discount_quantity:
        discount_quantity !== undefined
          ? discount_quantity
          : discountRule.discount_quantity,
      discount_percentage:
        discount_percentage !== undefined
          ? discount_percentage
          : discountRule.discount_percentage,
      is_active: is_active !== undefined ? is_active : discountRule.is_active,
      updated_by: admin.dataValues.user_id,
    });

    // Fetch the updated discount rule with associations
    const updatedDiscountRule = await DiscountRule.findByPk(id, {
      include: [
        { model: Product, attributes: ["product_id", "name", "slug"] },
        { model: Category, attributes: ["category_id", "name", "slug"] },
        { model: Brand, attributes: ["brand_id", "name", "slug"] },
        {
          model: ProductVariant,
          attributes: ["product_variant_id", "sku", "price"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
        {
          model: User,
          as: "updater",
          attributes: ["user_id", "name", "email"],
        },
      ],
    });

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.put.succ,
      data: updatedDiscountRule,
    });
  } catch (err) {
    console.error("❌ Error in updateDiscountRule:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.put.fail,
      error: err.message,
    });
  }
};

// Delete discount rule
export const deleteDiscountRule = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify admin user
    const admin = await User.findOne({
      where: { email: req.user.email, role: "admin" },
    });
    if (!admin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Unauthorized: Only admin can delete discount rules",
      });
    }

    // Find the discount rule
    const discountRule = await DiscountRule.findByPk(id);
    if (!discountRule) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Discount rule not found",
      });
    }

    // Delete the discount rule
    await discountRule.destroy();

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.delete.succ,
    });
  } catch (err) {
    console.error("❌ Error in deleteDiscountRule:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.delete.fail,
      error: err.message,
    });
  }
};

// Export all functions
export default {
  createDiscountRule,
  getAllDiscountRules,
  getDiscountRuleById,
  updateDiscountRule,
  deleteDiscountRule,
};
