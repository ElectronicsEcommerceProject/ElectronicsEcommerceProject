import { StatusCodes } from "http-status-codes";
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
      items,
    } = req.body;

    // Verify user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
      });
    }

    // Verify address exists
    const address = await Address.findByPk(address_id);
    if (!address) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Address not found",
      });
    }

    // Generate unique order number
    const order_number = await generateOrderNumber();

    // Create order
    const order = await Order.create({
      user_id,
      address_id,
      payment_method,
      order_number,
      subtotal,
      shipping_cost: shipping_cost || 0,
      tax_amount: tax_amount || 0,
      discount_amount: discount_amount || 0,
      total_amount,
      notes,
      order_status: "pending",
      payment_status: "pending",
    });

    // Create order items if provided
    if (items && items.length > 0) {
      const orderItems = await Promise.all(
        items.map(async (item) => {
          // Verify product exists
          const product = await Product.findByPk(item.product_id);
          if (!product) {
            throw new Error(`Product with ID ${item.product_id} not found`);
          }

          // Verify product variant if provided
          if (item.product_variant_id) {
            const variant = await ProductVariant.findByPk(
              item.product_variant_id
            );
            if (!variant) {
              throw new Error(
                `Product variant with ID ${item.product_variant_id} not found`
              );
            }
          }

          return OrderItem.create({
            order_id: order.order_id,
            product_id: item.product_id,
            product_variant_id: item.product_variant_id || null,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount || 0,
            total: item.total,
          });
        })
      );

      order.dataValues.items = orderItems;
    }

    return res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      data: order,
    });
  } catch (err) {
    console.error("❌ Error in createOrder:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
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
          attributes: ["user_id", "name", "email"],
        },
        {
          model: Address,
          as: "address",
        },
        {
          model: OrderItem,
          as: "orderItems",
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
      message: MESSAGE.get.succ,
      data: orders,
    });
  } catch (err) {
    console.error("❌ Error in getAllOrders:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
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
          as: "orderItems",
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
        message: "Order not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: order,
    });
  } catch (err) {
    console.error("❌ Error in getOrderById:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Update order status
export const updateOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { order_status, payment_status, tracking_number, notes } = req.body;

    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Order not found",
      });
    }

    // Update order fields
    if (order_status) order.order_status = order_status;
    if (payment_status) order.payment_status = payment_status;
    if (tracking_number !== undefined) order.tracking_number = tracking_number;
    if (notes !== undefined) order.notes = notes;

    await order.save();

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.put.succ,
      data: order,
    });
  } catch (err) {
    console.error("❌ Error in updateOrder:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.put.fail,
      error: err.message,
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
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
        message: "Cannot cancel an order that has been shipped or delivered",
      });
    }

    // Update order status
    order.order_status = "cancelled";
    await order.save();

    return res.status(StatusCodes.OK).json({
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (err) {
    console.error("❌ Error in cancelOrder:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to cancel order",
      error: err.message,
    });
  }
};

export default {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  cancelOrder,
};
