import { Worker } from "bullmq";
import { sendWelcomeNotification } from "../services/notificationService.js";
import IORedis from "ioredis";
import { sendOrderNotification } from "./orders/sendOrderNotification.js";

const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
});

const notificationWorker = new Worker(
  "notificationQueue",
  async (job) => {
    const { type, data } = job;

    if (type === "welcomeNotification") {
      await sendWelcomeNotification(data.user);
    }
    else if (type === "orderNotification") {
        await sendOrderNotification(data.user, data.order, data.status);
      }

    // Add more job types here as needed
  },
  { connection }
);

notificationWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed successfully.`);
});

notificationWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err);
});