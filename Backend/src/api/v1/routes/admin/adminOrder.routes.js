import express from "express";

import { verifyJwtToken, isAdmin, validator } from "../../../../middleware/index.js";
import { orderController, orderItemController } from "../../controllers/index.js";
import { validators } from "../../validators/index.js";

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

// Order Items routes for admin
router.get(
  "/order/:order_id",
  verifyJwtToken,
  isAdmin,
  validator(validators.order.orderIdValidator, "params"),
  orderItemController.getOrderItemsByOrderId
);

router.delete(
  "/:order_item_id",
  verifyJwtToken,
  isAdmin,
  validator(validators.orderItem.orderItemIdValidator, "params"),
  orderItemController.deleteOrderItem
);

export default router;
