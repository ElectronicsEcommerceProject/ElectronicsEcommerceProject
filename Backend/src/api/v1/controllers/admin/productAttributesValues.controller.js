import { StatusCodes } from "http-status-codes";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";

const { AttributeValue, Attribute, User } = db;

// Add a new attribute value
const addAttributeValue = async (req, res) => {
  try {
    const { attribute_id, value } = req.body;

    // Check if attribute exists
    const attribute = await Attribute.findByPk(attribute_id);
    if (!attribute) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // Get the user ID of the creator
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    const created_by = user.dataValues.user_id;

    // Create the new attribute value
    const newAttributeValue = await AttributeValue.create({
      attribute_id,
      value,
      created_by,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: MESSAGE.post.succ, data: newAttributeValue });
  } catch (error) {
    console.error("Error adding attribute value:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.post.fail, error: error.message });
  }
};

// Get all attribute values
const getAllAttributeValues = async (req, res) => {
  try {
    const attributeValues = await AttributeValue.findAll({
      include: [
        { model: Attribute },
        { model: User, as: "creator" },
        { model: User, as: "updater" },
      ],
    });

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.get.succ, data: attributeValues });
  } catch (error) {
    console.error("Error fetching attribute values:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Get attribute values by attribute ID
const getAttributeValuesByAttribute = async (req, res) => {
  try {
    const { attributeId } = req.params;

    // Check if attribute exists
    const attribute = await Attribute.findByPk(attributeId);
    if (!attribute) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    const attributeValues = await AttributeValues.findAll({
      where: { attribute_id: attributeId },
      include: [
        { model: User, as: "creator" },
        { model: User, as: "updater" },
      ],
    });

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.get.succ, data: attributeValues });
  } catch (error) {
    console.error("Error fetching attribute values by attribute:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Get attribute value by ID
const getAttributeValueById = async (req, res) => {
  try {
    const { id } = req.params;

    const attributeValue = await AttributeValues.findByPk(id, {
      include: [
        { model: Attribute },
        { model: User, as: "creator" },
        { model: User, as: "updater" },
      ],
    });

    if (!attributeValue) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.get.succ, data: attributeValue });
  } catch (error) {
    console.error("Error fetching attribute value:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Update an attribute value
const updateAttributeValue = async (req, res) => {
  try {
    const { id } = req.params;
    const { attribute_id, value } = req.body;

    const attributeValue = await AttributeValues.findByPk(id);
    if (!attributeValue) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // If attribute_id is being updated, check if it exists
    if (attribute_id && attribute_id !== attributeValue.attribute_id) {
      const attribute = await Attribute.findByPk(attribute_id);
      if (!attribute) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: MESSAGE.get.none });
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
    if (attribute_id) attributeValue.attribute_id = attribute_id;
    if (value) attributeValue.value = value;
    attributeValue.updated_by = user.dataValues.user_id;

    await attributeValue.save();

    res
      .status(StatusCodes.OK)
      .json({ message: MESSAGE.put.succ, data: attributeValue });
  } catch (error) {
    console.error("Error updating attribute value:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.put.fail, error: error.message });
  }
};

// Delete an attribute value
const deleteAttributeValue = async (req, res) => {
  try {
    const { id } = req.params;

    const attributeValue = await AttributeValues.findByPk(id);
    if (!attributeValue) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    await attributeValue.destroy();

    res.status(StatusCodes.OK).json({ message: MESSAGE.delete.succ });
  } catch (error) {
    console.error("Error deleting attribute value:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.delete.fail, error: error.message });
  }
};

export default {
  addAttributeValue,
  getAllAttributeValues,
  getAttributeValuesByAttribute,
  getAttributeValueById,
  updateAttributeValue,
  deleteAttributeValue,
};
