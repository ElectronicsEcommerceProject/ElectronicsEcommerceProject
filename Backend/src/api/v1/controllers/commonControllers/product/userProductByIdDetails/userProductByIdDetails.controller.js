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
  StockAlert,
  Wishlist,
  Cart,
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
            "stock_quantity",
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
          model: StockAlert,
          as: "stockAlerts",
          attributes: [
            "stock_alert_id",
            "product_id",
            "product_variant_id",
            "stock_level",
            "status",
            "created_by",
            "updated_by",
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

    // Format response according to the specified structure
    const formattedProduct = formatProductResponse(productData);

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
 * Format product data to match the required response structure
 * @param {Object} productData - Raw product data from database
 * @returns {Object} Formatted product data
 */
const formatProductResponse = (productData) => {
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

  // Format the final response
  return {
    ...productData,
    media: mediaWithUrls,
    variants: variantsWithAttributes,
    // Legacy format for UI compatibility
    title: productData.name,
    rating:
      productData.rating_average &&
      typeof productData.rating_average === "number"
        ? productData.rating_average.toFixed(1)
        : "N/A",
    reviews: `${productData.rating_count || 0} Ratings & ${
      productData.reviews?.length || 0
    } Reviews`,
    price: `₹${productData.variants?.[0]?.price || productData.base_price}`,
    originalPrice: `₹${productData.base_price}`,
    discount: productData.variants?.[0]?.discount_percentage
      ? `${Math.round(productData.variants[0].discount_percentage)}% off`
      : "N/A",
    mainImage: productData.media?.[0]?.urls?.[0]?.product_media_url || "",
    thumbnails:
      productData.media
        ?.map((media) => media.urls?.[0]?.product_media_url || "")
        .filter(Boolean) || [],
    variantNames: productData.variants?.map(
      (v) => v.description || `Variant ${v.product_variant_id}`
    ),
    description: productData.description
      ? productData.description.split(". ").slice(0, 4)
      : [],
    // Related products (mocked, could be enhanced with real data)
    relatedProducts: [],
  };
};

export default { userProductByIdDetails };
