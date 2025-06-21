import express from "express";
import { orderItemController } from "../../../controllers/index.js";
import { validator, verifyJwtToken } from "../../../../../middleware/index.js";
import { validators } from "../../../validators/index.js";

const router = express.Router();

// Create a new order item
router.post(
  "/",
  verifyJwtToken,
  validator(validators.orderItem.createOrderItemValidator, null),
  orderItemController.createOrderItem
);

// Get all items for an order
router.get(
  "/order/:order_id",
  verifyJwtToken,
  validator(validators.order.orderIdValidator, "params"),
  orderItemController.getOrderItemsByOrderId
);

// Get order item by ID
router.get(
  "/:order_item_id",
  verifyJwtToken,
  validator(validators.orderItem.orderItemIdValidator, "params"),
  orderItemController.getOrderItemById
);

// Update order item
router.put(
  "/:order_item_id",
  verifyJwtToken,
  validator(validators.orderItem.orderItemIdValidator, "params"),
  validator(validators.orderItem.updateOrderItemValidator, null),
  orderItemController.updateOrderItem
);

// Delete order item
router.delete(
  "/:order_item_id",
  verifyJwtToken,
  validator(validators.orderItem.orderItemIdValidator, "params"),
  orderItemController.deleteOrderItem
);

export default router;
