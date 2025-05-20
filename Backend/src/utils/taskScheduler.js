import cron from "node-cron";
import { sendExpiringCouponNotifications } from "../services/notification/coupons/couponNotificationService.js";
import { sendLowStockNotifications } from "../services/notification/products/productNotificationService.js";

// Schedule a task to notify users about expiring coupons
cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Running daily coupon expiry notification task...");
  await sendExpiringCouponNotifications();
});

// Schedule a task to notify users about low stock products in their cart
cron.schedule("0 12 * * *", async () => {
  console.log("⏰ Running daily low stock notification task...");
  await sendLowStockNotifications();
});

console.log("✅ Task Scheduler initialized.");