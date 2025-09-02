import { StatusCodes } from "http-status-codes";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";
import { deleteImage } from "../../../../utils/imageUtils.js";

const { productMediaUrl, ProductMedia, User } = db;

// Add a new product media URL
const addproductMediaUrl = async (req, res) => {
  try {
    const { product_media_id, product_media_url, media_type } = req.body;

    // Check if product media exists
    const productMedia = await ProductMedia.findByPk(product_media_id);
    if (!productMedia) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product media not found" });
    }

    // Get the user ID of the creator
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }
    const created_by = user.dataValues.user_id;

    // Create the new product media URL
    const newproductMediaUrl = await productMediaUrl.create({
      product_media_id,
      product_media_url,
      media_type: media_type || "image",
      created_by,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: MESSAGE.post.succ, data: newproductMediaUrl });
  } catch (error) {
    console.error("Error adding product media URL:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.post.fail, error: error.message });
  }
};

// Get all product media URLs
const getAllproductMediaUrl = async (req, res) => {
  try {
    const productMediaUrl = await productMediaUrl.findAll({
      include: [
        { model: ProductMedia },
        { model: User, as: "creator" },
        { model: User, as: "updater" },
      ],
    });

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.get.succ, data: productMediaUrl });
  } catch (error) {
    console.error("Error fetching product media URLs:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Get product media URL by ID
const getproductMediaUrlById = async (req, res) => {
  try {
    const { id } = req.params;
    const productMediaUrl = await productMediaUrl.findByPk(id, {
      include: [
        { model: ProductMedia },
        { model: User, as: "creator" },
        { model: User, as: "updater" },
      ],
    });

    if (!productMediaUrl) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.get.succ, data: productMediaUrl });
  } catch (error) {
    console.error("Error fetching product media URL:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Get product media URLs by media ID
const getproductMediaUrlByMediaId = async (req, res) => {
  try {
    const { mediaId } = req.params;

    // Check if product media exists
    const productMedia = await ProductMedia.findByPk(mediaId);
    if (!productMedia) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product media not found" });
    }

    const productMediaUrl = await productMediaUrl.findAll({
      where: { product_media_id: mediaId },
      include: [
        { model: User, as: "creator" },
        { model: User, as: "updater" },
      ],
    });

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.get.succ, data: productMediaUrl });
  } catch (error) {
    console.error("Error fetching product media URLs by media ID:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Update a product media URL
const updateproductMediaUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_media_id, product_media_url, media_type } = req.body;

    const productMediaUrl = await productMediaUrl.findByPk(id);
    if (!productMediaUrl) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // Check if product media exists if provided
    if (product_media_id) {
      const productMedia = await ProductMedia.findByPk(product_media_id);
      if (!productMedia) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Product media not found" });
      }
    }

    // Get the user ID for updated_by
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // Handle image replacement - delete old image if new one is provided
    if (product_media_url && productMediaUrl.product_media_url &&
      product_media_url !== productMediaUrl.product_media_url) {
      deleteImage(productMediaUrl.product_media_url);
    }

    // Update fields
    if (product_media_id) productMediaUrl.product_media_id = product_media_id;
    if (product_media_url)
      productMediaUrl.product_media_url = product_media_url;
    if (media_type) productMediaUrl.media_type = media_type;
    productMediaUrl.updated_by = user.dataValues.user_id;

    await productMediaUrl.save();

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.put.succ, data: productMediaUrl });
  } catch (error) {
    console.error("Error updating product media URL:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.put.fail, error: error.message });
  }
};

// Delete a product media URL
const deleteproductMediaUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const productMediaUrl = await productMediaUrl.findByPk(id);
    if (!productMediaUrl) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // Store image path before deletion
    const imagePath = productMediaUrl.product_media_url;

    await productMediaUrl.destroy();

    // Delete associated image from filesystem
    if (imagePath) {
      deleteImage(imagePath);
    }

    res.status(StatusCodes.OK).json({ message: MESSAGE.delete.succ });
  } catch (error) {
    console.error("Error deleting product media URL:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.delete.fail, error: error.message });
  }
};

export default {
  addproductMediaUrl,
  getAllproductMediaUrl,
  getproductMediaUrlById,
  getproductMediaUrlByMediaId,
  updateproductMediaUrl,
  deleteproductMediaUrl,
};
