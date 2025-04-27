import db from '../models/index.js';
const { Order, OrderItem, Cart, Product, User } = db;

// 📦 Place Order
const createOrder = async (req, res) => {
  const userEmail = req.user.email;

  try {
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const cartItems = await Cart.findAll({
      where: { user_id: user.user_id },
      include: [{ model: Product }],
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of cartItems) {
      const product = cartItem.Product;
      if (!product) continue;

      let quantity = cartItem.quantity;
      let price = product.price;
      let discount = 0;

      // Retailer logic
      if (user.role === 'retailer') {
        if (quantity < product.min_retailer_quantity) {
          return res.status(400).json({
            message: `Retailers must order at least ${product.min_retailer_quantity} units of "${product.name}"`,
          });
        }

        if (
          product.bulk_discount_quantity &&
          product.bulk_discount_percentage &&
          quantity >= product.bulk_discount_quantity
        ) {
          discount = (price * product.bulk_discount_percentage) / 100;
          price -= discount;
        }
      }

      const itemTotal = quantity * price;
      totalAmount += itemTotal;

      orderItems.push({
        product_id: product.product_id,
        quantity,
        price_at_time: product.price,
        discount_applied: discount,
      });
    }

    const newOrder = await Order.create({
      user_id: user.user_id,
      total_amount: totalAmount,
      status: 'pending',
      address: req.body.address,
      mobile_number: req.body.mobile_number,
    });

    for (const item of orderItems) {
      await OrderItem.create({
        order_id: newOrder.order_id,
        ...item,
      });
    }

    await Cart.destroy({ where: { user_id: user.user_id } });

    res.status(201).json({
      message: 'Order placed successfully',
      order: newOrder,
      items: orderItems,
    });
  } catch (error) {
    console.error('❌ Error placing order:', error);
    res.status(500).json({ message: 'Something went wrong while placing order' });
  }
};

// 📄 Get All Orders
const getOrders = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const orders = await Order.findAll({
      where: { user_id: user.user_id },
      include: [{ model: OrderItem, include: [Product] }],
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// 🔍 Get Single Order by ID
const getOrderById = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const order = await Order.findOne({
      where: { order_id: req.params.id, user_id: user.user_id },
      include: [{ model: OrderItem, include: [Product] }],
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json(order);
  } catch (error) {
    console.error('❌ Error fetching order by ID:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// ❌ Request Cancel
const requestOrderCancellation = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const order = await Order.findOne({
      where: { order_id: req.params.id, user_id: user.user_id },
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    order.status = 'cancel_requested';
    await order.save();

    res.status(200).json({ message: 'Order cancellation requested', order });
  } catch (error) {
    console.error('❌ Error requesting cancellation:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// 📋 Admin: View all orders from all users
const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ['name', 'email', 'role'] },
        { model: OrderItem, include: [Product] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Error fetching all orders:", err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export default {
  createOrder,
  getOrders,
  getOrderById,
  requestOrderCancellation,
  getAllOrdersForAdmin
}