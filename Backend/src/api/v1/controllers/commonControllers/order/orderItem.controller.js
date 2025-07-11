import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../../constants/message.js";
import db from "../../../../../models/index.js";

// Convert relative path to full URL for response
const convertToFullUrl = (imagePath, req) => {
  if (imagePath && !imagePath.startsWith("http")) {
    return `${req.protocol}://${req.get("host")}/${imagePath.replace(
      /\\/g,
      "/"
    )}`;
  }
  return imagePath || "";
};

const {
  OrderItem,
  Order,
  Product,
  ProductVariant,
  Cart,
  CartItem,
  ProductMedia,
  ProductMediaUrl,
} = db;

// Create a new order item
export const createOrderItem = async (req, res) => {
  try {
    const {
      order_id,
      product_id,
      product_variant_id,
      total_quantity,
      discount_quantity,
      price_at_time,
      discount_applied,
      final_price,
    } = req.body;

    // Verify order exists
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }

    // Verify product variant if provided
    if (product_variant_id) {
      const variant = await ProductVariant.findByPk(product_variant_id);
      if (!variant) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Product variant not found",
        });
      }
    }

    // Create order item
    const orderItem = await OrderItem.create({
      order_id,
      product_id,
      product_variant_id,
      total_quantity,
      discount_quantity,
      price_at_time,
      discount_applied,
      final_price,
    });

    // Delete all cart items for the user
    try {
      const user_id = order.user_id;
      const cart = await Cart.findOne({ where: { user_id } });
      if (cart) {
        await CartItem.destroy({ where: { cart_id: cart.cart_id } });
      }
    } catch (cartError) {
      console.error("Error deleting cart items:", cartError);
      // Continue with the response even if cart deletion fails
    }

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: MESSAGE.post.succ,
      data: orderItem,
    });
  } catch (err) {
    console.error("❌ Error in createOrderItem:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.post.fail,
      error: err.message,
    });
  }
};

// Get all items for an order
export const getOrderItemsByOrderId = async (req, res) => {
  try {
    const { order_id } = req.params;

    // Verify order exists
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Order not found",
      });
    }

    // Get order items
    const orderItems = await OrderItem.findAll({
      where: { order_id },
      include: [
        {
          model: Product,
          as: "product",
          include: [
            {
              model: ProductMedia,
              as: "media",
              attributes: ["product_media_id", "media_type"],
              include: [
                {
                  model: ProductMediaUrl,
                  attributes: ["product_media_url"],
                },
              ],
              limit: 1,
              required: false,
            },
          ],
        },
        {
          model: ProductVariant,
          as: "productVariant",
          include: [
            {
              model: ProductMedia,
              attributes: ["product_media_id", "media_type"],
              include: [
                {
                  model: ProductMediaUrl,
                  attributes: ["product_media_url"],
                },
              ],
              limit: 1,
              required: false,
            },
          ],
        },
      ],
    });

    // Transform order items to include full URLs
    const transformedOrderItems = orderItems.map((item) => {
      const product = item.product;
      const variant = item.productVariant;

      // Get main image - priority: variant base_variant_image_url > variant ProductMedia > product ProductMedia > default
      let mainImage = "/assets/shop.jpg"; // default fallback

      if (variant?.base_variant_image_url) {
        mainImage = convertToFullUrl(variant.base_variant_image_url, req);
      } else if (
        variant?.ProductMedia?.[0]?.ProductMediaURLs?.[0]?.product_media_url
      ) {
        mainImage = convertToFullUrl(
          variant.ProductMedia[0].ProductMediaURLs[0].product_media_url,
          req
        );
      } else if (
        product?.media?.[0]?.ProductMediaURLs?.[0]?.product_media_url
      ) {
        mainImage = convertToFullUrl(
          product.media[0].ProductMediaURLs[0].product_media_url,
          req
        );
      }

      return {
        ...item.toJSON(),
        product: {
          ...product.toJSON(),
          mainImage,
        },
        productVariant: variant
          ? {
              ...variant.toJSON(),
              base_variant_image_url: variant.base_variant_image_url
                ? convertToFullUrl(variant.base_variant_image_url, req)
                : mainImage,
            }
          : null,
      };
    });

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: transformedOrderItems,
    });
  } catch (err) {
    console.error("❌ Error in getOrderItems:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Get order item by ID
export const getOrderItemById = async (req, res) => {
  try {
    const { order_item_id } = req.params;

    const orderItem = await OrderItem.findByPk(order_item_id, {
      include: [
        {
          model: Product,
          as: "product",
          include: [
            {
              model: ProductMedia,
              as: "media",
              attributes: ["product_media_id", "media_type"],
              include: [
                {
                  model: ProductMediaUrl,
                  attributes: ["product_media_url"],
                },
              ],
              limit: 1,
              required: false,
            },
          ],
        },
        {
          model: ProductVariant,
          as: "productVariant",
          include: [
            {
              model: ProductMedia,
              attributes: ["product_media_id", "media_type"],
              include: [
                {
                  model: ProductMediaUrl,
                  attributes: ["product_media_url"],
                },
              ],
              limit: 1,
              required: false,
            },
          ],
        },
      ],
    });

    if (!orderItem) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Order item not found",
      });
    }

    // Transform order item to include full URLs
    const product = orderItem.product;
    const variant = orderItem.productVariant;

    // Get main image - priority: variant base_variant_image_url > variant ProductMedia > product ProductMedia > default
    let mainImage = "/assets/shop.jpg"; // default fallback

    if (variant?.base_variant_image_url) {
      mainImage = convertToFullUrl(variant.base_variant_image_url, req);
    } else if (
      variant?.ProductMedia?.[0]?.ProductMediaURLs?.[0]?.product_media_url
    ) {
      mainImage = convertToFullUrl(
        variant.ProductMedia[0].ProductMediaURLs[0].product_media_url,
        req
      );
    } else if (product?.media?.[0]?.ProductMediaURLs?.[0]?.product_media_url) {
      mainImage = convertToFullUrl(
        product.media[0].ProductMediaURLs[0].product_media_url,
        req
      );
    }

    const transformedOrderItem = {
      ...orderItem.toJSON(),
      product: {
        ...product.toJSON(),
        mainImage,
      },
      productVariant: variant
        ? {
            ...variant.toJSON(),
            base_variant_image_url: variant.base_variant_image_url
              ? convertToFullUrl(variant.base_variant_image_url, req)
              : mainImage,
          }
        : null,
    };

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: transformedOrderItem,
    });
  } catch (err) {
    console.error("❌ Error in getOrderItemById:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Update order item
export const updateOrderItem = async (req, res) => {
  try {
    const { order_item_id } = req.params;
    const { total_quantity, discount_quantity, discount_applied, final_price } =
      req.body;

    const orderItem = await OrderItem.findByPk(order_item_id);
    if (!orderItem) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Order item not found",
      });
    }

    // Update order item fields
    if (total_quantity !== undefined) orderItem.total_quantity = total_quantity;
    if (discount_quantity !== undefined)
      orderItem.discount_quantity = discount_quantity;
    if (discount_applied !== undefined)
      orderItem.discount_applied = discount_applied;
    if (final_price !== undefined) orderItem.final_price = final_price;

    await orderItem.save();

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.put.succ,
      data: orderItem,
    });
  } catch (err) {
    console.error("❌ Error in updateOrderItem:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.put.fail,
      error: err.message,
    });
  }
};

// Delete order item
export const deleteOrderItem = async (req, res) => {
  try {
    const { order_item_id } = req.params;

    const orderItem = await OrderItem.findByPk(order_item_id);
    if (!orderItem) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Order item not found",
      });
    }

    const order_id = orderItem.order_id;
    const itemFinalPrice = parseFloat(orderItem.final_price);

    // Delete the order item
    await orderItem.destroy();

    // Update order totals
    const order = await Order.findByPk(order_id);
    if (order) {
      const newTotalAmount = parseFloat(order.total_amount) - itemFinalPrice;
      const newSubtotal = parseFloat(order.subtotal) - itemFinalPrice;
      
      await order.update({
        total_amount: Math.max(0, newTotalAmount),
        subtotal: Math.max(0, newSubtotal)
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.delete.succ,
    });
  } catch (err) {
    console.error("❌ Error in deleteOrderItem:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.delete.fail,
      error: err.message,
    });
  }
};

export default {
  createOrderItem,
  getOrderItemsByOrderId,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem,
};
