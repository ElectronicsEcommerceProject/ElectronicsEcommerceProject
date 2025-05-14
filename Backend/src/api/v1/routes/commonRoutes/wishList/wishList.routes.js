import express from "express";
import { wishListController } from "../../../controllers/index.js";

import { validators } from "../../../validators/index.js";
import { validator } from "../../../../../middleware/validator/validator.middleware.js";

const router = express.Router();

// Route to create a wishlist
router.post(
  "/",
  validator(validators.wishList.createWishlist, null),
  wishListController.createWishlist
);

// Route to remove an item from the wishlist
router.delete(
  "/:wishlist_id",
  validator(validators.wishList.wishListIdValidator, "params"),
  wishListController.removeWishList
);

export default router;
