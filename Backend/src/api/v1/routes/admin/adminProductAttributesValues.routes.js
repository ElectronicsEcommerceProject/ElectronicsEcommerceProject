import express from "express";
import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import { adminAttributeValueController } from "../../controllers/index.js";

const router = express.Router();

// Add a new attribute value
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.attributeValue.attributeValueValidator, null),
  adminAttributeValueController.addAttributeValue
);

// Get all attribute values
router.get(
  "/",
  verifyJwtToken,
  adminAttributeValueController.getAllAttributeValues
);

// Get attribute value by ID
router.get(
  "/:id",
  verifyJwtToken,
  validator(validators.attributeValue.id, "params"),
  adminAttributeValueController.getAttributeValueById
);

// Get attribute values by attribute ID
router.get(
  "/attribute/:attributeId",
  verifyJwtToken,
  adminAttributeValueController.getAttributeValuesByAttribute
);

// Update an attribute value
router.put(
  "/:id",

  verifyJwtToken,
  adminRoleCheck,

  validator(validators.attributeValue.id, "params"),

  validator(validators.attributeValue.attributeValueUpdateValidator, null),

  adminAttributeValueController.updateAttributeValue
);

// Delete an attribute value
router.delete(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.attributeValue.id, "params"),
  adminAttributeValueController.deleteAttributeValue
);

export default router;
