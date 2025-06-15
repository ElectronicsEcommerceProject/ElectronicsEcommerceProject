import { StatusCodes } from "http-status-codes";
import db from "../../../../../../models/index.js";
import MESSAGE from "../../../../../../constants/message.js";
import slugify from "slugify";
import { Op } from "sequelize";

const {
  Product,
  Category,
  Brand,
  User,
  ProductVariant,
  Coupon,
  DiscountRule,
  ProductReview,
  OrderItem,
  ProductMedia,
  ProductMediaUrl,
  AttributeValue,
  Attribute,
  VariantAttributeValue,
  Wishlist,
  WishListItem,
  Cart,
  CartItem,
} = db;

/**
 * Get product details by ID with all related data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const userProductByIdDetails = async (req, res, next) => {
  try {
    const { product_id } = req.params;

    console.log("product_id", product_id);

    // Fetch product with all related data
    const product = await Product.findByPk(product_id, {
      include: [
        {
          model: Brand,
          as: "brand",
          attributes: ["brand_id", "name", "slug"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["category_id", "name", "slug", "target_role"],
        },
        {
          model: ProductMedia,
          as: "media",
          include: [
            {
              model: ProductMediaUrl,
              as: "ProductMediaURLs",
              attributes: [
                "product_media_url_id",
                "product_media_url",
                "media_type",
              ],
            },
          ],
          attributes: ["product_media_id", "media_type"],
        },
        {
          model: ProductVariant,
          as: "variants",
          include: [
            {
              model: VariantAttributeValue,
              as: "variantAttributeValues",
              include: [
                {
                  model: AttributeValue,
                  foreignKey: "product_attribute_value_id",
                  include: [
                    {
                      model: Attribute,
                      foreignKey: "product_attribute_id",
                      attributes: [
                        "product_attribute_id",
                        "name",
                        "data_type",
                        "is_variant_level",
                      ],
                    },
                  ],
                  attributes: ["product_attribute_value_id", "value"],
                },
              ],
              attributes: ["variant_attribute_value_id"],
            },
          ],
          attributes: [
            "product_variant_id",
            "description",
            "short_description",
            "price",
            "sku",
            "base_variant_image_url",
            "discount_quantity",
            "discount_percentage",
            "min_retailer_quantity",
            "bulk_discount_quantity",
            "bulk_discount_percentage",
          ],
        },
        {
          model: ProductReview,
          as: "reviews",
          include: [
            {
              model: User,
              as: "reviewer",
              attributes: [
                "user_id",
                "name",
                "profileImage_url",
                "email",
                "role",
              ],
            },
          ],
          attributes: [
            "product_review_id",
            "product_variant_id",
            "user_id",
            "rating",
            "title",
            "review",
            "is_verified_purchase",
            "review_action",
            "created_by",
            "updated_by",
            "createdAt",
            "updatedAt",
          ],
        },
        {
          model: Coupon,
          as: "coupons",
          attributes: [
            "coupon_id",
            "code",
            "description",
            "type",
            "discount_value",
            "target_type",
            "target_role",
            "min_cart_value",
            "max_discount_value",
            "usage_limit",
            "usage_per_user",
            "valid_from",
            "valid_to",
            "is_active",
            "is_user_new",
            "category_id",
            "brand_id",
            "product_id",
          ],
        },
        {
          model: DiscountRule,
          as: "discountRules",
          attributes: [
            "discount_rule_id",
            "rule_type",
            "product_id",
            "category_id",
            "min_retailer_quantity",
            "bulk_discount_quantity",
            "bulk_discount_percentage",
            "discount_quantity",
            "discount_percentage",
            "is_active",
          ],
        },
        {
          model: WishListItem,
          as: "wishlistItems",
          include: [
            {
              model: Wishlist,
              as: "wishlist",
              attributes: ["wishlist_id", "user_id"],
            },
          ],
          attributes: [
            "wish_list_item_id",
            "product_id",
            "product_variant_id",
            "createdAt",
          ],
        },
        {
          model: CartItem,
          as: "cartItems",
          include: [
            {
              model: Cart,
              as: "cart",
              attributes: ["cart_id", "user_id"],
            },
          ],
          attributes: [
            "cart_item_id",
            "product_id",
            "product_variant_id",
            "total_quantity",
            "discount_quantity",
            "price_at_time",
            "discount_applied",
            "final_price",
            "createdAt",
          ],
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    });

    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: MESSAGE.none,
      });
    }

    // Convert to plain object for response
    const productData = product.get({ plain: true });

    // Fetch related products (same category, different products)
    const relatedProducts = await getRelatedProducts(
      productData.category_id,
      productData.product_id
    );

    // Format response according to the specified structure
    const formattedProduct = formatProductResponse(
      productData,
      relatedProducts
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: {
        mainProduct: formattedProduct,
      },
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

/**
 * Get related products from the same category
 * @param {string} categoryId - Category ID
 * @param {string} currentProductId - Current product ID to exclude
 * @returns {Array} Related products
 */
const getRelatedProducts = async (categoryId, currentProductId) => {
  try {
    const relatedProducts = await Product.findAll({
      where: {
        category_id: categoryId,
        product_id: { [Op.ne]: currentProductId },
        is_active: true,
      },
      include: [
        {
          model: Brand,
          as: "brand",
          attributes: ["brand_id", "name"],
        },
        {
          model: ProductMedia,
          as: "media",
          include: [
            {
              model: ProductMediaUrl,
              as: "ProductMediaURLs",
              attributes: ["product_media_url"],
            },
          ],
          limit: 1,
        },
        {
          model: ProductVariant,
          as: "variants",
          attributes: ["price"],
          limit: 1,
        },
      ],
      attributes: ["product_id", "name", "base_price"],
      limit: 5,
    });

    return relatedProducts.map((product) => {
      const plainProduct = product.get({ plain: true });
      return {
        id: plainProduct.product_id,
        product_id: plainProduct.product_id,
        title: plainProduct.name,
        name: plainProduct.name,
        price: `₹${
          plainProduct.variants?.[0]?.price || plainProduct.base_price
        }`,
        image:
          plainProduct.media?.[0]?.ProductMediaURLs?.[0]?.product_media_url ||
          "",
        brand: plainProduct.brand,
      };
    });
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
};

/**
 * Format product data to match the required response structure
 * @param {Object} productData - Raw product data from database
 * @param {Array} relatedProducts - Related products array
 * @returns {Object} Formatted product data
 */
const formatProductResponse = (productData, relatedProducts = []) => {
  // Process media to match the URL structure
  const mediaWithUrls =
    productData.media?.map((media) => ({
      ...media,
      urls: media.ProductMediaURLs || [],
    })) || [];

  // Process variants with their attributes
  const variantsWithAttributes =
    productData.variants?.map((variant) => ({
      ...variant,
      variantAttributes:
        variant.variantAttributeValues?.map((varAttrVal) => ({
          variant_attribute_value_id: varAttrVal.variant_attribute_value_id,
          attribute: {
            product_attribute_id:
              varAttrVal.AttributeValue?.Attribute?.product_attribute_id ||
              null,
            name: varAttrVal.AttributeValue?.Attribute?.name || "Unknown",
            data_type:
              varAttrVal.AttributeValue?.Attribute?.data_type || "string",
            is_variant_level:
              varAttrVal.AttributeValue?.Attribute?.is_variant_level || true,
          },
          attributeValue: {
            product_attribute_value_id:
              varAttrVal.AttributeValue?.product_attribute_value_id || null,
            value: varAttrVal.AttributeValue?.value || "N/A",
          },
        })) || [],
    })) || [];

  // Calculate pricing information
  const firstVariant = productData.variants?.[0];
  const basePrice = parseFloat(productData.base_price) || 0;
  const variantPrice = firstVariant
    ? parseFloat(firstVariant.price) || 0
    : basePrice;
  const discountPercentage = firstVariant?.discount_percentage || 0;

  // Calculate final price and discount
  const finalPrice = variantPrice;
  const originalPrice = discountPercentage > 0 ? basePrice : variantPrice;
  const discountAmount = originalPrice - finalPrice;
  const actualDiscountPercentage =
    originalPrice > 0 ? (discountAmount / originalPrice) * 100 : 0;

  // Process reviews with proper user information and variant details
  const processedReviews = Array.isArray(productData.reviews)
    ? productData.reviews.map((review) => {
        // Find the variant for this review
        const reviewVariant = productData.variants?.find(
          (v) => v.product_variant_id === review.product_variant_id
        );

        return {
          ...review,
          user: {
            user_id: review.reviewer?.user_id || null,
            name: review.reviewer?.name || "Anonymous User",
            profileImage_url: review.reviewer?.profileImage_url || null,
            verified_buyer: review.is_verified_purchase || false,
            totalReviews: 0, // Could be enhanced with actual count
            helpfulVotes: 0, // Could be enhanced with actual count
          },
          variant: reviewVariant?.description || "Standard",
          helpfulCount: 0, // Could be enhanced with actual helpful votes
          reportCount: 0, // Could be enhanced with actual reports
        };
      })
    : [];

  // Format the final response
  return {
    ...productData,
    media: mediaWithUrls,
    variants: variantsWithAttributes,
    reviews: processedReviews,

    // Legacy format for UI compatibility - Frontend expects these fields
    title: productData.name,
    rating: productData.rating_average
      ? parseFloat(productData.rating_average).toFixed(1)
      : "N/A",
    price: `₹${finalPrice.toFixed(2)}`,
    originalPrice:
      actualDiscountPercentage > 0 ? `₹${originalPrice.toFixed(2)}` : null,
    discount:
      actualDiscountPercentage > 0
        ? `${Math.round(actualDiscountPercentage)}% off`
        : null,

    // Main image and thumbnails for frontend
    mainImage: mediaWithUrls?.[0]?.urls?.[0]?.product_media_url || "",
    thumbnails:
      mediaWithUrls
        ?.flatMap((media) => media.urls?.map((url) => url.product_media_url))
        .filter(Boolean) || [],

    // Variant names for frontend compatibility
    variantNames:
      variantsWithAttributes?.map(
        (v) => v.description || `Variant ${v.product_variant_id}`
      ) || [],

    // Description formatting for frontend
    description: productData.description
      ? Array.isArray(productData.description)
        ? productData.description
        : [productData.description]
      : ["No description available"],

    // Wishlist information
    wishlistInfo:
      productData.wishlistItems && productData.wishlistItems.length > 0
        ? {
            wishlist_id:
              productData.wishlistItems[0]?.wishlist?.wishlist_id || null,
            user_id: productData.wishlistItems[0]?.wishlist?.user_id || null,
            items: productData.wishlistItems.map((item) => ({
              wish_list_item_id: item.wish_list_item_id,
              product_id: item.product_id,
              product_variant_id: item.product_variant_id,
              createdAt: item.createdAt,
            })),
          }
        : null,

    // Cart information
    cartInfo:
      productData.cartItems && productData.cartItems.length > 0
        ? {
            cart_id: productData.cartItems[0]?.cart?.cart_id || null,
            user_id: productData.cartItems[0]?.cart?.user_id || null,
            items: productData.cartItems.map((item) => ({
              cart_item_id: item.cart_item_id,
              product_id: item.product_id,
              product_variant_id: item.product_variant_id,
              total_quantity: item.total_quantity,
              discount_quantity: item.discount_quantity,
              price_at_time: item.price_at_time,
              discount_applied: item.discount_applied,
              final_price: item.final_price,
              createdAt: item.createdAt,
            })),
          }
        : null,

    // Personalized coupons (empty for now, can be enhanced)
    personalizedCoupons: [],

    // Related products
    relatedProducts: relatedProducts || [],
  };
};

export default { userProductByIdDetails };
