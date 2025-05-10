import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../../constants/message.js";
import db from "../../../../../models/index.js";

const { WishListItem, Product, ProductVariant } = db;

// Add item to wishlist
export const addItemToWishlist = async (req, res) => {
  try {
    const { wishlist_id, product_id, product_variant_id } = req.body;

    // Check if item already exists in wishlist
    const existingItem = await WishListItem.findOne({
      where: {
        wishlist_id,
        product_id,
        product_variant_id: product_variant_id || null,
      },
    });

    if (existingItem) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Item already exists in wishlist",
      });
    }

    // Create new wishlist item
    const wishlistItem = await WishListItem.create({
      wishlist_id,
      product_id,
      product_variant_id,
    });

    return res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      data: wishlistItem,
    });
  } catch (err) {
    console.error("❌ Error in addItemToWishlist:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.post.fail,
      error: err.message,
    });
  }
};

// Get all items in a wishlist
export const getWishlistItems = async (req, res) => {
  try {
    const { wishlist_id } = req.params;

    const wishlistItems = await WishListItem.findAll({
      where: { wishlist_id },
      include: [
        {
          model: Product,
          as: "product",
        },
        {
          model: ProductVariant,
          as: "productVariant",
        },
      ],
    });

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: wishlistItems,
    });
  } catch (err) {
    console.error("❌ Error in getWishlistItems:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Remove item from wishlist
export const removeWishlistItem = async (req, res) => {
  try {
    const { wish_list_item_id } = req.params;

    const wishlistItem = await WishListItem.findByPk(wish_list_item_id);
    if (!wishlistItem) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Wishlist item not found",
      });
    }

    await wishlistItem.destroy();

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.delete.succ,
    });
  } catch (err) {
    console.error("❌ Error in removeWishlistItem:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.delete.fail,
      error: err.message,
    });
  }
};

export default {
  addItemToWishlist,
  getWishlistItems,
  removeWishlistItem,
};
