import db from "../../../../../models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../../constants/message.js";

const { Wishlist } = db;

// Create a new wishlist
export const createWishlist = async (req, res) => {
  try {
    const { user_id } = req.body;

    const wishlist = await Wishlist.create({ user_id });
    return res
      .status(StatusCodes.CREATED)
      .json({ message: MESSAGE.post.succ, wishlist });
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: MESSAGE.post.fail });
  }
};

// Remove an item from the wishlist
export const removeWishList = async (req, res) => {
  try {
    const { wishlist_id } = req.params;

    const wishlist = await Wishlist.findByPk(wishlist_id);
    if (!wishlist) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Wishlist not found" });
    }

    await wishlist.destroy();

    return res.status(StatusCodes.OK).json({ message: MESSAGE.delete.succ });
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: MESSAGE.delete.fail });
  }
};

export default {
  createWishlist,
  removeWishList,
};
