import express from "express";

import { verifyJwtToken, isAdmin } from "../../../../middleware/index.js";

const router = express.Router();

// // 🧑‍💼 Admin: Get all orders (add below existing routes)
// router.get(
//   "/",
//   verifyJwtToken,
//   isAdmin,
//   adminOrderController.getAllOrdersForAdmin
// );

// // 🔍 Get single order by ID
// router.get("/:id", verifyJwtToken, adminOrderController.getOrderById);

// // ❌ Request order cancellation
// router.patch(
//   "/:id/cancel",
//   verifyJwtToken,
//   adminOrderController.requestOrderCancellation
// );

export default router;
