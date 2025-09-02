import { StatusCodes } from "http-status-codes";
import db from "../../../../../../models/index.js";
import MESSAGE from "../../../../../../constants/message.js";
import slugify from "slugify";
import { Op } from "sequelize";
import { cacheUtils, CACHE_TTL } from "../../../../../../utils/cacheUtils.js";

const {
  Product,
  Category,
  Brand,
  User,
  ProductVariant,
  Coupon,
  CouponUser,
  DiscountRule,
  ProductReview,
  OrderItem,
  ProductMedia,
  productMediaUrl,
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
    console.log("testing the userProductByIdDetails controller")
    const { product_id } = req.params;
    const userId = req.user?.user_id || 'guest';

    // Create a cache key that includes product ID and user ID (for personalized content)
    const cacheKey = `product:${product_id}:user:${userId}`;

    // Try to get data from cache first
    const cachedProduct = await cacheUtils.get(cacheKey);
    if (cachedProduct) {
      console.log(`✅ Product ${product_id} served from cache for user ${userId}`);
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Cached response",
        fromCache: true,
        data: {
          mainProduct: {
            ...cachedProduct,
            _cachedData: true
          }
        },
      });
    }

    // Cache miss - fetch product with all related data
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
              model: productMediaUrl,
              as: "productMediaUrl",
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
          where: {
            review_action: "approve",
          },
          required: false,
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

    // Fetch related products (same brand + same category, different products)
    const relatedProducts = await getRelatedProducts(
      productData.category_id,
      productData.brand_id,
      productData.product_id,
      req
    );

    // console.log("✅ Found related products:", relatedProducts.length);

    // Fetch relevant coupons for this product
    const relevantCoupons = await getRelevantCoupons(
      productData.product_id,
      productData.brand_id,
      productData.category_id
    );

    // Fetch applied coupons for the current user
    const appliedCoupons = await getAppliedCouponsForUser(req.user.user_id);

    // Format response according to the specified structure
    const formattedProduct = formatProductResponse(
      productData,
      relatedProducts,
      relevantCoupons,
      appliedCoupons,
      req
    );

    // Cache the formatted product data
    await cacheUtils.set(cacheKey, formattedProduct, CACHE_TTL.SHORT_TTL);
    console.log(`✅ Product ${product_id} cached for user ${userId} (15 min TTL)`);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Fresh data",
      fromCache: false,
      data: {
        mainProduct: formattedProduct
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
 * Get related products using intelligent algorithm
 * Priority: Same brand > Same category > Featured products
 * @param {string} categoryId - Category ID
 * @param {string} brandId - Brand ID
 * @param {string} currentProductId - Current product ID to exclude
 * @param {Object} req - Express request object
 * @returns {Array} Related products
 */
const getRelatedProducts = async (
  categoryId,
  brandId,
  currentProductId,
  req
) => {
  // Create a cache key for related products
  const cacheKey = `relatedProducts:${currentProductId}:${categoryId}:${brandId}`;

  // Try to get related products from cache
  const cachedRelatedProducts = await cacheUtils.get(cacheKey);
  if (cachedRelatedProducts) {
    console.log(`✅ Related products for ${currentProductId} served from cache`);
    // Add a property to indicate this came from cache
    return cachedRelatedProducts.map(product => ({
      ...product,
      _cachedData: true
    }));
  }
  try {
    const relatedProducts = [];
    const maxProducts = 8; // Total number of related products to return

    // Common include configuration for all queries
    const includeConfig = [
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
            model: productMediaUrl,
            as: "productMediaUrl",
            attributes: ["product_media_url"],
          },
        ],
        limit: 1,
      },
      {
        model: ProductVariant,
        as: "variants",
        attributes: ["price", "discount_percentage"],
        limit: 1,
      },
    ];

    const baseAttributes = [
      "product_id",
      "name",
      "base_price",
      "rating_average",
      "rating_count",
      "is_featured",
    ];

    // 1. Priority 1: Same brand products (different category is OK)
    if (brandId) {
      const sameBrandProducts = await Product.findAll({
        where: {
          brand_id: brandId,
          product_id: { [Op.ne]: currentProductId },
          is_active: true,
        },
        include: includeConfig,
        attributes: baseAttributes,
        order: [
          ["rating_average", "DESC"],
          ["rating_count", "DESC"],
          ["createdAt", "DESC"],
        ],
        limit: Math.min(5, maxProducts), // Get up to 5 same-brand products
      });

      relatedProducts.push(...sameBrandProducts);
    }

    // 2. Priority 2: Same category products (different brands)
    if (relatedProducts.length < maxProducts && categoryId) {
      const remainingSlots = maxProducts - relatedProducts.length;
      const existingProductIds = relatedProducts.map((p) => p.product_id);

      const sameCategoryProducts = await Product.findAll({
        where: {
          category_id: categoryId,
          product_id: {
            [Op.and]: [
              { [Op.ne]: currentProductId },
              { [Op.notIn]: existingProductIds },
            ],
          },
          is_active: true,
          // Prefer different brands if we already have same-brand products
          ...(brandId && relatedProducts.length > 0
            ? { brand_id: { [Op.ne]: brandId } }
            : {}),
        },
        include: includeConfig,
        attributes: baseAttributes,
        order: [
          ["rating_average", "DESC"],
          ["rating_count", "DESC"],
          ["is_featured", "DESC"],
          ["createdAt", "DESC"],
        ],
        limit: remainingSlots,
      });

      relatedProducts.push(...sameCategoryProducts);
    }

    // 3. Priority 3: Featured products if still not enough
    if (relatedProducts.length < maxProducts) {
      const remainingSlots = maxProducts - relatedProducts.length;
      const existingProductIds = relatedProducts.map((p) => p.product_id);

      const featuredProducts = await Product.findAll({
        where: {
          product_id: {
            [Op.and]: [
              { [Op.ne]: currentProductId },
              { [Op.notIn]: existingProductIds },
            ],
          },
          is_active: true,
          is_featured: true,
        },
        include: includeConfig,
        attributes: baseAttributes,
        order: [
          ["rating_average", "DESC"],
          ["rating_count", "DESC"],
          ["createdAt", "DESC"],
        ],
        limit: remainingSlots,
      });

      relatedProducts.push(...featuredProducts);
    }

    // 4. Fallback: Any other active products if still not enough
    if (relatedProducts.length < maxProducts) {
      const remainingSlots = maxProducts - relatedProducts.length;
      const existingProductIds = relatedProducts.map((p) => p.product_id);

      const fallbackProducts = await Product.findAll({
        where: {
          product_id: {
            [Op.and]: [
              { [Op.ne]: currentProductId },
              { [Op.notIn]: existingProductIds },
            ],
          },
          is_active: true,
        },
        include: includeConfig,
        attributes: baseAttributes,
        order: [
          ["rating_average", "DESC"],
          ["rating_count", "DESC"],
          ["createdAt", "DESC"],
        ],
        limit: remainingSlots,
      });

      relatedProducts.push(...fallbackProducts);
    }

    // Format the response
    const formattedRelatedProducts = relatedProducts.map((product) => {
      const plainProduct = product.get({ plain: true });
      const variantPrice = plainProduct.variants?.[0]?.price;
      const basePrice = plainProduct.base_price;
      const finalPrice = variantPrice || basePrice;
      const discountPercentage =
        plainProduct.variants?.[0]?.discount_percentage || 0;

      return {
        id: plainProduct.product_id,
        product_id: plainProduct.product_id,
        title: plainProduct.name,
        name: plainProduct.name,
        price: `₹${parseFloat(finalPrice).toFixed(2)}`,
        originalPrice:
          discountPercentage > 0
            ? `₹${parseFloat(basePrice).toFixed(2)}`
            : null,
        discount: discountPercentage > 0 ? `${discountPercentage}% off` : null,
        rating: plainProduct.rating_average
          ? parseFloat(plainProduct.rating_average).toFixed(1)
          : "0.0",
        ratingCount: plainProduct.rating_count || 0,
        image: convertToFullUrl(
          plainProduct.media?.[0]?.productMediaUrl?.[0]?.product_media_url,
          req
        ),
        brand: plainProduct.brand,
        isFeatured: plainProduct.is_featured || false,
      };
    });

    // Cache the related products
    await cacheUtils.set(cacheKey, formattedRelatedProducts, CACHE_TTL.DEFAULT_TTL);
    console.log(`✅ Related products for ${currentProductId} cached (1 hour TTL)`);

    return formattedRelatedProducts;
  } catch (error) {
    return [];
  }
};

/**
 * Get applied coupons for a specific user
 * @param {string} userId - User ID
 * @returns {Array} Applied coupons with coupon details
 */
const getAppliedCouponsForUser = async (userId) => {
  // Create a cache key for applied coupons
  const cacheKey = `appliedCoupons:${userId}`;

  // Try to get applied coupons from cache
  const cachedCoupons = await cacheUtils.get(cacheKey);
  if (cachedCoupons) {
    console.log(`✅ Applied coupons for user ${userId} served from cache`);
    // Add a property to indicate this came from cache
    return cachedCoupons.map(coupon => ({
      ...coupon,
      _cachedData: true
    }));
  }

  try {
    const appliedCoupons = await CouponUser.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Coupon,
          attributes: [
            "coupon_id",
            "code",
            "description",
            "type",
            "discount_value",
            "target_type",
            "min_cart_value",
            "max_discount_value",
            "valid_from",
            "valid_to",
            "is_active",
            "category_id",
            "brand_id",
            "product_id",
          ],
        },
      ],
      attributes: ["coupon_user_id", "createdAt"],
    });

    const formattedCoupons = appliedCoupons.map((couponUser) => {
      const couponData = couponUser.get({ plain: true });
      return {
        ...couponData.Coupon,
        applied_at: couponData.createdAt,
      };
    });

    // Cache the applied coupons
    await cacheUtils.set(cacheKey, formattedCoupons, CACHE_TTL.SHORT_TTL);
    console.log(`✅ Applied coupons for user ${userId} cached (15 min TTL)`);

    return formattedCoupons;
  } catch (error) {
    console.error("Error fetching applied coupons:", error);
    return [];
  }
};

/**
 * Get relevant coupons for the product
 * Excludes coupons with target_type 'cart' and includes only those matching product_id, brand_id, or category_id
 * @param {string} productId - Product ID
 * @param {string} brandId - Brand ID
 * @param {string} categoryId - Category ID
 * @returns {Array} Relevant coupons
 */
const getRelevantCoupons = async (productId, brandId, categoryId) => {
  // Create a cache key for relevant coupons
  const cacheKey = `relevantCoupons:${productId}:${brandId}:${categoryId}`;

  // Try to get relevant coupons from cache
  const cachedCoupons = await cacheUtils.get(cacheKey);
  if (cachedCoupons) {
    console.log(`✅ Relevant coupons for product ${productId} served from cache`);
    // Add a property to indicate this came from cache
    return cachedCoupons.map(coupon => ({
      ...coupon,
      _cachedData: true
    }));
  }
  try {
    const relevantCoupons = await Coupon.findAll({
      where: {
        // Exclude cart-level coupons
        target_type: { [Op.ne]: "cart" },
        // Include only active coupons
        is_active: true,
        // Include coupons that match product, brand, or category
        [Op.or]: [
          { product_id: productId },
          { brand_id: brandId },
          { category_id: categoryId },
        ],
        // Ensure coupon is currently valid
        valid_from: { [Op.lte]: new Date() },
        valid_to: { [Op.gte]: new Date() },
      },
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
        "createdAt",
      ],
      order: [["createdAt", "DESC"]], // Show newest coupons first
    });

    const formattedCoupons = relevantCoupons.map((coupon) => coupon.get({ plain: true }));

    // Cache the relevant coupons
    await cacheUtils.set(cacheKey, formattedCoupons, CACHE_TTL.SHORT_TTL);
    console.log(`✅ Relevant coupons for product ${productId} cached (15 min TTL)`);

    return formattedCoupons;
  } catch (error) {
    return [];
  }
};

/**
 * Convert relative path to full URL for response
 * @param {string} imagePath - Image path
 * @param {Object} req - Express request object
 * @returns {string} Full URL
 */
const convertToFullUrl = (imagePath, req) => {
  if (imagePath && !imagePath.startsWith("http")) {
    return `${req.protocol}://${req.get("host")}/${imagePath.replace(
      /\\/g,
      "/"
    )}`;
  }
  return imagePath || "";
};

/**
 * Format product data to match the required response structure
 * @param {Object} productData - Raw product data from database
 * @param {Array} relatedProducts - Related products array
 * @param {Array} coupons - Relevant coupons array
 * @param {Array} appliedCoupons - Applied coupons for the user
 * @param {Object} req - Express request object
 * @returns {Object} Formatted product data
 */
const formatProductResponse = (
  productData,
  relatedProducts = [],
  coupons = [],
  appliedCoupons = [],
  req
) => {
  // Process media to match the URL structure
  const mediaWithUrls =
    productData.media?.map((media) => ({
      ...media,
      urls:
        media.productMediaUrl?.map((url) => ({
          ...url,
          product_media_url: convertToFullUrl(url.product_media_url, req),
        })) || [],
    })) || [];

  // Process variants with their attributes
  const variantsWithAttributes =
    productData.variants?.map((variant) => ({
      ...variant,
      base_variant_image_url: convertToFullUrl(
        variant.base_variant_image_url,
        req
      ),
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

  // Calculate review statistics
  const approvedReviews = Array.isArray(productData.reviews)
    ? productData.reviews.filter((review) => review.review_action === "approve")
    : [];

  const totalReviewCount = approvedReviews.length;
  const averageRating =
    totalReviewCount > 0
      ? (
        approvedReviews.reduce((sum, review) => sum + review.rating, 0) /
        totalReviewCount
      ).toFixed(1)
      : "0.0";

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
    // Override rating fields with calculated values
    rating_average: averageRating,
    rating_count: totalReviewCount,
    media: mediaWithUrls,
    variants: variantsWithAttributes,
    reviews: processedReviews,

    // Legacy format for UI compatibility - Frontend expects these fields
    title: productData.name,
    rating: averageRating,
    price: `₹${finalPrice.toFixed(2)}`,
    originalPrice:
      actualDiscountPercentage > 0 ? `₹${originalPrice.toFixed(2)}` : null,
    discount:
      actualDiscountPercentage > 0
        ? `${Math.round(actualDiscountPercentage)}% off`
        : null,

    // Main image and thumbnails for frontend
    mainImage: convertToFullUrl(
      mediaWithUrls?.[0]?.urls?.[0]?.product_media_url,
      req
    ),
    thumbnails:
      mediaWithUrls
        ?.flatMap((media) =>
          media.urls?.map((url) => convertToFullUrl(url.product_media_url, req))
        )
        .filter(Boolean) || [],

    // Variant names for frontend compatibility
    variantNames:
      variantsWithAttributes?.map(
        (v) => v.sku || `Variant ${v.product_variant_id}`
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

    // Relevant coupons for this product (excluding cart-level coupons)
    coupons: coupons || [],

    // Applied coupons for the current user
    appliedCoupons: appliedCoupons || [],

    // Related products
    relatedProducts: relatedProducts || [],
  };
};

export default { userProductByIdDetails };