import { StatusCodes } from "http-status-codes";
import db from "../../../../../../models/index.js";
import MESSAGE from "../../../../../../constants/message.js";

const { ProductReview, Product, ProductVariant, User } = db;

// Create a new product review
export const createProductReview = async (req, res) => {
  try {
    const {
      product_id,
      product_variant_id,
      rating,
      title,
      review,
      is_verified_purchase,
    } = req.body;

    // Get user from token
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if product variant exists if provided
    if (product_variant_id) {
      const variant = await ProductVariant.findOne({
        where: {
          product_variant_id,
          product_id,
        },
      });

      if (!variant) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message:
            "Product variant not found or does not belong to the specified product",
        });
      }
    }

    // Check if user has already reviewed this product
    const existingReview = await ProductReview.findOne({
      where: {
        product_id,
        user_id: user.user_id,
      },
    });

    if (existingReview) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Create the review
    const newReview = await ProductReview.create({
      product_id,
      product_variant_id,
      user_id: user.user_id,
      rating,
      title,
      review,
      is_verified_purchase: is_verified_purchase || false,
      is_approved: false, // Default to false, admin needs to approve
      created_by: user.user_id,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: MESSAGE.post.succ,
      data: newReview,
    });
  } catch (err) {
    console.error("❌ Error creating product review:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.post.fail,
      error: err.message,
    });
  }
};

// Get all reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { approved_only = "true" } = req.query;

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }

    // Build query conditions
    const whereConditions = { product_id };

    // If approved_only is true, only return approved reviews
    if (approved_only === "true") {
      whereConditions.is_approved = true;
    }

    const reviews = await ProductReview.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: "reviewer",
          attributes: ["user_id", "name", "email"],
        },
        {
          model: ProductVariant,
          attributes: ["product_variant_id", "sku"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log("test", reviews);

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating =
      reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    // Count reviews by rating
    const ratingCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    reviews.forEach((review) => {
      ratingCounts[review.rating]++;
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: {
        reviews,
        stats: {
          total: reviews.length,
          averageRating,
          ratingCounts,
        },
      },
    });
  } catch (err) {
    console.error("❌ Error getting product reviews:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Get a specific review by ID
export const getReviewById = async (req, res) => {
  try {
    const { review_id } = req.params;

    const review = await ProductReview.findByPk(review_id, {
      include: [
        {
          model: User,
          as: "reviewer",
          attributes: ["user_id", "name", "email"],
        },
        {
          model: Product,
          attributes: ["product_id", "name", "slug"],
        },
        {
          model: ProductVariant,
          attributes: ["product_variant_id", "sku", "name"],
        },
      ],
    });

    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: review,
    });
  } catch (err) {
    console.error("❌ Error getting review by ID:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Update a review (only by the reviewer)
export const updateReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const { rating, title, review } = req.body;

    // Get user from token
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the review
    const reviewToUpdate = await ProductReview.findByPk(review_id);
    if (!reviewToUpdate) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if the user is the reviewer
    if (reviewToUpdate.user_id !== user.user_id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "You can only update your own reviews",
      });
    }

    // Update the review
    await reviewToUpdate.update({
      rating: rating || reviewToUpdate.rating,
      title: title !== undefined ? title : reviewToUpdate.title,
      review: review !== undefined ? review : reviewToUpdate.review,
      is_approved: false, // Reset approval status on update
      updated_by: user.user_id,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.put.succ,
      data: reviewToUpdate,
    });
  } catch (err) {
    console.error("❌ Error updating review:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.put.fail,
      error: err.message,
    });
  }
};

// Delete a review (only by the reviewer)
export const deleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;

    // Get user from token
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the review
    const reviewToDelete = await ProductReview.findByPk(review_id);
    if (!reviewToDelete) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if the user is the reviewer
    if (reviewToDelete.user_id !== user.user_id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "You can only delete your own reviews",
      });
    }

    // Delete the review
    await reviewToDelete.destroy();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.delete.succ,
    });
  } catch (err) {
    console.error("❌ Error deleting review:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.delete.fail,
      error: err.message,
    });
  }
};

// Get all reviews by a user
export const getUserReviews = async (req, res) => {
  try {
    // Get user from token
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    const reviews = await ProductReview.findAll({
      where: { user_id: user.user_id },
      include: [
        {
          model: Product,
          attributes: ["product_id", "name", "slug"],
        },
        {
          model: ProductVariant,
          attributes: ["product_variant_id", "sku", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: reviews,
    });
  } catch (err) {
    console.error("❌ Error getting user reviews:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// Approve a review (admin only)
export const approveReview = async (req, res) => {
  try {
    const { review_id } = req.params;

    // Verify admin user
    const admin = await User.findOne({
      where: { email: req.user.email, role: "admin" },
    });
    if (!admin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Unauthorized: Only admin can approve reviews",
      });
    }

    // Find the review
    const reviewToApprove = await ProductReview.findByPk(review_id);
    if (!reviewToApprove) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Review not found",
      });
    }

    // Approve the review
    await reviewToApprove.update({
      is_approved: true,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.put.succ,
      data: reviewToApprove,
    });
  } catch (err) {
    console.error("❌ Error approving review:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.put.fail,
      error: err.message,
    });
  }
};

export default {
  createProductReview,
  getProductReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getUserReviews,
  approveReview,
};
