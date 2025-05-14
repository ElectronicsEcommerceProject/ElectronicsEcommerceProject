import { StatusCodes } from "http-status-codes";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";

const { ProductMediaUrl, ProductMedia, User } = db;

// Add a new product media URL
const addProductMediaURL = async (req, res) => {
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
    const newProductMediaURL = await ProductMediaUrl.create({
      product_media_id,
      product_media_url,
      media_type: media_type || "image",
      created_by,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: MESSAGE.post.succ, data: newProductMediaURL });
  } catch (error) {
    console.error("Error adding product media URL:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.post.fail, error: error.message });
  }
};

// Get all product media URLs
const getAllProductMediaURLs = async (req, res) => {
  try {
    const productMediaURLs = await ProductMediaUrl.findAll({
      include: [
        { model: ProductMedia },
        { model: User, as: "creator" },
        { model: User, as: "updater" },
      ],
    });

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.get.succ, data: productMediaURLs });
  } catch (error) {
    console.error("Error fetching product media URLs:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Get product media URL by ID
const getProductMediaURLById = async (req, res) => {
  try {
    const { id } = req.params;
    const productMediaURL = await ProductMediaUrl.findByPk(id, {
      include: [
        { model: ProductMedia },
        { model: User, as: "creator" },
        { model: User, as: "updater" },
      ],
    });

    if (!productMediaURL) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.get.succ, data: productMediaURL });
  } catch (error) {
    console.error("Error fetching product media URL:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Get product media URLs by media ID
const getProductMediaURLsByMediaId = async (req, res) => {
  try {
    const { mediaId } = req.params;

    // Check if product media exists
    const productMedia = await ProductMedia.findByPk(mediaId);
    if (!productMedia) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product media not found" });
    }

    const productMediaURLs = await ProductMediaUrl.findAll({
      where: { product_media_id: mediaId },
      include: [
        { model: User, as: "creator" },
        { model: User, as: "updater" },
      ],
    });

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.get.succ, data: productMediaURLs });
  } catch (error) {
    console.error("Error fetching product media URLs by media ID:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Update a product media URL
const updateProductMediaURL = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_media_id, product_media_url, media_type } = req.body;

    const productMediaURL = await ProductMediaUrl.findByPk(id);
    if (!productMediaURL) {
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

    // Update fields
    if (product_media_id) productMediaURL.product_media_id = product_media_id;
    if (product_media_url)
      productMediaURL.product_media_url = product_media_url;
    if (media_type) productMediaURL.media_type = media_type;
    productMediaURL.updated_by = user.dataValues.user_id;

    await productMediaURL.save();

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.put.succ, data: productMediaURL });
  } catch (error) {
    console.error("Error updating product media URL:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.put.fail, error: error.message });
  }
};

// Delete a product media URL
const deleteProductMediaURL = async (req, res) => {
  try {
    const { id } = req.params;

    const productMediaURL = await ProductMediaUrl.findByPk(id);
    if (!productMediaURL) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    await productMediaURL.destroy();
    res.status(StatusCodes.OK).json({ message: MESSAGE.delete.succ });
  } catch (error) {
    console.error("Error deleting product media URL:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.delete.fail, error: error.message });
  }
};

export default {
  addProductMediaURL,
  getAllProductMediaURLs,
  getProductMediaURLById,
  getProductMediaURLsByMediaId,
  updateProductMediaURL,
  deleteProductMediaURL,
};
