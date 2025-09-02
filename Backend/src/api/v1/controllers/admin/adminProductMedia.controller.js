import { StatusCodes } from "http-status-codes";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";
import { deleteImages } from "../../../../utils/imageUtils.js";

const { ProductMedia, Product, ProductVariant, User, productMediaUrl } = db;

// Add a new product media
const addProductMedia = async (req, res) => {
  try {
    const { product_id, product_variant_id, media_type } = req.body;

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product not found" });
    }

    // Check if variant exists if provided
    if (product_variant_id) {
      const variant = await ProductVariant.findByPk(product_variant_id);
      if (!variant) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Product variant not found" });
      }
    }

    // Get the user ID of the creator
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    const created_by = user.dataValues.user_id;

    // Create the new product media
    const newProductMedia = await ProductMedia.create({
      product_id,
      product_variant_id,
      media_type: media_type || "image",
      created_by,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: MESSAGE.post.succ, data: newProductMedia });
  } catch (error) {
    console.error("Error adding product media:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.post.fail, error: error.message });
  }
};

// Get all product media
const getAllProductMedia = async (req, res) => {
  try {
    const productMedia = await ProductMedia.findAll({
      include: [
        { model: Product },
        { model: ProductVariant },
        { model: User, as: "creator" },
        { model: User, as: "updater" },
      ],
    });

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.get.succ, data: productMedia });
  } catch (error) {
    console.error("Error fetching product media:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Get product media by ID
const getProductMediaById = async (req, res) => {
  try {
    const { id } = req.params;

    const productMedia = await ProductMedia.findByPk(id, {
      include: [
        { model: Product },
        { model: ProductVariant },
        { model: User, as: "creator" },
        { model: User, as: "updater" },
      ],
    });

    if (!productMedia) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.get.succ, data: productMedia });
  } catch (error) {
    console.error("Error fetching product media:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Get product media by product ID
const getProductMediaByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product not found" });
    }

    const productMedia = await ProductMedia.findAll({
      where: { product_id: productId },
      include: [
        { model: ProductVariant },
        { model: User, as: "creator" },
        { model: User, as: "updater" },
      ],
    });

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.get.succ, data: productMedia });
  } catch (error) {
    console.error("Error fetching product media by product:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Get product media by variant ID
const getProductMediaByVariant = async (req, res) => {
  try {
    const { variantId } = req.params;

    // Check if variant exists
    const variant = await ProductVariant.findByPk(variantId);
    if (!variant) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product variant not found" });
    }

    const productMedia = await ProductMedia.findAll({
      where: { product_variant_id: variantId },
      include: [
        { model: Product },
        { model: User, as: "creator" },
        { model: User, as: "updater" },
      ],
    });

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.get.succ, data: productMedia });
  } catch (error) {
    console.error("Error fetching product media by variant:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Update a product media
const updateProductMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, product_variant_id, media_type } = req.body;

    const productMedia = await ProductMedia.findByPk(id);
    if (!productMedia) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // Check if product exists if provided
    if (product_id) {
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Product not found" });
      }
    }

    // Check if variant exists if provided
    if (product_variant_id) {
      const variant = await ProductVariant.findByPk(product_variant_id);
      if (!variant) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Product variant not found" });
      }
    }

    // Get the user ID for updated_by
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // Update fields
    if (product_id) productMedia.product_id = product_id;
    if (product_variant_id !== undefined)
      productMedia.product_variant_id = product_variant_id;
    if (media_type) productMedia.media_type = media_type;
    productMedia.updated_by = user.dataValues.user_id;

    await productMedia.save();

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.put.succ, data: productMedia });
  } catch (error) {
    console.error("Error updating product media:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.put.fail, error: error.message });
  }
};

// Delete a product media
const deleteProductMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const productMedia = await ProductMedia.findByPk(id, {
      include: [{
        model: productMediaUrl,
        as: "productMediaUrls",
        attributes: ["product_media_url"]
      }]
    });

    if (!productMedia) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // Collect image URLs to delete
    const imagesToDelete = [];
    if (productMedia.productMediaUrls) {
      productMedia.productMediaUrls.forEach(mediaUrl => {
        if (mediaUrl.product_media_url) {
          imagesToDelete.push(mediaUrl.product_media_url);
        }
      });
    }

    await productMedia.destroy();

    // Delete associated images from filesystem
    deleteImages(imagesToDelete);

    res.status(StatusCodes.OK).json({ message: MESSAGE.delete.succ });
  } catch (error) {
    console.error("Error deleting product media:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.delete.fail, error: error.message });
  }
};

export default {
  addProductMedia,
  getAllProductMedia,
  getProductMediaById,
  getProductMediaByProduct,
  getProductMediaByVariant,
  updateProductMedia,
  deleteProductMedia,
};
