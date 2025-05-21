import express from "express";
import {
  verifyJwtToken,
  validator,
  isAdmin,
} from "../../../../middleware/index.js";
// import { validators } from "../../validators/index.js";
import { adminProductManagmentDashboardDataController } from "../../controllers/index.js";

const router = express.Router();

router.get(
  "/",
  verifyJwtToken,
  adminProductManagmentDashboardDataController.getProductManagementData
);

export default router;
