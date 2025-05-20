import { mailSender } from "../../../utils/email.js"
import  welcomeEmail  from "../../../mails/welcomeEmail.js";
import db from "../../../models/index.js";

const { Notification } = db;

export const sendWelcomeNotification = async (user) => {
  try {
    // Create in-app notification
    await Notification.create({
      title: "Welcome to Our Store!",
      message: `Hi ${user.name}, welcome to our store! Start exploring amazing products now.`,
      type: "info",
      user_id: user.user_id,
    });

    // Send welcome email
    const emailContent = welcomeEmail(user.name, user.userType);
    await mailSender(user.email, "Welcome to Our Store!", emailContent);
  } catch (error) {
    console.error("❌ Error in sendWelcomeNotification:", error);
  }
};