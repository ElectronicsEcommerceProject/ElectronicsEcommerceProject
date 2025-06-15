import express from "express";
import { verifyJwtToken } from "../../../../../../middleware/jwt.middleware.js";
import { validator } from "../../../../../../middleware/validator/validator.middleware.js";
import { validators } from "../../../../validators/index.js";
import { userProductByIdDetailsController } from "../../../../controllers/index.js";
import { isAdmin } from "../../../../../../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/product/:product_id",
  // verifyJwtToken, // Temporarily disabled for testing
  // validator(validators.product.id, "params"),
  userProductByIdDetailsController.userProductByIdDetails
);

export default router;
