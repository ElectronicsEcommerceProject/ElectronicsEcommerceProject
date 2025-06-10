import db from "../../../../models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../constants/message.js";

const { User } = db;

// 👤 Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "user_id",
        "name",
        "email",
        "phone_number",
        "role",
        "createdAt",
      ],
    });

    if (!users || users.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: MESSAGE.get.empty,
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      users,
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// ❌ Delete user by ID (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: MESSAGE.none,
      });
    }

    await user.destroy();
    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.delete.succ,
    });
  } catch (error) {
    console.error("❌ Error deleting user:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.delete.fail,
      error: error.message,
    });
  }
};

//get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.findAll({
      where: { role: "customer" },
      attributes: ["user_id", "name", "email", "phone_number", "role"],
    });

    if (!customers || customers.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: MESSAGE.get.empty,
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      customers,
    });
  } catch (error) {
    console.error("❌ Error fetching customers:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

//get all retailers
const getAllRetailers = async (req, res) => {
  try {
    const retailers = await User.findAll({
      where: { role: "retailer" },
      attributes: ["user_id", "name", "email", "phone_number", "role"],
    });

    if (!retailers || retailers.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: MESSAGE.get.empty,
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      retailers,
    });
  } catch (error) {
    console.error("❌ Error fetching retailers:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

export default { deleteUser, getAllUsers, getAllCustomers, getAllRetailers };
