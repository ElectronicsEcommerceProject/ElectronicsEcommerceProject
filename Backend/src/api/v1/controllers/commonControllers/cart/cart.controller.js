import db from "../../../../../models/index.js"; // Import the database models
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../../constants/message.js";

const { Cart, User, CartItem, Product } = db;

// Get all carts (admin only)
const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: carts,
    });
  } catch (err) {
    console.error("❌ Error in getAllCarts:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Get cart by ID with items (admin only)
const getCartById = async (req, res) => {
  try {
    const { cart_id } = req.params;

    const cart = await Cart.findByPk(cart_id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "name", "email"],
        },
        {
          model: CartItem,
          include: [{ model: Product }],
        },
      ],
    });

    if (!cart) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.none,
      });
    }

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: cart,
    });
  } catch (err) {
    console.error("❌ Error in getCartById:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Get cart by user ID (admin only)
const getCartByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Verify user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.none,
      });
    }

    const cart = await Cart.findOne({
      where: { user_id },
      include: [
        {
          model: CartItem,
          as: "cartItem",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!cart) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.none,
      });
    }

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: cart,
    });
  } catch (err) {
    console.error("❌ Error in getCartByUserId:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Delete a cart (admin only)
const deleteCart = async (req, res) => {
  try {
    const { cart_id } = req.params;

    const cart = await Cart.findByPk(cart_id);
    if (!cart) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.none,
      });
    }

    // First delete all cart items associated with this cart
    await CartItem.destroy({ where: { cart_id } });

    // Then delete the cart itself
    await cart.destroy();

    res.status(StatusCodes.OK).json({
      message: MESSAGE.delete.succ,
    });
  } catch (err) {
    console.error("❌ Error in deleteCart:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.delete.fail,
      error: err.message,
    });
  }
};

// Create a cart (admin only - for testing purposes)
const createCart = async (req, res) => {
  try {
    const { user_id } = req.body;

    // Verify user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.none,
      });
    }

    // Check if cart already exists for this user
    const existingCart = await Cart.findOne({ where: { user_id } });
    if (existingCart) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: MESSAGE.post.fail,
      });
    }

    const newCart = await Cart.create({
      user_id,
    });

    res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      data: newCart,
    });
  } catch (err) {
    console.error("❌ Error in createCart:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.post.fail,
      error: err.message,
    });
  }
};

// Find or create cart by user_id
const findOrCreateCartByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Verify user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.none,
      });
    }

    // Find or create cart for the user
    const [cart, created] = await Cart.findOrCreate({
      where: { user_id },
      defaults: { user_id },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: created ? MESSAGE.post.succ : MESSAGE.get.succ,
      cart_id: cart.cart_id,
      created: created,
    });
  } catch (err) {
    console.error("❌ Error in findOrCreateCartByUserId:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

export default {
  getAllCarts,
  getCartById,
  getCartByUserId,
  deleteCart,
  createCart,
  findOrCreateCartByUserId,
};
