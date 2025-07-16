import db from "../../../../models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../constants/message.js";
import { deleteImages } from "../../../../utils/imageUtils.js";
import { cacheUtils } from "../../../../utils/cacheUtils.js";

const { Brand, User, Category, Product, ProductVariant, ProductMedia, ProductMediaUrl } = db;

// Add a new brand
const addBrand = async (req, res) => {
  try {
    const { name, slug } = req.body;

    // Get the user ID of the creator
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }
    const created_by = user.dataValues.user_id;

    // Create the new brand
    const newBrand = await Brand.create({
      name,
      slug,
      created_by,
    });

    // Clear cache after successful creation
    await cacheUtils.clearPatterns("brands:*", "products:*", "dashboard:*");

    res
      .status(StatusCodes.CREATED)
      .json({ message: MESSAGE.post.succ, data: newBrand });
  } catch (error) {
    console.error("Error adding brand:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.post.fail, error: error.message });
  }
};

// Get all brands
const getAllBrands = async (req, res) => {
  const cacheKey = "brands:all";

  try {
    // Check cache first
    const cachedData = await cacheUtils.get(cacheKey);
    if (cachedData) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Cached brands",
        data: cachedData
      });
    }

    // If no cache, query database
    const brands = await Brand.findAll();
    
    // Cache results
    await cacheUtils.set(cacheKey, brands);

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: MESSAGE.get.succ, data: brands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Update a brand
const updateBrand = async (req, res) => {
  try {
    const { brand_id } = req.params;
    const { name, slug } = req.body;

    const brand = await Brand.findByPk(brand_id);
    if (!brand) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // Update fields
    brand.name = name || brand.name;
    brand.slug = slug || brand.slug;

    // Update the updated_by field
    const user = await User.findOne({ where: { email: req.user.email } });
    if (user) {
      brand.updated_by = user.dataValues.user_id;
    }

    await brand.save();

    // Clear cache after successful update
    await cacheUtils.clearPatterns("brands:*", "products:*", "dashboard:*");

    res.status(StatusCodes.OK).json({ message: MESSAGE.put.succ, data: brand });
  } catch (error) {
    console.error("Error updating brand:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.put.fail, error: error.message });
  }
};

// Delete a brand
const deleteBrand = async (req, res) => {
  try {
    const { brand_id } = req.params;

    const brand = await Brand.findByPk(brand_id);
    if (!brand) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // Get all products of this brand with their images BEFORE deletion
    const products = await Product.findAll({
      where: { brand_id },
      include: [
        {
          model: ProductVariant,
          as: "variants",
          attributes: ["base_variant_image_url"]
        },
        {
          model: ProductMedia,
          as: "media",
          include: [{
            model: ProductMediaUrl,
            attributes: ["product_media_url"]
          }]
        }
      ]
    });

    // Collect all image paths
    const imagesToDelete = [];
    products.forEach(product => {
      // Add variant images
      if (product.variants) {
        product.variants.forEach(variant => {
          if (variant.base_variant_image_url) {
            imagesToDelete.push(variant.base_variant_image_url);
          }
        });
      }
      
      // Add product media images
      if (product.media) {
        product.media.forEach(media => {
          if (media.ProductMediaURLs) {
            media.ProductMediaURLs.forEach(mediaUrl => {
              if (mediaUrl.product_media_url) {
                imagesToDelete.push(mediaUrl.product_media_url);
              }
            });
          }
        });
      }
    });

    // Delete associated images from filesystem FIRST
    if (imagesToDelete.length > 0) {
      deleteImages(imagesToDelete);
    }

    // Then delete the brand (cascade will handle related records)
    await brand.destroy();

    // Clear cache after successful deletion
    await cacheUtils.clearPatterns("brands:*", "products:*", "categories:*", "variants:*", "attributes:*", "dashboard:*");

    res.status(StatusCodes.OK).json({ message: MESSAGE.delete.succ });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.delete.fail, error: error.message });
  }
};

const getBrandsByCategoryId = async (req, res) => {
  try {
    const { category_id } = req.params;
    const cacheKey = `brands:category:${category_id}`;

    // Validate category_id parameter
    if (!category_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Category ID is required" });
    }

    // Check cache first
    const cachedData = await cacheUtils.get(cacheKey);
    if (cachedData) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Cached brands by category",
        data: cachedData
      });
    }

    // Check if category exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Category not found" });
    }

    // Find all unique brands that have products in this category
    const brands = await Brand.findAll({
      include: [
        {
          model: Product,
          where: { category_id: category_id },
          attributes: [], // We don't need product data, just the association
          required: true, // INNER JOIN - only brands that have products in this category
        },
      ],
      attributes: [
        "brand_id",
        "name",
        "slug",
        "created_by",
        "updated_by",
        "createdAt",
        "updatedAt",
      ],
      group: ["Brand.brand_id"], // Group by brand to get unique brands
      order: [["name", "ASC"]], // Order by brand name alphabetically
    });

    // Cache results
    await cacheUtils.set(cacheKey, brands);

    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: brands,
    });
  } catch (error) {
    console.error("Error fetching brands by category ID:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

export default {
  addBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
  getBrandsByCategoryId,
};
