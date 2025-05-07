import { StatusCodes } from "http-status-codes";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";
const { ProductType, User } = db;
// Add a new product type
const addProductType = async (req, res) => {
  try {
    const { name, description } = req.body;
    // Get the user ID of the creator
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }
    const created_by = user.dataValues.user_id;
    // Create the new product type
    const newProductType = await ProductType.create({
      name,
      description,
      created_by,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ message: MESSAGE.post.succ, data: newProductType });
  } catch (error) {
    console.error("Error adding product type:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.post.fail, error: error.message });
  }
};
// Get all product types
const getAllProductTypes = async (req, res) => {
  try {
    const productTypes = await ProductType.findAll();
    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.get.succ, data: productTypes });
  } catch (error) {
    console.error("Error fetching product types:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};
// Update a product type
const updateProductType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const productType = await ProductType.findByPk(id);
    if (!productType) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.empty });
    }
    // Update fields
    productType.name = name || productType.name;
    productType.description = description || productType.description;
    // Update the updated_by field
    const user = await User.findOne({ where: { email: req.user.email } });
    if (user) {
      productType.updated_by = user.dataValues.user_id;
    }
    await productType.save();
    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.put.succ, data: productType });
  } catch (error) {
    console.error("Error updating product type:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.update.fail, error: error.message });
  }
};

// Delete a product type
const deleteProductType = async (req, res) => {
  try {
    const { id } = req.params;
    const productType = await ProductType.findByPk(id);
    if (!productType) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }
    await productType.destroy();
    res.status(StatusCodes.OK).json({ message: MESSAGE.delete.succ });
  } catch (error) {
    console.error("Error deleting product type:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.delete.fail, error: error.message });
  }
};
export default {
  addProductType,
  getAllProductTypes,
  deleteProductType,
  updateProductType,
};
