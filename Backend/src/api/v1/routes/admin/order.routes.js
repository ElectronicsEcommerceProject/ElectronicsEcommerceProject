import express from "express";

import { verifyJwtToken, isAdmin } from "../../../../middleware/index.js";
import { orderController } from "../../controllers/index.js";

const router = express.Router();

// 🧑‍💼 Admin: Get all orders (add below existing routes)
router.get("/", verifyJwtToken, isAdmin, orderController.getAllOrders);

// Place static/specific routes BEFORE dynamic ones
router.get(
  "/latest",
  verifyJwtToken,
  isAdmin,

  orderController.getLatestOrder
);

// 🔍 Get single order by ID
router.get("/:id", verifyJwtToken, orderController.getOrderById);

// 🔄 Update order by ID
router.patch(
  "/:order_id",
  verifyJwtToken,
  isAdmin,
  orderController.updateOrderById
);

// ❌ Request order cancellation
router.patch(
  "/:id/cancel",
  verifyJwtToken,
  isAdmin,
  orderController.cancelOrderById
);

export default router;
