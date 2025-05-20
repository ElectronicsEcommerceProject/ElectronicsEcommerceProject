import { sendMail } from "../../config/nodemailer.js";
import db from "../../models/index.js";

const { Coupon, CouponUser, User, Notification } = db;

export const sendCouponNotification = async (user, coupon) => {
  try {
    // Create in-app notification
    await Notification.create({
      title: "New Coupon Available!",
      message: `Use coupon code ${coupon.code} to get ${coupon.discount}% off. Hurry, it expires on ${coupon.expiry_date}!`,
      type: "info",
      user_id: user.user_id,
    });

    // Send email notification
    const emailContent = `
      <h1>New Coupon Available!</h1>
      <p>Hi ${user.name},</p>
      <p>We have a special offer for you! Use coupon code <strong>${coupon.code}</strong> to get <strong>${coupon.discount}% off</strong>.</p>
      <p>Hurry, this offer expires on <strong>${coupon.expiry_date}</strong>.</p>
      <a href="/coupons" style="background-color: #FFD60A; padding: 10px 20px; color: black; text-decoration: none; border-radius: 5px;">View Coupons</a>
    `;
    await sendMail(user.email, `New Coupon: ${coupon.code}`, emailContent);
  } catch (error) {
    console.error("❌ Error in sendCouponNotification:", error);
  }
};

export const sendExpiringCouponNotifications = async () => {
  try {
    const expiringCoupons = await Coupon.findAll({
      where: {
        expiry_date: {
          $lte: new Date(new Date().setDate(new Date().getDate() + 3)), // Coupons expiring in 3 days
        },
      },
      include: [
        {
          model: CouponUser,
          include: [{ model: User }],
        },
      ],
    });

    for (const coupon of expiringCoupons) {
      for (const couponUser of coupon.CouponUsers) {
        const user = couponUser.User;

        // Create in-app notification
        await Notification.create({
          title: "Coupon Expiring Soon!",
          message: `Your coupon ${coupon.code} is expiring on ${coupon.expiry_date}. Use it before it's gone!`,
          type: "warning",
          user_id: user.user_id,
        });

        // Send email notification
        const emailContent = `
          <h1>Coupon Expiring Soon!</h1>
          <p>Hi ${user.name},</p>
          <p>Your coupon <strong>${coupon.code}</strong> is expiring on <strong>${coupon.expiry_date}</strong>. Use it before it's gone!</p>
          <a href="/coupons" style="background-color: #FFD60A; padding: 10px 20px; color: black; text-decoration: none; border-radius: 5px;">View Coupons</a>
        `;
        await sendMail(user.email, `Coupon Expiring Soon: ${coupon.code}`, emailContent);
      }
    }
  } catch (error) {
    console.error("❌ Error in sendExpiringCouponNotifications:", error);
  }
};