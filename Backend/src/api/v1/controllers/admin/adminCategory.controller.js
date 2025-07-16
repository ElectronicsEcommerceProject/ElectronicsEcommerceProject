import db from "../../../../models/index.js"; // Import the database models
import { StatusCodes } from "http-status-codes"; // Import HTTP status codes
import MESSAGE from "../../../../constants/message.js"; // Import messages
import { deleteImages } from "../../../../utils/imageUtils.js";
import { cacheUtils } from "../../../../utils/cacheUtils.js";

const { Category, User, Product, ProductVariant, ProductMedia, ProductMediaUrl, WishListItem } = db;

// Add a new category
const addCategory = async (req, res) => {
  try {
    const { name, slug, target_role, parent_id, is_active } = req.body;

    // Get the user ID of the creator
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: MESSAGE.none });
    }
    const created_by = user.dataValues.user_id;

    try {
      // Create the new category
      const newCategory = await Category.create({
        name,
        slug,
        target_role: target_role || "both",
        parent_id: parent_id || null,
        is_active: is_active !== undefined ? is_active : true,
        created_by,
      });

      // Clear cache after successful creation
      await cacheUtils.clearPatterns("categories:*", "products:*", "dashboard:*");

      res
        .status(StatusCodes.CREATED)
        .json({ message: MESSAGE.post.succ, data: newCategory });
    } catch (createError) {
      console.error("Specific error creating category:", createError);
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: MESSAGE.post.fail,
        error: createError.message,
        details: createError.errors
          ? createError.errors.map((e) => e.message)
          : null,
      });
    }
  } catch (error) {
    console.error("Error adding category:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.error, error: error.message });
  }
};

// Get all categories - UPDATED WITH CACHE
const getAllCategories = async (req, res) => {
  const userRole = req.user.role;
  const cacheKey = `categories:${userRole}`;

  try {
    // 1. Check cache first
    const cachedData = await cacheUtils.get(cacheKey);
    if (cachedData) {
      return res.status(StatusCodes.OK).json({
        status: true,
        message: "Cached categories",
        data: cachedData
      });
    }

    // 2. If no cache, query database
    let categories;
    if (userRole === "admin") {
      categories = await Category.findAll();
    } else if (userRole === "customer") {
      categories = await Category.findAll({
        where: { target_role: ["customer", "both"] }
      });
    } else if (userRole === "retailer") {
      categories = await Category.findAll({
        where: { target_role: ["retailer", "both"] }
      });
    } else {
      return res.status(StatusCodes.FORBIDDEN).json({ message: MESSAGE.get.fail });
    }

    if (!categories.length) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        status: false, 
        message: MESSAGE.get.empty 
      });
    }

    // 3. Cache results
    await cacheUtils.set(cacheKey, categories);

    res.status(StatusCodes.OK).json({
      status: true,
      message: MESSAGE.get.succ,
      data: categories
    });

  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.error,
      error: error.message
    });
  }
};

// Update a category
const updateCategoryById = async (req, res) => {
  try {
    const { category_id } = req.params;
    const { name, slug, target_role, parent_id } = req.body;

    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: MESSAGE.none });
    }

    // Update fields
    category.name = name || category.name;
    category.slug = slug || category.slug;
    category.target_role = target_role || category.target_role;
    category.parent_id = parent_id || category.parent_id;

    // Update the updated_by field
    const user = await User.findOne({ where: { email: req.user.email } });
    if (user) {
      category.updated_by = user.dataValues.user_id;
    }

    await category.save();

    // Clear cache after successful update
    await cacheUtils.clearPatterns("categories:*", "products:*", "dashboard:*");

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.put.succ, data: category });
  } catch (error) {
    console.error("Error updating category:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.error, error: error.message });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {

  try {
    const { category_id } = req.params;

    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: MESSAGE.none });
    }

    // Get all products in this category with their images BEFORE deletion
    const products = await Product.findAll({
      where: { category_id },
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

    // Then delete the category (cascade will handle related records)
    await category.destroy();

    // Clear cache after successful deletion
    await cacheUtils.clearPatterns("categories:*", "brands:*", "products:*", "variants:*", "attributes:*", "dashboard:*");

    res.status(StatusCodes.OK).json({ message: MESSAGE.delete.succ });
  } catch (error) {
    console.error("Error deleting category:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.error, error: error.message });
  }
};

export default {
  addCategory,
  getAllCategories,
  updateCategoryById,
  deleteCategory,
};
