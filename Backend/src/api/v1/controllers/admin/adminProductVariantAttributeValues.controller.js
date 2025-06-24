import { StatusCodes } from "http-status-codes";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";

const { VariantAttributeValue, ProductVariant, AttributeValue, User } = db;

// Create a new variant attribute value mapping
const createVariantAttributeValue = async (req, res) => {
  try {
    // Get the user from the token
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // Validate product variant exists
    const variant = await ProductVariant.findByPk(req.body.product_variant_id);
    if (!variant) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product variant not found" });
    }

    // Validate attribute value exists
    const attributeValue = await AttributeValue.findByPk(
      req.body.product_attribute_value_id
    );
    if (!attributeValue) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product attribute value not found" });
    }

    // Check if mapping already exists
    const existingMapping = await VariantAttributeValue.findOne({
      where: {
        product_variant_id: req.body.product_variant_id,
        product_attribute_value_id: req.body.product_attribute_value_id,
      },
    });

    if (existingMapping) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "This attribute value is already assigned to the variant",
      });
    }

    // Create the mapping
    const variantAttributeValue = await VariantAttributeValue.create({
      product_variant_id: req.body.product_variant_id,
      product_attribute_value_id: req.body.product_attribute_value_id,
      created_by: user.user_id,
    });

    // Fetch the created mapping with associations
    const createdMapping = await VariantAttributeValue.findByPk(
      variantAttributeValue.variant_attribute_value_id,
      {
        include: [
          { model: ProductVariant },
          { model: AttributeValue },
          {
            model: User,
            as: "creator",
            attributes: ["user_id", "name", "email"],
          },
        ],
      }
    );

    res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      data: createdMapping,
    });
  } catch (error) {
    console.error("Error creating variant attribute value:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.post.fail,
      error: error.message,
    });
  }
};

// Get all variant attribute value mappings
const getAllVariantAttributeValues = async (req, res) => {
  try {
    const mappings = await VariantAttributeValue.findAll({
      include: [
        { model: ProductVariant },
        { model: Attribute },
        { model: AttributeValue },
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

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: mappings,
    });
  } catch (error) {
    console.error("Error fetching variant attribute values:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// Get variant attribute value mapping by ID
const getVariantAttributeValueById = async (req, res) => {
  try {
    const { id } = req.params;

    const mapping = await VariantAttributeValue.findByPk(id, {
      include: [
        { model: ProductVariant },
        { model: Attribute },
        { model: AttributeValue },
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

    if (!mapping) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.empty,
      });
    }

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: mapping,
    });
  } catch (error) {
    console.error("Error fetching variant attribute value:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// Get attribute values by variant ID
const getAttributeValuesByVariant = async (req, res) => {
  try {
    const { variantId } = req.params;

    // Check if variant exists
    const variant = await ProductVariant.findByPk(variantId);
    if (!variant) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product variant not found",
      });
    }

    const mappings = await VariantAttributeValue.findAll({
      where: { product_variant_id: variantId },
      include: [{ model: AttributeValue }],
    });

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: mappings,
    });
  } catch (error) {
    console.error("Error fetching attribute values by variant:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// Get variants by attribute value
const getVariantsByAttributeValue = async (req, res) => {
  try {
    const { attributeValueId } = req.params;

    // Check if attribute value exists
    const attributeValue = await AttributeValue.findByPk(attributeValueId);
    if (!attributeValue) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Attribute value not found",
      });
    }

    const mappings = await VariantAttributeValue.findAll({
      where: { product_attribute_value_id: attributeValueId },
      include: [{ model: ProductVariant }],
    });

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: mappings,
    });
  } catch (error) {
    console.error("Error fetching variants by attribute value:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// Update variant attribute value mapping
const updateVariantAttributeValue = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if mapping exists
    const mapping = await VariantAttributeValue.findByPk(id);
    if (!mapping) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.empty,
      });
    }

    // Get the user from the token
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.empty,
      });
    }

    // Validate fields if provided
    if (req.body.product_variant_id) {
      const variant = await ProductVariant.findByPk(
        req.body.product_variant_id
      );
      if (!variant) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product variant not found",
        });
      }
    }

    if (req.body.product_attribute_value_id) {
      const attributeValue = await AttributeValue.findByPk(
        req.body.product_attribute_value_id
      );
      if (!attributeValue) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product attribute value not found",
        });
      }
    }

    // Update the mapping
    await mapping.update({
      ...req.body,
      updated_by: user.user_id,
    });

    // Fetch the updated mapping with associations
    const updatedMapping = await VariantAttributeValue.findByPk(id, {
      include: [
        { model: ProductVariant },
        { model: AttributeValue },
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

    res.status(StatusCodes.OK).json({
      message: MESSAGE.put.succ,
      data: updatedMapping,
    });
  } catch (error) {
    console.error("Error updating variant attribute value:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.put.fail,
      error: error.message,
    });
  }
};

// Delete variant attribute value mapping
const deleteVariantAttributeValue = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if mapping exists
    const mapping = await VariantAttributeValue.findByPk(id);
    if (!mapping) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.empty,
      });
    }

    // Delete the mapping
    await mapping.destroy();

    res.status(StatusCodes.OK).json({
      message: MESSAGE.delete.succ,
    });
  } catch (error) {
    console.error("Error deleting variant attribute value:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.delete.fail,
      error: error.message,
    });
  }
};

export default {
  createVariantAttributeValue,
  getAllVariantAttributeValues,
  getVariantAttributeValueById,
  getAttributeValuesByVariant,
  getVariantsByAttributeValue,
  updateVariantAttributeValue,
  deleteVariantAttributeValue,
};
