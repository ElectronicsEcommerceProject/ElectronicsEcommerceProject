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
  "/:address_id",
  validator(validators.address.address_id, "params"), // Pass "params" as the property to validate
  verifyJwtToken,
  addressController.getAddressById
);
router.patch(
  "/:address_id",
  validator(validators.address.updateAddressValidator, null),
  verifyJwtToken,
  addressController.updateAddress
);
router.delete(
  "/:address_id",
  validator(validators.address.address_id, "params"), // Pass "params" as the property to validate
  verifyJwtToken,
  addressController.deleteAddress
);

// Set address as default
router.put(
  "/:address_id/default",
  validator(validators.address.address_id, "params"),
  verifyJwtToken,
  addressController.setDefaultAddress
);

export default router;
