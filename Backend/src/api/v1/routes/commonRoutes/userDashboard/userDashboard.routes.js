import express from "express";
import { verifyJwtToken } from "../../../../../middleware/jwt.middleware.js";
import { validator } from "../../../../../middleware/index.js";
import { userDashboardController } from "../../../controllers/index.js";
import { isAdmin } from "../../../../../middleware/index.js";
const router = express.Router();

router.get(
  "/",
  verifyJwtToken,
  userDashboardController.getUserDashboardProducts
);

export default router;
