import db from "../../../../../models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../../constants/message.js";

const { Address, User } = db;

// Add a new address for the authenticated user
const addAddress = async (req, res) => {
  try {
    const { status, type, address, city, postal_code, nearby } = req.body;

    // Get user from JWT token
    const user = await User.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: MESSAGE.none });
    }

    // If this is a default address, update any existing default addresses to history
    if (status === "default") {
      await Address.update(
        { status: "history" },
        {
          where: {
            user_id: user.user_id,
            status: "default",
          },
        }
      );
    }

    // Create new address
    const newAddress = await Address.create({
      user_id: user.user_id,
      status,
      type,
      address,
      city,
      postal_code,
      nearby: nearby || null,
      is_active: true,
    });

    // If this is the first address or a default address, update user's current_address_id
    if (status === "default") {
      await User.update(
        { current_address_id: newAddress.address_id },
        { where: { user_id: user.user_id } }
      );
    }

    res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      address: newAddress,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.post.fail, error: error.message });
  }
};

// Get all addresses for the authenticated user
const getAddresses = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: MESSAGE.none });
    }

    const addresses = await Address.findAll({
      where: {
        user_id: user.user_id,
        is_active: true,
      },
      order: [
        ["status", "ASC"], // Default addresses first
        ["updatedAt", "DESC"], // Most recently updated first
      ],
    });

    if (!addresses || addresses.length === 0) {
      return res.status(StatusCodes.OK).json({
        message: MESSAGE.get.empty,
        addresses: [],
      });
    }

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Get a specific address by ID
const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: MESSAGE.none });
    }

    const address = await Address.findOne({
      where: {
        address_id: id,
        user_id: user.user_id,
        is_active: true,
      },
    });

    if (!address) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.empty });
    }

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      address,
    });
  } catch (error) {
    console.error("Error fetching address:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.get.fail, error: error.message });
  }
};

// Update an address
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, type, address, city, postal_code, nearby, is_active } =
      req.body;

    const user = await User.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: MESSAGE.none });
    }

    // Find the address to update
    const addressToUpdate = await Address.findOne({
      where: {
        address_id: id,
        user_id: user.user_id,
      },
    });

    if (!addressToUpdate) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.empty });
    }

    // If changing to default status, update other addresses
    if (status === "default" && addressToUpdate.status !== "default") {
      await Address.update(
        { status: "history" },
        {
          where: {
            user_id: user.user_id,
            status: "default",
          },
        }
      );
    }

    // Update the address
    const updatedFields = {};
    if (status !== undefined) updatedFields.status = status;
    if (type !== undefined) updatedFields.type = type;
    if (address !== undefined) updatedFields.address = address;
    if (city !== undefined) updatedFields.city = city;
    if (postal_code !== undefined) updatedFields.postal_code = postal_code;
    if (nearby !== undefined) updatedFields.nearby = nearby;
    if (is_active !== undefined) updatedFields.is_active = is_active;

    await addressToUpdate.update(updatedFields);

    // If setting as default, update user's current_address_id
    if (status === "default") {
      await User.update(
        { current_address_id: id },
        { where: { user_id: user.user_id } }
      );
    }
    // If deactivating the current default address, clear user's current_address_id
    else if (is_active === false && user.current_address_id === parseInt(id)) {
      await User.update(
        { current_address_id: null },
        { where: { user_id: user.user_id } }
      );
    }

    res.status(StatusCodes.OK).json({
      message: MESSAGE.put.succ,
      address: await addressToUpdate.reload(),
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.put.fail, error: error.message });
  }
};

// Delete an address (soft delete)
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: MESSAGE.none });
    }

    const address = await Address.findOne({
      where: {
        address_id: id,
        user_id: user.user_id,
      },
    });

    if (!address) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.empty });
    }

    // Soft delete by setting is_active to false
    await address.update({ is_active: false });

    // If this was the user's current address, clear that reference
    if (user.current_address_id === parseInt(id)) {
      await User.update(
        { current_address_id: null },
        { where: { user_id: user.user_id } }
      );
    }

    res.status(StatusCodes.OK).json({
      message: MESSAGE.delete.succ,
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.delete.fail, error: error.message });
  }
};

// Set an address as default
const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: MESSAGE.none });
    }

    // Find the address to set as default
    const address = await Address.findOne({
      where: {
        address_id: id,
        user_id: user.user_id,
        is_active: true,
      },
    });

    if (!address) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.empty });
    }

    // Update all addresses to history status
    await Address.update(
      { status: "history" },
      {
        where: {
          user_id: user.user_id,
          status: "default",
        },
      }
    );

    // Set this address as default
    await address.update({ status: "default" });

    // Update user's current_address_id
    await User.update(
      { current_address_id: id },
      { where: { user_id: user.user_id } }
    );

    res.status(StatusCodes.OK).json({
      message: MESSAGE.put.succ,
      address: await address.reload(),
    });
  } catch (error) {
    console.error("Error setting default address:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGE.put.fail, error: error.message });
  }
};

export default {
  addAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
