import db from "../../../../models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../constants/message.js";

const { Brand, User } = db;

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

export default {
  addBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
};
