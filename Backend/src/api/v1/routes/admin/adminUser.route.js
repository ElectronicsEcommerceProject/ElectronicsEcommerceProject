import express from "express";

import { verifyJwtToken, isAdmin } from "../../../../middleware/index.js";
import { adminUserController } from "../../controllers/index.js";

const router = express.Router();

// 🧑‍💼 Admin-only routes
router.get("/", verifyJwtToken, isAdmin, adminUserController.getAllUsers);
router.delete("/:id", verifyJwtToken, isAdmin, adminUserController.deleteUser);

//get only customer, retailer
router.get(
  "/all-Customers",
  verifyJwtToken,
  isAdmin,
  adminUserController.getAllCustomers
);
router.get(
  "/all-Retailers",
  verifyJwtToken,
  isAdmin,
  adminUserController.getAllRetailers
);

export default router;
