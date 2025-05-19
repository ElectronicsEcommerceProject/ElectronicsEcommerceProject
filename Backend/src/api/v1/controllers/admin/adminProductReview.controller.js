import { StatusCodes } from "http-status-codes";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";

const {
  ProductReview,
  Product,
  ProductVariant,
  User,
  ProductMedia,
  ProductMediaUrl,
} = db;

/**
 * Get all product reviews with filtering and pagination
 */
export const getAllProductReviews = async (req, res) => {
  try {
    const {
      status,
      rating,
      product_id,
      user_id,
      page = 1,
      limit = 10,
      sort_by = "createdAt",
      sort_order = "DESC",
    } = req.query;

    // Build query conditions
    const whereConditions = {};

    if (status) whereConditions.review_action = status;
    if (rating) whereConditions.rating = rating;
    if (product_id) whereConditions.product_id = product_id;
    if (user_id) whereConditions.user_id = user_id;

    // Calculate pagination
    const offset = (page - 1) * limit;

    // Get reviews with pagination
    const { count, rows: reviews } = await ProductReview.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Product,
          attributes: ["product_id", "name", "slug"],
        },
        {
          model: User,
          as: "reviewer",
          attributes: ["user_id", "name", "email"],
        },
      ],
      order: [[sort_by, sort_order]],
      limit: parseInt(limit),
      offset: offset,
    });

    // Format the response
    const formattedReviews = await Promise.all(
      reviews.map(async (review) => {
        const plainReview = review.get({ plain: true });

        // Fetch product media separately
        let imageUrl = null;
        let mediaId = null;

        if (plainReview.Product?.product_id) {
          try {
            // First, find the product media
            const productMedia = await ProductMedia.findOne({
              where: { product_id: plainReview.Product.product_id },
            });

            if (productMedia) {
              mediaId = productMedia.product_media_id;
              // console.log("mediaId", mediaId);

              // Then, find the media URL
              const mediaUrl = await ProductMediaUrl.findOne({
                where: { product_media_id: productMedia.product_media_id },
              });

              if (mediaUrl) {
                imageUrl = mediaUrl.product_media_url;
              }
            }
          } catch (error) {
            console.error("Error fetching product media:", error);
          }
        }

        return {
          product_review_id: plainReview.product_review_id,
          product: {
            product_id: plainReview.Product?.product_id,
            name: plainReview.Product?.name,
            image: {
              product_media_id: mediaId,
              url: imageUrl,
            },
          },
          reviewer: {
            user_id: plainReview.reviewer?.user_id,
            name: plainReview.reviewer?.name,
            email: plainReview.reviewer?.email,
          },
          rating: plainReview.rating,
          date: plainReview.createdAt,
          status: plainReview.review_action,
          title: plainReview.title,
          review: plainReview.review,
        };
      })
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: {
        reviews: formattedReviews,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
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

// Get all reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { product_id } = req.params;

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

/**
 * Get a specific review by ID
 */
export const getReviewById = async (req, res) => {
  try {
    const { review_id } = req.params;

    const review = await ProductReview.findByPk(review_id, {
      include: [
        {
          model: Product,
          attributes: ["product_id", "name", "slug"],
        },
        {
          model: User,
          as: "reviewer",
          attributes: ["user_id", "name", "email"],
        },
        {
          model: ProductVariant,
          attributes: ["product_variant_id", "sku", "name"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
        {
          model: User,
          as: "updater",
          attributes: ["user_id", "name", "email"],
        },
      ],
    });

    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Review not found",
      });
    }

    // Get product media separately
    let imageUrl = null;
    let mediaId = null;

    if (review.product_id) {
      try {
        // First, find the product media
        const productMedia = await ProductMedia.findOne({
          where: { product_id: review.product_id },
        });

        if (productMedia) {
          mediaId = productMedia.product_media_id;

          // Then, find the media URL
          const mediaUrl = await ProductMediaUrl.findOne({
            where: { product_media_id: productMedia.product_media_id },
          });

          if (mediaUrl) {
            imageUrl = mediaUrl.product_media_url;
          }
        }
      } catch (error) {
        console.error("Error fetching product media:", error);
      }
    }

    const reviewData = review.get({ plain: true });
    reviewData.Product = {
      ...reviewData.Product,
      image: {
        id: mediaId,
        url: imageUrl,
      },
    };

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: reviewData,
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

/**
 * Change review status (approve, reject, flag)
 */
export const changeReviewStatus = async (req, res) => {
  try {
    const { review_id } = req.params;
    const { action } = req.body;

    if (!["pending", "approve", "reject", "flag"].includes(action)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid action. Must be pending, approve, reject, or flag",
      });
    }

    // Get admin from token
    const admin = await User.findOne({ where: { email: req.user.email } });
    if (!admin) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Find the review
    const review = await ProductReview.findByPk(review_id);
    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Review not found",
      });
    }

    // Update the review status
    await review.update({
      review_action: action,
      updated_by: admin.user_id,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.put.succ,
      data: { review_id, action },
    });
  } catch (err) {
    console.error("❌ Error changing review status:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.put.fail,
      error: err.message,
    });
  }
};

/**
 * Delete a review (admin only)
 */
export const deleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;

    // Find the review
    const reviewToDelete = await ProductReview.findByPk(review_id);
    if (!reviewToDelete) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Review not found",
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

/**
 * Get review analytics data for admin dashboard
 */
export const reviewAnalytics = async (req, res) => {
  try {
    // Get review counts by status
    const statusCounts = await ProductReview.findAll({
      attributes: [
        "review_action",
        [
          db.sequelize.fn("COUNT", db.sequelize.col("product_review_id")),
          "count",
        ],
      ],
      group: ["review_action"],
      raw: true,
    });

    // Format status counts for frontend
    const formattedStatusCounts = {
      pending: 0,
      approve: 0,
      flag: 0,
      reject: 0,
    };

    statusCounts.forEach((item) => {
      formattedStatusCounts[item.review_action] = parseInt(item.count);
    });

    // Get average rating across all reviews
    const avgRatingResult = await ProductReview.findOne({
      attributes: [
        [db.sequelize.fn("AVG", db.sequelize.col("rating")), "avgRating"],
        [
          db.sequelize.fn("COUNT", db.sequelize.col("product_review_id")),
          "totalReviews",
        ],
      ],
      raw: true,
    });

    const avgRating = parseFloat(avgRatingResult.avgRating || 0).toFixed(1);
    const totalReviews = parseInt(avgRatingResult.totalReviews || 0);

    // First, get all products with their IDs and names
    const products = await Product.findAll({
      attributes: ["product_id", "name"],
      raw: true,
    });

    // Then, for each product, get its average rating and review count
    const productsWithRatings = await Promise.all(
      products.map(async (product) => {
        const ratingData = await ProductReview.findOne({
          attributes: [
            [db.sequelize.fn("AVG", db.sequelize.col("rating")), "avgRating"],
            [
              db.sequelize.fn("COUNT", db.sequelize.col("product_review_id")),
              "reviewCount",
            ],
          ],
          where: { product_id: product.product_id },
          raw: true,
        });

        return {
          ...product,
          avgRating: parseFloat(ratingData.avgRating || 0),
          reviewCount: parseInt(ratingData.reviewCount || 0),
        };
      })
    );

    // Filter products with at least one review, sort by rating, and take top 3
    const topRatedProducts = productsWithRatings
      .filter((product) => product.reviewCount > 0)
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 3);

    // Format top rated products to match the frontend display format
    const formattedTopProducts = topRatedProducts.map((product) => ({
      name: product.name,
      rating: `${product.avgRating.toFixed(1)}/5`,
      reviewCount: product.reviewCount,
    }));

    // Return the analytics data
    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: {
        reviewCounts: formattedStatusCounts,
        ratingDistribution: {
          average: `${avgRating}/5`,
          total: totalReviews,
        },
        topRatedProducts: formattedTopProducts,
      },
    });
  } catch (err) {
    console.error("❌ Error getting review analytics:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

export default {
  getAllProductReviews,
  getProductReviews,
  getReviewById,
  changeReviewStatus,
  deleteReview,
  reviewAnalytics,
};
