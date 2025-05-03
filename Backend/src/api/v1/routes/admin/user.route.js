import express from "express";

import { verifyJwtToken, isAdmin } from "../../../../middleware/index.js";
import { adminUserController } from "../../controllers/index.js";

const router = express.Router();

// 🧑‍💼 Admin-only routes
router.get("/", verifyJwtToken, isAdmin, adminUserController.getAllUsers);
router.delete("/:id", verifyJwtToken, adminUserController.deleteUser);

export default router;
