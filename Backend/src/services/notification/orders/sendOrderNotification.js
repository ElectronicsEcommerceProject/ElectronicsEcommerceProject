import { sendMail } from "../../config/nodemailer.js";
import db from "../../models/index.js";

const { Notification } = db;

export const sendOrderNotification = async (user, order, status) => {
  try {
    // Create in-app notification
    await Notification.create({
      title: "Order Update",
      message: `Your order #${order.order_number} is now ${status}.`,
      type: "info",
      user_id: user.user_id,
    });

    // Send email notification
    const emailContent = `
      <h1>Order Update</h1>
      <p>Hi ${user.name},</p>
      <p>Your order <strong>#${order.order_number}</strong> is now <strong>${status}</strong>.</p>
      <p>Track your order <a href="/orders/${order.order_id}">here</a>.</p>
    `;
    await sendMail(user.email, `Order #${order.order_number} - ${status}`, emailContent);
  } catch (error) {
    console.error("❌ Error in sendOrderNotification:", error);
  }
};