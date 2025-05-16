import express from "express";

import { verifyJwtToken, isAdmin } from "../../../../middleware/index.js";
import { orderController } from "../../controllers/index.js";

const router = express.Router();

// 🧑‍💼 Admin: Get all orders (add below existing routes)
router.get("/", verifyJwtToken, isAdmin, orderController.getAllOrders);

// 🔍 Get single order by ID
router.get("/:id", verifyJwtToken, orderController.getOrderById);

// ❌ Request order cancellation
router.patch(
  "/:id/cancel",
  verifyJwtToken,
  isAdmin,
  orderController.cancelOrderById
);

export default router;
