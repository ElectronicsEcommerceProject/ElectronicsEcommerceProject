import { StatusCodes } from "http-status-codes";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";

// Change AttributeValues to AttributeValue (singular)
const { ProductVariant, Product, User, AttributeValue } = db;

// Create a new product variant
const createProductVariant = async (req, res) => {
  try {
    // Get the user from the token
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // Validate product
    const product = await Product.findByPk(req.body.product_id);
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product not found" });
    }

    // Create the variant
    const variant = await ProductVariant.create({
      ...req.body,
      created_by: user.user_id,
    });

    // If attribute_values are provided, associate them with the variant
    if (req.body.attribute_values && req.body.attribute_values.length > 0) {
      // Validate that all attribute values exist
      const attributeValues = await AttributeValue.findAll({
        where: { id: req.body.attribute_values },
      });

      if (attributeValues.length !== req.body.attribute_values.length) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "One or more attribute values do not exist",
        });
      }

      // Associate attribute values with the variant
      await variant.setAttributeValues(req.body.attribute_values);
    }

    // Fetch the variant with its associations
    const createdVariant = await ProductVariant.findByPk(variant.variant_id, {
      include: [
        { model: Product, attributes: ["id", "name"] },
        { model: AttributeValue, attributes: ["id", "value"] },
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
      ],
    });

    res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      data: createdVariant,
    });
  } catch (error) {
    console.error("Error creating product variant:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.post.fail,
      error: error.message,
    });
  }
};

// Get all product variants
const getAllProductVariants = async (req, res) => {
  try {
    const variants = await ProductVariant.findAll({
      include: [
        { model: Product, attributes: ["id", "name"] },
        { model: AttributeValue, attributes: ["id", "value"] },
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
      ],
    });

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: variants,
    });
  } catch (error) {
    console.error("Error fetching product variants:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// Get product variant by ID
const getProductVariantById = async (req, res) => {
  try {
    const { id } = req.params;

    const variant = await ProductVariant.findByPk(id, {
      include: [
        { model: Product, attributes: ["id", "name"] },
        { model: AttributeValue, attributes: ["id", "value"] },
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
      ],
    });

    if (!variant) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.empty,
      });
    }

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: variant,
    });
  } catch (error) {
    console.error("Error fetching product variant:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// Get variants by product ID
const getVariantsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product not found",
      });
    }

    const variants = await ProductVariant.findAll({
      where: { product_id: productId },
      include: [
        { model: AttributeValue, attributes: ["id", "value"] },
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
      ],
    });

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: variants,
    });
  } catch (error) {
    console.error("Error fetching variants by product:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// Update product variant
const updateProductVariant = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if variant exists
    const variant = await ProductVariant.findByPk(id);
    if (!variant) {
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

    // If product_id is provided, validate it
    if (req.body.product_id) {
      const product = await Product.findByPk(req.body.product_id);
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product not found",
        });
      }
    }

    // Update the variant
    await variant.update({
      ...req.body,
      updated_by: user.user_id,
    });

    // If attribute_values are provided, update the associations
    if (req.body.attribute_values) {
      // Validate that all attribute values exist
      const attributeValues = await AttributeValue.findAll({
        where: { id: req.body.attribute_values },
      });

      if (attributeValues.length !== req.body.attribute_values.length) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "One or more attribute values do not exist",
        });
      }

      // Update attribute value associations
      await variant.setAttributeValues(req.body.attribute_values);
    }

    // Fetch the updated variant with its associations
    const updatedVariant = await ProductVariant.findByPk(id, {
      include: [
        { model: Product, attributes: ["id", "name"] },
        { model: AttributeValue, attributes: ["id", "value"] },
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
      data: updatedVariant,
    });
  } catch (error) {
    console.error("Error updating product variant:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.put.fail,
      error: error.message,
    });
  }
};

// Delete product variant
const deleteProductVariant = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if variant exists
    const variant = await ProductVariant.findByPk(id);
    if (!variant) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.empty,
      });
    }

    // Delete the variant
    await variant.destroy();

    res.status(StatusCodes.OK).json({
      message: MESSAGE.delete.succ,
    });
  } catch (error) {
    console.error("Error deleting product variant:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.delete.fail,
      error: error.message,
    });
  }
};

export default {
  createProductVariant,
  getAllProductVariants,
  getProductVariantById,
  getVariantsByProductId,
  updateProductVariant,
  deleteProductVariant,
};
