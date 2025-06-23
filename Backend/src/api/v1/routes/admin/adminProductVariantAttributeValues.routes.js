import express from "express";
import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import { adminVariantAttributeValueController } from "../../controllers/index.js";

const router = express.Router();

// Create a new variant attribute value mapping
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(
    validators.productVariantAttributeValues.variantAttributeValueValidator,
    null
  ),
  adminVariantAttributeValueController.createVariantAttributeValue
);

// Get all variant attribute value mappings
router.get(
  "/",
  verifyJwtToken,
  adminVariantAttributeValueController.getAllVariantAttributeValues
);

// Get variant attribute value mapping by ID
router.get(
  "/:id",
  verifyJwtToken,
  validator(validators.productVariantAttributeValues.id, "params"),
  adminVariantAttributeValueController.getVariantAttributeValueById
);

// Get attribute values by variant ID
router.get(
  "/variant/:variantId",
  verifyJwtToken,
  validator(validators.productVariantAttributeValues.variantIdSchema, "params"),
  adminVariantAttributeValueController.getAttributeValuesByVariant
);

// Get variants by attribute value ID
router.get(
  "/attribute-value/:attributeValueId",
  verifyJwtToken,
  adminVariantAttributeValueController.getVariantsByAttributeValue
);

// Update a variant attribute value mapping
router.put(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productVariantAttributeValues.id, "params"),
  validator(
    validators.productVariantAttributeValues
      .variantAttributeValueUpdateValidator,
    null
  ),
  adminVariantAttributeValueController.updateVariantAttributeValue
);

// Delete a variant attribute value mapping
router.delete(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.productVariantAttributeValues.id, "params"),
  adminVariantAttributeValueController.deleteVariantAttributeValue
);

export default router;
