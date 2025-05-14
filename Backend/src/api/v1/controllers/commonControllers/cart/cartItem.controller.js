import db from "../../../../../models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../../constants/message.js";

const { Cart, CartItem, Product, ProductVariant } = db;

// Add item to cart
const addItemToCart = async (req, res) => {
  try {
    const { user_id } = req.user; // From JWT token
    const {
      cart_id,
      product_id,
      product_variant_id,
      total_quantity,
      price_at_time,
      final_price,
      discount_quantity,
      discount_applied,
    } = req.body;

    // Verify cart belongs to user
    const cart = await Cart.findOne({
      where: { cart_id, user_id },
    });

    if (!cart) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Cart not found or does not belong to user",
      });
    }

    // Verify product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product not found",
      });
    }

    // Verify product variant if provided
    if (product_variant_id) {
      const variant = await ProductVariant.findOne({
        where: { product_variant_id, product_id },
      });
      if (!variant) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product variant not found or does not belong to product",
        });
      }
    }

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      where: {
        cart_id,
        product_id,
        product_variant_id: product_variant_id || null,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      existingItem.total_quantity += total_quantity;
      existingItem.discount_quantity = discount_quantity;
      existingItem.price_at_time = price_at_time;
      existingItem.discount_applied = discount_applied;
      existingItem.final_price = final_price;
      await existingItem.save();

      return res.status(StatusCodes.OK).json({
        message: "Item quantity updated in cart",
        data: existingItem,
      });
    }

    // Create new cart item
    const newCartItem = await CartItem.create({
      cart_id,
      product_id,
      product_variant_id,
      total_quantity,
      price_at_time,
      final_price,
      discount_quantity,
      discount_applied,
    });

    res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      data: newCartItem,
    });
  } catch (err) {
    console.error("❌ Error in addItemToCart:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.post.fail,
      error: err.message,
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { user_id } = req.user; // From JWT token
    const { cart_item_id } = req.params;
    const { total_quantity } = req.body;

    // Find cart item and verify it belongs to user's cart
    const cartItem = await CartItem.findOne({
      where: { cart_item_id },
      include: [
        {
          model: Cart,
          as: "cart",
          where: { user_id },
          required: true,
        },
      ],
    });

    if (!cartItem) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Cart item not found or does not belong to user",
      });
    }

    // Update quantity
    cartItem.total_quantity = total_quantity;

    // Recalculate final price if needed
    if (cartItem.discount_applied) {
      cartItem.final_price =
        cartItem.price_at_time * total_quantity - cartItem.discount_applied;
    } else {
      cartItem.final_price = cartItem.price_at_time * total_quantity;
    }

    await cartItem.save();

    res.status(StatusCodes.OK).json({
      message: MESSAGE.post.succ,
      data: cartItem,
    });
  } catch (err) {
    console.error("❌ Error in updateCartItem:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.put.fail,
      error: err.message,
    });
  }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
  try {
    const { user_id } = req.user; // From JWT token
    const { cart_item_id } = req.params;

    // Find cart item and verify it belongs to user's cart
    const cartItem = await CartItem.findOne({
      where: { cart_item_id },
      include: [
        {
          model: Cart,
          as: "cart",
          where: { user_id },
          required: true,
        },
      ],
    });

    if (!cartItem) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Cart item not found or does not belong to user",
      });
    }

    // Delete the cart item
    await cartItem.destroy();

    res.status(StatusCodes.OK).json({
      message: MESSAGE.delete.succ,
    });
  } catch (err) {
    console.error("❌ Error in removeCartItem:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.delete.fail,
      error: err.message,
    });
  }
};

// Get all items in user's cart
const getCartItems = async (req, res) => {
  try {
    const { user_id } = req.user; // From JWT token

    // Find user's cart
    const cart = await Cart.findOne({
      where: { user_id },
      include: [
        {
          model: CartItem,
          include: [
            {
              model: Product,
              as: "product",
            },
            {
              model: ProductVariant,
              as: "variant",
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Cart not found",
      });
    }

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: cart.CartItems,
    });
  } catch (err) {
    console.error("❌ Error in getCartItems:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

export default {
  addItemToCart,
  updateCartItem,
  removeCartItem,
  getCartItems,
};
