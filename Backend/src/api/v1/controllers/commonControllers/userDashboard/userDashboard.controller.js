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

    console.log('🔍 Fetching products for user role:', userRole);
    
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

    console.log(`📊 Found ${products.length} products`);

    // Transform data into desired format
    const data = products.map((prod) => {
      console.log(`\n📦 Processing product: ${prod.name}`);
      const variant = prod.productVariant?.[0];
      const basePrice = parseFloat(prod.base_price);
      const sellingPrice = basePrice;

      // Calculate discount from coupon
      let discountPercent = 0;
      if (prod.coupon && prod.coupon.length > 0) {
        const coupon = prod.coupon[0];
        if (coupon.type === "percentage") {
          discountPercent = parseFloat(coupon.discount_value);
        } else if (coupon.type === "fixed") {
          discountPercent = (
            (parseFloat(coupon.discount_value) / basePrice) *
            100
          ).toFixed(0);
        }
      }

      // Determine image URL with fallback logic
      let image = null;
      
      console.log(`📸 ProductMedia count: ${prod.productMedia?.length || 0}`);
      console.log(`📸 Variant data:`, variant ? { id: variant.product_variant_id, image: variant.base_variant_image_url } : 'No variant');
      
      // First try: ProductMedia images
      if (prod.productMedia && prod.productMedia.length > 0) {
        console.log(`📸 ProductMedia[0] URLs:`, prod.productMedia[0].productMediaUrl?.length || 0);
        if (prod.productMedia[0].productMediaUrl && prod.productMedia[0].productMediaUrl.length > 0) {
          image = prod.productMedia[0].productMediaUrl[0].product_media_url;
          console.log(`📸 Found ProductMedia image: ${image}`);
        }
      }
      
      // Second try: Variant base image
      if (!image && variant && variant.base_variant_image_url) {
        image = variant.base_variant_image_url;
        console.log(`📸 Using variant image: ${image}`);
      }
      
      // Convert to full URL if we have an image
      if (image) {
        const originalImage = image;
        image = image.replace(/\\/g, "/");
        if (!image.startsWith("http")) {
          image = `${req.protocol}://${req.get("host")}/${image}`;
        }
        console.log(`🔗 URL conversion: ${originalImage} -> ${image}`);
      } else {
        // Fallback to placeholder
        image = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop";
        console.log(`📸 No images found, using placeholder`);
      }
      
      console.log(`📸 Final image URL: ${image}`);

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

      const result = {
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
      
      console.log(`✅ Product ${prod.name} processed with image: ${result.image}`);
      return result;
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
