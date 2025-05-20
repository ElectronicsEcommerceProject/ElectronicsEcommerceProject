import { sendMail } from "../../config/nodemailer.js";
import db from "../../models/index.js";

const { Cart, Product, User, Notification } = db;

export const sendProductNotification = async (user, product, type) => {
  try {
    let title, message, emailContent;

    if (type === "lowStock") {
      title = "Hurry! Product Stock is Low";
      message = `The product ${product.name} in your cart is running low on stock. Order now before it's gone!`;
      emailContent = `
        <h1>Hurry! Product Stock is Low</h1>
        <p>Hi ${user.name},</p>
        <p>The product <strong>${product.name}</strong> in your cart is running low on stock. Order now before it's gone!</p>
        <a href="/products/${product.product_id}" style="background-color: #FFD60A; padding: 10px 20px; color: black; text-decoration: none; border-radius: 5px;">View Product</a>
      `;
    } else if (type === "cartReminder") {
      title = "Don't Miss Out!";
      message = `You have items in your cart waiting to be purchased. Complete your order now!`;
      emailContent = `
        <h1>Don't Miss Out!</h1>
        <p>Hi ${user.name},</p>
        <p>You have items in your cart waiting to be purchased. Complete your order now before they're gone!</p>
        <a href="/cart" style="background-color: #FFD60A; padding: 10px 20px; color: black; text-decoration: none; border-radius: 5px;">Go to Cart</a>
      `;
    }

    // Create in-app notification
    await Notification.create({
      title,
      message,
      type: "info",
      user_id: user.user_id,
    });

    // Send email notification
    await sendMail(user.email, title, emailContent);
  } catch (error) {
    console.error("❌ Error in sendProductNotification:", error);
  }
};




export const sendLowStockNotifications = async () => {
  
  try {
    const lowStockProducts = await Product.findAll({
      where: {
        stock: { $lte: 5 }, // Products with stock <= 5
      },
      include: [
        {
          model: Cart,
          include: [{ model: User }],
        },
      ],
    });

    for (const product of lowStockProducts) {
      for (const cart of product.Carts) {
        const user = cart.User;

        // Create in-app notification
        await Notification.create({
          title: "Hurry! Product Stock is Low",
          message: `The product ${product.name} in your cart is running low on stock. Order now before it's gone!`,
          type: "warning",
          user_id: user.user_id,
        });

        // Send email notification
        const emailContent = `
          <h1>Hurry! Product Stock is Low</h1>
          <p>Hi ${user.name},</p>
          <p>The product <strong>${product.name}</strong> in your cart is running low on stock. Order now before it's gone!</p>
          <a href="/products/${product.product_id}" style="background-color: #FFD60A; padding: 10px 20px; color: black; text-decoration: none; border-radius: 5px;">View Product</a>
        `;
        await sendMail(user.email, `Low Stock Alert: ${product.name}`, emailContent);
      }
    }
  } catch (error) {
    console.error("❌ Error in sendLowStockNotifications:", error);
  }
};