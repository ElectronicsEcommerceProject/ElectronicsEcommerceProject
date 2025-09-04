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

<<<<<<< Updated upstream
=======
/**
 * Convert relative path to full URL for response
 * @param {string} imagePath - Image path
 * @param {Object} req - Express request object
 * @returns {string} Full URL
 */
const convertToFullUrl = (imagePath, req) => {
  if (imagePath && !imagePath.startsWith("http")) {
    const fullUrl = `${req.protocol}://${req.get("host")}/${imagePath.replace(
      /\\/g,
      "/"
    )}`;
    console.log(`🔗 Converting URL: ${imagePath} -> ${fullUrl}`);
    return fullUrl;
  }
  console.log(`🔗 URL already full or empty: ${imagePath}`);
  return imagePath || "";
};

>>>>>>> Stashed changes
// Controller: Fetch products for user dashboard with detailed info
const getUserDashboardProducts = async (req, res) => {
  console.log('🚀 getUserDashboardProducts called - START');
  try {
    // Get user role from JWT token
    const userRole = req.user?.role;
    console.log('👤 User role:', userRole);

    if (!userRole) {
      console.log('❌ No user role found');
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "User role not found in token",
      });
    }

<<<<<<< Updated upstream
=======
    // Pagination parameters
    const { page, limit, offset } = getPaginationParams(req);
    console.log('📄 Pagination:', { page, limit, offset });
    
    // Search parameters
    const search = req.query.search?.trim();
    const brand = req.query.brand?.trim();
    console.log('🔍 Search params:', { search, brand });
    
    // Create cache key based on parameters
    const cacheKey = `userDashboardData:${userRole}:page:${page}:limit:${limit}:search:${search || 'none'}:brand:${brand || 'none'}`;
    console.log('🔑 Cache key:', cacheKey);
    
    // Clear cache to force fresh data (temporary for debugging)
    await cacheUtils.clearPatterns(cacheKey);
    console.log('🗑️ Cache cleared for debugging');
    
    // Check cache first
    console.log('💾 Checking cache...');
    const cachedData = await cacheUtils.get(cacheKey);
    if (cachedData) {
      console.log('📦 Cached data sample:', JSON.stringify(cachedData.data?.[0], null, 2));
      // Check if cached data has placeholder images - if so, clear cache and fetch fresh
      const hasPlaceholders = cachedData.data?.some(item => 
        item.image && item.image.includes('unsplash.com')
      );
      console.log('🔍 Has placeholders:', hasPlaceholders);
      if (hasPlaceholders) {
        console.log('🗑️ Cache contains placeholder images, clearing cache and fetching fresh data');
        await cacheUtils.delete(cacheKey);
      } else {
        console.log('✅ Cache hit, returning cached data');
        return res.status(StatusCodes.OK).json({
          success: true,
          message: "Cached response",
          fromCache: true,
          ...cachedData
        });
      }
    }
    console.log('❌ Cache miss, proceeding with database query');

    // Build where conditions
    const whereConditions = { is_active: true };
    const includeConditions = [];

    // Add search conditions
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { short_description: { [Op.like]: `%${search}%` } }
      ];
    }

>>>>>>> Stashed changes
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
          as: "productVariant",
          attributes: ["product_variant_id", "stock_quantity", "base_variant_image_url"],
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
          as: "productMedia",
          include: [
            {
              model: ProductMediaUrl,
              as: "productMediaUrl",
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
          as: "coupon",
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

    console.log(`📊 Query result: ${count} total products, ${products.length} products fetched`);

    // Transform data into desired format
    const data = products.map((prod) => {
      const variant = prod.productVariant?.[0];
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
      console.log(`📸 Product ${prod.name} - productMedia:`, prod.productMedia?.length || 0, 'items');
      if (prod.productMedia && prod.productMedia.length > 0 && prod.productMedia[0].productMediaUrl && prod.productMedia[0].productMediaUrl.length > 0) {
<<<<<<< Updated upstream
        image = prod.productMedia[0].productMediaUrl[0].product_media_url;
        image = image.replace(/\\/g, "/");
        if (!image.startsWith("http")) {
          image = `${req.protocol}://${req.get("host")}/${image}`;
        }
=======
        console.log(`📸 Product ${prod.name} - Found productMedia image:`, prod.productMedia[0].productMediaUrl[0].product_media_url);
        image = convertToFullUrl(prod.productMedia[0].productMediaUrl[0].product_media_url, req);
      } else if (variant && variant.base_variant_image_url) {
        console.log(`📸 Product ${prod.name} - Using variant image:`, variant.base_variant_image_url);
        image = convertToFullUrl(variant.base_variant_image_url, req);
>>>>>>> Stashed changes
      } else {
        console.log(`📸 Product ${prod.name} - No images found, using placeholder`);
        image = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop";
      }
      console.log(`📸 Final image URL for ${prod.name}:`, image);

      // Calculate average rating
      const ratingCount = prod.reviews.length;
      const avgRating = ratingCount
        ? prod.reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
        : 0;

      // Extract features from all variants' attribute values
      const features = [];
      const attributeMap = new Map();

      prod.productVariant?.forEach((variant) => {
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
