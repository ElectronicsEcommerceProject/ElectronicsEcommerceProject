import express from "express";

import { validator, verifyJwtToken } from "../../../../../middleware/index.js";
import { validators } from "../../../validators/index.js";
import { addressController } from "../../../controllers/index.js";

const router = express.Router();

router.post(
  "/",
  verifyJwtToken,
  validator(validators.address.addressValidator, null),
  addressController.addAddress
);

router.get("/", verifyJwtToken, addressController.getAddresses);
router.get(
  "/:id",
  validator(validators.address.id, "params"), // Pass "params" as the property to validate
  verifyJwtToken,
  addressController.getAddressById
);
router.put(
  "/:id",
  validator(validators.address.updateAddressValidator, null),
  validator(validators.address.id, "params"), // Add params validation
  verifyJwtToken,
  addressController.updateAddress
);
router.delete(
  "/:id",
  validator(validators.address.id, "params"), // Pass "params" as the property to validate
  verifyJwtToken,
  addressController.deleteAddress
);

export default router;
