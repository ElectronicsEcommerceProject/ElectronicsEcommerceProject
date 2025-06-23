import express from "express";
import {
  verifyJwtToken,
  adminRoleCheck,
  validator,
} from "../../../../middleware/index.js";
import { validators } from "../../validators/index.js";
import { adminDiscountRuleController } from "../../controllers/index.js";
const router = express.Router();
// Create a new discount rule
router.post(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.discountRule.discountRuleValidator, null),
  adminDiscountRuleController.createDiscountRule
);
// Get all discount rules
router.get(
  "/",
  verifyJwtToken,
  adminRoleCheck,
  adminDiscountRuleController.getAllDiscountRules
);
// Get discount rule by ID
router.get(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.discountRule.discountRuleIdValidator, "params"),
  adminDiscountRuleController.getDiscountRuleById
);
// Update discount rule
//
router.put(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.discountRule.discountRuleIdValidator, "params"),
  validator(validators.discountRule.discountRuleUpdateValidator, null),
  adminDiscountRuleController.updateDiscountRule
);
// Delete discount rule

router.delete(
  "/:id",
  verifyJwtToken,
  adminRoleCheck,
  validator(validators.discountRule.discountRuleIdValidator, "params"),
  adminDiscountRuleController.deleteDiscountRule
);

export default router;
