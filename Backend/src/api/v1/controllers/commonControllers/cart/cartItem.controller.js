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
      discount_type,
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
      existingItem.discount_type = discount_type;
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
      discount_type,
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
        {
          model: Product,
          as: "product",
          required: true,
        },
        {
          model: ProductVariant,
          as: "variant",
          required: false,
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

    // Get variant data for discount calculations
    const variantData = cartItem.variant || cartItem.product;
    const basePrice = parseFloat(cartItem.price_at_time);

    // Get discount thresholds from variant/product
    const regularDiscountQty = variantData?.discount_quantity || 0;
    const regularDiscountPercent = parseFloat(
      variantData?.discount_percentage || 0
    );
    const bulkDiscountQty = variantData?.bulk_discount_quantity || 0;
    const bulkDiscountPercent = parseFloat(
      variantData?.bulk_discount_percentage || 0
    );

    // Determine which discount applies (same logic as frontend)
    let discountValue = 0;
    let discountType = null;
    let discountQuantity = null;

    if (total_quantity >= bulkDiscountQty && bulkDiscountQty > 0) {
      discountValue = bulkDiscountPercent;
      discountType = "percentage";
      discountQuantity = bulkDiscountQty;
    } else if (total_quantity >= regularDiscountQty && regularDiscountQty > 0) {
      discountValue = regularDiscountPercent;
      discountType = "percentage";
      discountQuantity = regularDiscountQty;
    }

    // Update cart item with new discount values
    cartItem.discount_quantity = discountQuantity;
    cartItem.discount_applied = discountValue;
    cartItem.discount_type = discountType;

    // Calculate final price based on discount
    if (discountType === "percentage" && discountValue > 0) {
      const discountedPrice = basePrice * (1 - discountValue / 100);
      cartItem.final_price = discountedPrice * total_quantity;
    } else if (discountType === "fixed" && discountValue > 0) {
      cartItem.final_price = Math.max(
        0,
        basePrice * total_quantity - discountValue
      );
    } else {
      // No discount applied
      cartItem.final_price = basePrice * total_quantity;
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

// FindOrCreate cart item - dedicated method for BuyNowPage
const findOrCreateCartItem = async (req, res) => {
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
      discount_type,
    } = req.body;

    // Verify cart belongs to user
    const cart = await Cart.findOne({
      where: { cart_id, user_id },
    });

    if (!cart) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Cart not found or does not belong to user",
        success: false,
      });
    }

    // Verify product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product not found",
        success: false,
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
          success: false,
        });
      }
    }

    // Use Sequelize findOrCreate method
    const [cartItem, created] = await CartItem.findOrCreate({
      where: {
        cart_id,
        product_id,
        product_variant_id: product_variant_id || null,
      },
      defaults: {
        total_quantity,
        price_at_time,
        final_price,
        discount_quantity,
        discount_applied,
        discount_type,
      },
    });

    if (!created) {
      // Item already exists, update the quantity and other fields
      cartItem.total_quantity += total_quantity;
      cartItem.discount_quantity = discount_quantity;
      cartItem.price_at_time = price_at_time;
      cartItem.discount_applied = discount_applied;
      cartItem.discount_type = discount_type;
      cartItem.final_price = final_price;
      await cartItem.save();

      return res.status(StatusCodes.OK).json({
        message: "Item quantity updated in cart",
        success: true,
        data: cartItem,
        created: false,
      });
    }

    // New item was created
    res.status(StatusCodes.CREATED).json({
      message: "Item added to cart successfully",
      success: true,
      data: cartItem,
      created: true,
    });
  } catch (err) {
    console.error("❌ Error in findOrCreateCartItem:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to add item to cart",
      success: false,
      error: err.message,
    });
  }
};

export default {
  addItemToCart,
  updateCartItem,
  removeCartItem,
  getCartItems,
  findOrCreateCartItem,
};
