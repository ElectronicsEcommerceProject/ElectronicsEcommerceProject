import express from "express";
import {
  isAdmin,
  validator,
  verifyJwtToken,
} from "../../../../../middleware/index.js";
import { validators } from "../../../validators/index.js";
import { orderController } from "../../../controllers/index.js";

const router = express.Router();

// Get all orders
router.get("/", verifyJwtToken, isAdmin, orderController.getAllOrders);

// Get order by ID
router.get(
  "/:order_id",
  verifyJwtToken,
  validator(validators.order.orderIdValidator, "params"),
  orderController.getOrderById
);

// Update order
router.put(
  "/:order_id",
  verifyJwtToken,
  validator(validators.order.orderIdValidator, "params"),
  validator(validators.order.updateOrderValidator, null),
  orderController.updateOrder
);

// Cancel order
router.patch(
  "/:order_id/cancel",
  verifyJwtToken,
  validator(validators.order.orderIdValidator, "params"),
  orderController.cancelOrderById // This function is undefined
);

export default router;
