import express from "express";

import { verifyJwtToken, isAdmin } from "../../../../middleware/index.js";
import { orderController } from "../../controllers/index.js";

const router = express.Router();

router.post("/", verifyJwtToken, orderController.createOrder);

// 🧑‍💼 Admin: Get all orders (add below existing routes)
router.get("/", verifyJwtToken, isAdmin, orderController.getAllOrders);

// Place static/specific routes BEFORE dynamic ones
router.get(
  "/latest",
  verifyJwtToken,
  isAdmin,

  orderController.getLatestOrder
);

// get all orders by user ID
router.get("/:user_id", verifyJwtToken, orderController.getAllOrdersByUserId);

// 🔍 Get single order by ID
router.get("/:order_id", verifyJwtToken, orderController.getOrderById);

// 🔄 Update order by ID
router.patch(
  "/:order_id",
  verifyJwtToken,
  isAdmin,
  orderController.updateOrderById
);

// ❌ Request order cancellation
router.patch(
  "/cancel/:order_id/",
  verifyJwtToken,
  orderController.cancelOrderById
);

export default router;
