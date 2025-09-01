import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import MESSAGE from "../../../../../constants/message.js";
import db from "../../../../../models/index.js";
import { generateOrderNumber } from "../../../../../utils/orderUtils.js";

const { Order, OrderItem, User, Address, Product, ProductVariant, Payment } =
  db;

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const {
      user_id,
      address_id,
      payment_method,
      subtotal,
      shipping_cost,
      tax_amount,
      discount_amount,
      total_amount,
      notes,
      coupon_id,
    } = req.body;

    // Find or create user
    const [user] = await User.findOrCreate({
      where: { user_id },
    });

    // Find or create address
    const [address] = await Address.findOrCreate({
      where: { address_id },
    });

    // Generate unique order number
    const order_number = await generateOrderNumber();

    // Create order with all required fields from the model
    const order = await Order.create({
      user_id,
      address_id,
      payment_id: null,
      order_number,
      order_date: new Date(),
      order_status: "pending",
      payment_status: "pending",
      payment_method: payment_method || "cod",
      subtotal,
      shipping_cost: shipping_cost || 0,
      tax_amount: tax_amount || 0,
      discount_amount: discount_amount || 0,
      total_amount,
      notes: notes || "",
      tracking_number: null,
    });

    // If coupon_id is provided, create coupon redemption
    if (coupon_id) {
      try {
        await db.CouponRedemption.create({
          user_id,
          coupon_id,
          order_id: order.order_id,
          discount_amount: discount_amount || 0,
          redeemed_at: new Date(),
        });
      } catch (couponErr) {
        console.error("❌ Error creating coupon redemption:", couponErr);
        // Continue with order creation even if coupon redemption fails
      }
    }

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: MESSAGE.post.succ,
      data: {
        order,
      },
    });
  } catch (err) {
    console.error("❌ Error in createOrder:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.post.fail,
      error: err.message,
    });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "name", "email", "phone_number", "role"],
        },
        {
          model: Address,
          as: "address",
        },
        {
          model: OrderItem,
          as: "orderItem",
          include: [
            {
              model: Product,
              as: "product",
            },
            {
              model: ProductVariant,
              as: "productVariant",
            },
          ],
        },
        {
          model: Payment,
          as: "payment",
        },
      ],
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: orders,
    });
  } catch (err) {
    console.error("❌ Error in getAllOrders:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findByPk(order_id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "name", "email"],
        },
        {
          model: Address,
          as: "address",
        },
        {
          model: OrderItem,
          as: "orderItem",
          include: [
            {
              model: Product,
              as: "product",
            },
            {
              model: ProductVariant,
              as: "productVariant",
            },
          ],
        },
        {
          model: Payment,
          as: "payment",
        },
      ],
    });

    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: order,
    });
  } catch (err) {
    console.error("❌ Error in getOrderById:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Update order status
export const updateOrderById = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { order_status, payment_status, tracking_number, notes } = req.body;

    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Order not found",
      });
    }

    const previousStatus = order.order_status;

    // Validate return logic - only delivered orders can be returned
    if (order_status === "returned" && previousStatus !== "delivered") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Only delivered orders can be returned",
      });
    }

    // Update order fields
    if (order_status !== undefined) order.order_status = order_status;
    if (payment_status !== undefined) order.payment_status = payment_status;
    if (tracking_number !== undefined) order.tracking_number = tracking_number;
    if (notes !== undefined) order.notes = notes;

    // Update stock quantity when order status changes to delivered (except from cancelled)
    // Logic: Get all OrderItems for this order, then reduce ProductVariant stock by ordered quantity
    if (previousStatus !== "cancelled" && order_status === "delivered") {
      const orderItems = await OrderItem.findAll({
        where: { order_id },
        include: [
          {
            model: ProductVariant,
            as: "productVariant",
          },
        ],
      });

      // For each order item, reduce the stock quantity by the ordered quantity
      for (const item of orderItems) {
        if (item.product_variant_id && item.productVariant) {
          await ProductVariant.update(
            {
              stock_quantity:
                item.productVariant.stock_quantity - item.total_quantity,
            },
            {
              where: { product_variant_id: item.product_variant_id },
            }
          );
        }
      }
    }

    // Increase stock quantity when order status changes to returned (from delivered)
    if (previousStatus === "delivered" && order_status === "returned") {
      const orderItems = await OrderItem.findAll({
        where: { order_id },
        include: [
          {
            model: ProductVariant,
            as: "productVariant",
          },
        ],
      });

      // For each order item, increase the stock quantity by the ordered quantity
      for (const item of orderItems) {
        if (item.product_variant_id && item.productVariant) {
          await ProductVariant.update(
            {
              stock_quantity:
                item.productVariant.stock_quantity + item.total_quantity,
            },
            {
              where: { product_variant_id: item.product_variant_id },
            }
          );
        }
      }
    }

    await order.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.put.succ,
      data: order,
    });
  } catch (err) {
    console.error("❌ Error in updateOrder:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.put.fail,
      error: err.message,
    });
  }
};

// Cancel order
export const cancelOrderById = async (req, res) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Order not found",
      });
    }

    // Check if order can be cancelled
    if (["shipped", "delivered"].includes(order.order_status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Cannot cancel an order that has been shipped or delivered",
      });
    }

    // Update order status
    order.order_status = "cancelled";
    await order.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (err) {
    console.error("❌ Error in cancelOrderById:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to cancel order",
      error: err.message,
    });
  }
};

//latest order
export const getLatestOrder = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });

    // Calculate date from 2 days ago
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const order = await Order.findAll({
      where: {
        order_date: {
          [Op.gte]: twoDaysAgo,
        },
      },
      order: [["order_date", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "name", "role"],
        },
      ],
    });

    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No orders found in the last 2 days",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: order,
    });
  } catch (error) {
    console.error("❌ Error fetching recent orders:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// 📋 Get all orders by user ID
const getAllOrdersByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User ID is required",
      });
    }
    const user = await User.findOne({ where: { user_id } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    const orders = await Order.findAll({
      where: { user_id },
      order: [["createdAt", "DESC"]],
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: orders,
    });
  } catch (error) {
    console.error("❌ Error fetching orders by user ID:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

export default {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  cancelOrderById,
  getLatestOrder,
  getAllOrdersByUserId,
};
