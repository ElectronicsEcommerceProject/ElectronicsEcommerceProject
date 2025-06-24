import express from "express";
import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import { adminAttributeController } from "../../controllers/index.js";
const router = express.Router();
// Add a new attribute
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.attribute.attributeValidator, null),
  adminAttributeController.addAttribute
);

// Get all attributes
router.get("/", verifyJwtToken, adminAttributeController.getAllAttributes);

// Get attributes by product type

router.put(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.attribute.id, "params"),
  validator(validators.attribute.attributeUpdateValidator, null),
  adminAttributeController.updateAttribute
);
// Delete an attribute
router.delete(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.attribute.id, "params"),
  adminAttributeController.deleteAttribute
);

export default router;
