import db from "../../../../models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../constants/message.js";

const { Brand, User, Category, Product } = db;

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
  try {
    const brands = await Brand.findAll();
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

    await brand.destroy();
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

    // Validate category_id parameter
    if (!category_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Category ID is required" });
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
