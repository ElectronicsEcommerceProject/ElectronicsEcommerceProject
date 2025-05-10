import express from "express";
import { wishListItemController } from "../../../controllers/index.js";
import { validators } from "../../../validators/index.js";
import { validator } from "../../../../../middleware/validator/validator.middleware.js";
import { verifyJwtToken } from "../../../../../middleware/jwt.middleware.js";
const router = express.Router();
// Route to add an item to the wishlist

router.post(
  "/",
  verifyJwtToken,
  validator(validators.wishListItem.createWishlistItemValidator, null),
  wishListItemController.addItemToWishlist
);

// Route to get all items in a wishlist
//
router.get(
  "/:wishlist_id",
  verifyJwtToken,
  validator(validators.wishList.wishListIdValidator, "params"),
  wishListItemController.getWishlistItems
);

// Route to remove an item from the wishlist
//
router.delete(
  "/:wish_list_item_id",
  verifyJwtToken,
  validator(validators.wishListItem.wishlistItemIdValidator, "params"),
  wishListItemController.removeWishlistItem
);

export default router;
