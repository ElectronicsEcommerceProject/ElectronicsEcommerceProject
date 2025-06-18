import express from "express";
import { verifyJwtToken } from "../../../../middleware/jwt.middleware.js";

import { customerOrderController } from "../../controllers/index.js";

const router = express.Router();

// 📦 Place new order
router.post("/", verifyJwtToken, customerOrderController.findOrCreateOrder);

// 📄 Get all orders for logged-in user
router.get("/", verifyJwtToken, customerOrderController.getOrders);

// 🔍 Get single order by ID
router.get("/:id", verifyJwtToken, customerOrderController.getOrderById);

// ❌ Request order cancellation
router.patch(
  "/:id/cancel",
  verifyJwtToken,
  customerOrderController.requestOrderCancellation
);

export default router;
