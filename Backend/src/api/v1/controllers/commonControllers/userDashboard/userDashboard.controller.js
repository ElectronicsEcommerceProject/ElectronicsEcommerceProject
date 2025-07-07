import { StatusCodes } from "http-status-codes";
import db from "../../../../../models/index.js";
import MESSAGE from "../../../../../constants/message.js";
import { Op } from "sequelize";

const {
  Product,
  ProductVariant,
  ProductMedia,
  ProductMediaUrl,
  Brand,
  ProductReview,
  Coupon,
  AttributeValue,
  Attribute,
  Category,
} = db;

// Controller: Fetch products for user dashboard with detailed info
const getUserDashboardProducts = async (req, res) => {
  try {
    // Get user role from JWT token
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "User role not found in token",
      });
    }

    // Fetch active products with related data filtered by user role
    const products = await Product.findAll({
      where: { is_active: true },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name", "target_role"],
          where: {
            target_role: {
              [Op.in]: [userRole, "both"]
            }
          },
          required: true, // Only include products with matching category target_role
        },
        {
          model: ProductVariant,
          as: "variants",
          attributes: ["product_variant_id", "stock_quantity"],
          include: [
            {
              model: AttributeValue,
              attributes: ["value"],
              include: [
                {
                  model: Attribute,
                  attributes: ["name"],
                },
              ],
            },
          ],
        },
        {
          model: ProductMedia,
          as: "media",
          include: [
            {
              model: ProductMediaUrl,
              attributes: ["product_media_url"],
              where: { media_type: "image" },
              required: false,
            },
          ],
        },
        {
          model: Brand,
          as: "brand",
          attributes: ["name"],
        },
        {
          model: ProductReview,
          as: "reviews",
          attributes: ["rating"],
        },
        {
          model: Coupon,
          as: "coupons",
          where: {
            is_active: true,
            valid_from: { [Op.lte]: new Date() },
            valid_to: { [Op.gte]: new Date() },
            target_role: {
              [Op.in]: [userRole, "both"]
            }
          },
          required: false,
        },
      ],
    });

    // Transform data into desired format
    const data = products.map((prod) => {
      const variant = prod.variants[0];
      const basePrice = parseFloat(prod.base_price);
      const sellingPrice = basePrice;

      // Calculate discount from coupon
      let discountPercent = 0;
      if (prod.coupons && prod.coupons.length > 0) {
        const coupon = prod.coupons[0];
        if (coupon.type === "percentage") {
          discountPercent = parseFloat(coupon.discount_value);
        } else if (coupon.type === "fixed") {
          discountPercent = (
            (parseFloat(coupon.discount_value) / basePrice) *
            100
          ).toFixed(0);
        }
      }

      // Determine image URL from product media
      let image = null;
      if (prod.media && prod.media.length > 0 && prod.media[0].ProductMediaURLs && prod.media[0].ProductMediaURLs.length > 0) {
        image = prod.media[0].ProductMediaURLs[0].product_media_url;
        image = image.replace(/\\/g, "/");
        if (!image.startsWith("http")) {
          image = `${req.protocol}://${req.get("host")}/${image}`;
        }
      } else {
        image = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop";
      }

      // Calculate average rating
      const ratingCount = prod.reviews.length;
      const avgRating = ratingCount
        ? prod.reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
        : 0;

      // Extract features from all variants' attribute values
      const features = [];
      const attributeMap = new Map();

      prod.variants.forEach((variant) => {
        if (variant.AttributeValues?.length) {
          variant.AttributeValues.forEach((attrValue) => {
            if (attrValue.Attribute) {
              const attrName = attrValue.Attribute.name;
              if (!attributeMap.has(attrName)) {
                attributeMap.set(attrName, new Set());
              }
              attributeMap.get(attrName).add(attrValue.value);
            }
          });
        }
      });

      attributeMap.forEach((values, attrName) => {
        features.push(`${attrName}: ${Array.from(values).join(", ")}`);
      });

      return {
        product_id: prod.product_id,
        image,
        name: prod.name,
        description: prod.description || "",
        price: `₹${sellingPrice.toLocaleString()}`,
        originalPrice: `₹${basePrice.toLocaleString()}`,
        stock:
          variant && variant.stock_quantity > 0 ? "in-stock" : "out-of-stock",
        brand: prod.brand?.name || "",
        rating: +avgRating.toFixed(1),
        discount: `${Math.round(discountPercent)}%`,
        features,
      };
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data,
    });
  } catch (error) {
    console.error("Error in getUserDashboardProducts:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

export default {
  getUserDashboardProducts,
};
