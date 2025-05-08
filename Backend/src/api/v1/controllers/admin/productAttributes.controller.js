import { StatusCodes } from "http-status-codes";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";

const { Attribute, User } = db;

// Add a new attribute
const addAttribute = async (req, res) => {
  try {
    const { name, data_type, is_variant_level } = req.body;

    // Get the user ID of the creator
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }
    const created_by = user.dataValues.user_id;

    // Create the new attribute
    const newAttribute = await Attribute.create({
      name,
      data_type,
      is_variant_level: is_variant_level || false,
      created_by,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: MESSAGE.post.succ, data: newAttribute });
  } catch (error) {
    console.error("Error adding attribute:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.post.fail, error: error.message });
  }
};

// Get all attributes
const getAllAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.findAll({
      include: [
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
      data: attributes,
    });
  } catch (error) {
    console.error("Error fetching attributes:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Get attribute by ID
const getAttributeById = async (req, res) => {
  try {
    const { id } = req.params;

    const attribute = await Attribute.findByPk(id, {
      include: [
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

    if (!attribute) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: attribute,
    });
  } catch (error) {
    console.error("Error fetching attribute:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Update an attribute
const updateAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, data_type, is_variant_level } = req.body;

    const attribute = await Attribute.findByPk(id);
    if (!attribute) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // Get the user ID for updated_by
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // Update fields
    if (name) attribute.name = name;
    if (data_type) attribute.data_type = data_type;
    if (is_variant_level !== undefined)
      attribute.is_variant_level = is_variant_level;

    attribute.updated_by = user.dataValues.user_id;

    await attribute.save();

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.put.succ, data: attribute });
  } catch (error) {
    console.error("Error updating attribute:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.put.fail, error: error.message });
  }
};

// Delete an attribute
const deleteAttribute = async (req, res) => {
  try {
    const { id } = req.params;

    const attribute = await Attribute.findByPk(id);
    if (!attribute) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    await attribute.destroy();

    res.status(StatusCodes.OK).json({ message: MESSAGE.delete.succ });
  } catch (error) {
    console.error("Error deleting attribute:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.delete.fail, error: error.message });
  }
};

export default {
  addAttribute,
  getAllAttributes,
  getAttributeById,
  updateAttribute,
  deleteAttribute,
};
