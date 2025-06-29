import db from "../../../../../models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../../constants/message.js";

const { Address, User } = db;

// Add a new address for the authenticated user
const addAddress = async (req, res) => {
  try {
    const {
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      latitude,
      longitude,
      is_default,
      is_active,
    } = req.body;

    // Get user from JWT token
    const user = await User.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: MESSAGE.none 
      });
    }

    // If this is a default address, update any existing default addresses
    if (is_default) {
      await Address.update(
        { is_default: false },
        {
          where: {
            user_id: user.user_id,
            is_default: true,
          },
        }
      );
    }

    // Create new address
    const newAddress = await Address.create({
      user_id: user.user_id,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country: country || "India",
      latitude: latitude || null,
      longitude: longitude || null,
      is_default: is_default || false,
      is_active: is_active !== undefined ? is_active : true,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: MESSAGE.post.succ,
      address: newAddress,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        success: false, 
        message: MESSAGE.post.fail, 
        error: error.message 
      });
  }
};

// Get all addresses for the authenticated user
const getAddresses = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: MESSAGE.none 
      });
    }

    const addresses = await Address.findAll({
      where: {
        user_id: user.user_id,
        is_active: true,
      },
      order: [
        ["is_default", "DESC"], // Default addresses first
        ["updatedAt", "DESC"], // Most recently updated first
      ],
    });

    if (!addresses || addresses.length === 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: MESSAGE.get.empty,
        addresses: [],
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        success: false, 
        message: MESSAGE.get.fail, 
        error: error.message 
      });
  }
};

// Get a specific address by ID
const getAddressById = async (req, res) => {
  try {
    const { address_id } = req.params;
    const user = await User.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: MESSAGE.none 
      });
    }

    const address = await Address.findOne({
      where: {
        address_id,
        user_id: user.user_id,
        is_active: true,
      },
    });

    if (!address) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ 
          success: false, 
          message: MESSAGE.get.empty 
        });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      address,
    });
  } catch (error) {
    console.error("Error fetching address:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        success: false, 
        message: MESSAGE.get.fail, 
        error: error.message 
      });
  }
};

// Update an address
const updateAddress = async (req, res) => {
  try {
    const { address_id } = req.params;
    const {
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      latitude,
      longitude,
      is_default,
      is_active,
    } = req.body;

    const user = await User.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: MESSAGE.none 
      });
    }

    // Find the address to update
    const addressToUpdate = await Address.findOne({
      where: {
        address_id,
        user_id: user.user_id,
      },
    });

    if (!addressToUpdate) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ 
          success: false, 
          message: MESSAGE.get.empty 
        });
    }

    // If changing to default, update other addresses
    if (is_default && !addressToUpdate.is_default) {
      await Address.update(
        { is_default: false },
        {
          where: {
            user_id: user.user_id,
            is_default: true,
          },
        }
      );
    }

    // Update the address
    const updatedFields = {};
    if (address_line1 !== undefined)
      updatedFields.address_line1 = address_line1;
    if (address_line2 !== undefined)
      updatedFields.address_line2 = address_line2;
    if (city !== undefined) updatedFields.city = city;
    if (state !== undefined) updatedFields.state = state;
    if (postal_code !== undefined) updatedFields.postal_code = postal_code;
    if (country !== undefined) updatedFields.country = country;
    if (latitude !== undefined) updatedFields.latitude = latitude;
    if (longitude !== undefined) updatedFields.longitude = longitude;
    if (is_default !== undefined) updatedFields.is_default = is_default;
    if (is_active !== undefined) updatedFields.is_active = is_active;

    await addressToUpdate.update(updatedFields);

    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.put.succ,
      address: await addressToUpdate.reload(),
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        success: false, 
        message: MESSAGE.put.fail, 
        error: error.message 
      });
  }
};

// Delete an address (soft delete)
const deleteAddress = async (req, res) => {
  try {
    const { address_id } = req.params;

    const user = await User.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: MESSAGE.none 
      });
    }

    const address = await Address.findOne({
      where: {
        address_id,
        user_id: user.user_id,
      },
    });

    if (!address) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ 
          success: false, 
          message: MESSAGE.get.empty 
        });
    }

    // Soft delete by setting is_active to false
    await address.update({ is_active: false });

    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.delete.succ,
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        success: false, 
        message: MESSAGE.delete.fail, 
        error: error.message 
      });
  }
};

// Set an address as default
const setDefaultAddress = async (req, res) => {
  try {
    const { address_id } = req.params;

    const user = await User.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: MESSAGE.none 
      });
    }

    // Find the address to set as default
    const address = await Address.findOne({
      where: {
        address_id,
        user_id: user.user_id,
        is_active: true,
      },
    });

    if (!address) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ 
          success: false, 
          message: MESSAGE.get.empty 
        });
    }

    // Update all addresses to non-default
    await Address.update(
      { is_default: false },
      {
        where: {
          user_id: user.user_id,
          is_default: true,
        },
      }
    );

    // Set this address as default
    await address.update({ is_default: true });

    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.put.succ,
      address: await address.reload(),
    });
  } catch (error) {
    console.error("Error setting default address:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        success: false, 
        message: MESSAGE.put.fail, 
        error: error.message 
      });
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