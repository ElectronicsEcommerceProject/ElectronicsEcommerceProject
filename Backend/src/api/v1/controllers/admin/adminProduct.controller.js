import { StatusCodes } from "http-status-codes";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";
import slugify from "slugify";
import { Op } from "sequelize";
import { deleteImages, getPaginationParams, createPaginationResponse } from "../../../../utils/index.js";
import { cacheUtils } from "../../../../utils/cacheUtils.js";

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
  productMediaUrl,
  AttributeValue,
  Attribute,
} = db;



// ✅ Create a new product
const createProduct = async (req, res) => {
  try {
    // Get the user from the token
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: MESSAGE.get.none });
    }

    // Validate category
    const category = await Category.findByPk(req.body.category_id);
    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Category not found" });
    }

    // Validate brand if provided
    if (req.body.brand_id) {
      const brand = await Brand.findByPk(req.body.brand_id);
      if (!brand) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Brand not found" });
      }
    }

    // Generate slug if not provided
    let slug = req.body.slug;
    if (!slug) {
      slug = slugify(req.body.name, { lower: true });

      // Check if slug already exists
      const existingProduct = await Product.findOne({ where: { slug } });
      if (existingProduct) {
        // Append a random string to make it unique
        slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
      }
    }

    // Create the product
    const product = await Product.create({
      ...req.body,
      slug,
      created_by: user.user_id,
    });

    // Flush all cache after successful creation
    await cacheUtils.flushAll();

    res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.post.fail,
      error: error.message,
    });
  }
};

// ✅ Get all products
const getAllProducts = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const cacheKey = `products:all:page:${page}:limit:${limit}`;

    // Check cache first
    const cachedData = await cacheUtils.get(cacheKey);
    if (cachedData) {
      return res.status(StatusCodes.OK).json({
        message: "Cached products",
        fromCache: true,
        ...cachedData
      });
    }

    const { count, rows: products } = await Product.findAndCountAll({
      limit,
      offset,
    });

    const response = {
      message: MESSAGE.get.succ,
      fromCache: false,
      data: products,
      pagination: createPaginationResponse(count, page, limit)
    };

    // Cache results
    await cacheUtils.set(cacheKey, response);

    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// ✅ Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `product:${id}`;

    // Check cache first
    const cachedData = await cacheUtils.get(cacheKey);
    if (cachedData) {
      return res.status(StatusCodes.OK).json({
        message: "Cached product",
        fromCache: true,
        data: cachedData
      });
    }

    const product = await Product.findByPk(id, {
      include: [
        { model: Category, attributes: ["category_id", "name"] },
        { model: Brand, attributes: ["brand_id", "name"] },
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
      ],
    });

    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.none,
      });
    }

    // Cache result
    await cacheUtils.set(cacheKey, product);

    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      fromCache: false,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// ✅ Get products by category ID
const getProductsByCategoryId = async (req, res) => {
  try {
    const { category_id } = req.params;
    const { page, limit, offset } = getPaginationParams(req);
    const cacheKey = `products:category:${category_id}:page:${page}:limit:${limit}`;
    
    // Check cache first
    const cachedData = await cacheUtils.get(cacheKey);
    if (cachedData) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Cached products by category",
        fromCache: true,
        ...cachedData
      });
    }

    // Check if category exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Category not found",
      });
    }

    const { count, rows: products } = await Product.findAndCountAll({
      limit,
      offset,
      where: { category_id: category_id },
      include: [
        { model: Brand, as: "brand", attributes: ["brand_id", "name"] },
        {
          model: ProductVariant,
          as: "variants",
          attributes: [
            "product_variant_id",
            "price",
            "stock_quantity",
            "base_variant_image_url",
          ],
        },
        {
          model: ProductMedia,
          as: "productMedia",
          include: [
            {
              model: productMediaUrl,
              as: "productMediaUrl",
              attributes: ["product_media_url", "media_type"],
              where: { media_type: "image" },
              required: false,
            },
          ],
          required: false,
        },
        {
          model: Coupon,
          as: "coupons",
          where: {
            is_active: true,
            valid_from: { [Op.lte]: new Date() },
            valid_to: { [Op.gte]: new Date() },
          },
          required: false,
        },
        { model: ProductReview, as: "reviews", attributes: ["rating"] },
      ],
    });

    const data = products.map((prod) => {
      const basePrice = parseFloat(prod.base_price);
      const coupons = prod.coupons || [];
      const variants = prod.variants || [];
      const reviews = prod.reviews || [];
      const productMedia = prod.productMedia || [];

      // Calculate discount from coupons
      let leastDiscountCoupon = null;
      coupons.forEach((c) => {
        if (
          !leastDiscountCoupon ||
          parseFloat(c.discount_value) <
          parseFloat(leastDiscountCoupon.discount_value)
        ) {
          leastDiscountCoupon = c;
        }
      });

      let discountPercent = 0;
      let finalPrice = basePrice;
      if (leastDiscountCoupon) {
        if (leastDiscountCoupon.type === "percentage") {
          discountPercent = parseFloat(leastDiscountCoupon.discount_value);
          finalPrice = basePrice * (1 - discountPercent / 100);
        } else if (leastDiscountCoupon.type === "fixed") {
          finalPrice = Math.max(
            0,
            basePrice - parseFloat(leastDiscountCoupon.discount_value)
          );
          discountPercent = ((basePrice - finalPrice) / basePrice) * 100;
        }
      }

      // Get product image
      let productImage = null;
      if (productMedia && productMedia.length > 0) {
        const mediaWithUrl = productMedia.find(
          (m) => m.productMediaUrl && m.productMediaUrl.length > 0
        );
        if (mediaWithUrl) {
          productImage = mediaWithUrl.productMediaUrl[0].product_media_url;
        }
      }
      if (!productImage && variants && variants.length > 0) {
        productImage = variants[0]?.base_variant_image_url || null;
      }
      if (productImage && !productImage.startsWith("http")) {
        productImage = `${req.protocol}://${req.get(
          "host"
        )}/${productImage.replace(/\\/g, "/")}`;
      }

      // Calculate ratings
      const ratingCount = reviews.length;
      const rating = ratingCount
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
        : 0;

      return {
        id: prod.product_id,
        product_id: prod.product_id,
        title: prod.name,
        name: prod.name,
        price: `₹${finalPrice.toFixed(2)}`,
        originalPrice: discountPercent > 0 ? `₹${basePrice.toFixed(2)}` : null,
        discount:
          discountPercent > 0 ? `${Math.round(discountPercent)}% off` : null,
        rating: rating.toFixed(1),
        ratingCount,
        image:
          productImage ||
          "https://via.placeholder.com/200x200/E5E7EB/9CA3AF?text=No+Image",
        brand: prod.brand,
        isFeatured: prod.is_featured || false,
        inStock: variants.some((v) => v.stock_quantity > 0),
        stockLevel: variants.reduce((sum, v) => sum + v.stock_quantity, 0),
      };
    });

    const responseData = {
      data,
      pagination: createPaginationResponse(count, page, limit)
    };
    
    // Cache the results
    await cacheUtils.set(cacheKey, responseData);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      fromCache: false,
      ...responseData
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// filepath: c:\Users\satyam singh\Desktop\vite-project\ElectronicsEcommerceProject\Backend\src\api\v1\controllers\admin\product.controller.js
const getProductsByCategoryAndBrand = async (req, res) => {
  try {
    const { category_id, brand_id } = req.params;
    const { page, limit, offset } = getPaginationParams(req);
    const cacheKey = `products:category:${category_id || 'all'}:brand:${brand_id || 'all'}:page:${page}:limit:${limit}`;
    
    // Check cache first
    const cachedData = await cacheUtils.get(cacheKey);
    if (cachedData) {
      return res.status(StatusCodes.OK).json({
        message: "Cached products by category and brand",
        fromCache: true,
        ...cachedData
      });
    }

    // Build the filter dynamically
    const filter = {};
    if (category_id) filter.category_id = category_id;
    if (brand_id) filter.brand_id = brand_id;

    const { count, rows: products } = await Product.findAndCountAll({
      limit,
      offset,
      where: filter,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["category_id", "name"],
        },
        { model: Brand, as: "brand", attributes: ["brand_id", "name"] },
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
      ],
    });

    const responseData = {
      data: products,
      pagination: createPaginationResponse(count, page, limit)
    };
    
    // Cache the results
    await cacheUtils.set(cacheKey, responseData);
    
    res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      fromCache: false,
      ...responseData
    });
  } catch (error) {
    console.error("Error fetching products by category and brand:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// ✅ Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.empty,
      });
    }

    // Get the user from the token
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.empty,
      });
    }

    // If category_id is provided, validate it
    if (req.body.category_id) {
      const category = await Category.findByPk(req.body.category_id);
      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Category not found",
        });
      }
    }

    // If brand_id is provided, validate it
    if (req.body.brand_id) {
      const brand = await Brand.findByPk(req.body.brand_id);
      if (!brand) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Brand not found",
        });
      }
    }

    // If name is changed and slug is not provided, update the slug
    if (req.body.name && !req.body.slug && req.body.name !== product.name) {
      req.body.slug = slugify(req.body.name, { lower: true });

      // Check if slug already exists
      const existingProduct = await Product.findOne({
        where: {
          slug: req.body.slug,
          product_id: { [Op.ne]: id },
        },
      });

      if (existingProduct) {
        // Append a random string to make it unique
        req.body.slug = `${req.body.slug}-${Math.random()
          .toString(36)
          .substring(2, 7)}`;
      }
    }

    // Update the product
    await product.update({
      ...req.body,
    });

    // Flush all cache after successful update
    await cacheUtils.flushAll();

    res.status(StatusCodes.OK).json({
      message: MESSAGE.put.succ,
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.put.fail,
      error: error.message,
    });
  }
};

// ✅ Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists and get related data
    const product = await Product.findByPk(id, {
      include: [
        {
          model: ProductVariant,
          as: "variants",
          attributes: ["base_variant_image_url"]
        },
        {
          model: ProductMedia,
          as: "productMedia",
          include: [{
            model: productMediaUrl,
            as: "productMediaUrl",
            attributes: ["product_media_url"]
          }]
        }
      ]
    });

    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: MESSAGE.get.none,
      });
    }

    // Collect all image paths to delete
    const imagesToDelete = [];

    // Add variant images
    if (product.variants) {
      product.variants.forEach(variant => {
        if (variant.base_variant_image_url) {
          imagesToDelete.push(variant.base_variant_image_url);
        }
      });
    }

    // Add product productMedia images
    if (product.productMedia) {
      product.productMedia.forEach(productMedia => {
        if (productMedia.productMediaUrl) {
          productMedia.productMediaUrl.forEach(mediaUrl => {
            if (mediaUrl.product_media_url) {
              imagesToDelete.push(mediaUrl.product_media_url);
            }
          });
        }
      });
    }

    // Delete associated images from filesystem FIRST
    if (imagesToDelete.length > 0) {
      deleteImages(imagesToDelete);
    }

    // Then delete the product (cascade will handle related records)
    await product.destroy();

    // Flush all cache after successful deletion
    await cacheUtils.flushAll();

    res.status(StatusCodes.OK).json({
      message: MESSAGE.delete.succ,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.delete.fail,
      error: error.message,
    });
  }
};

//get products by brand_id

const getProductsByBrandId = async (req, res) => {
  try {
    const { brand_id } = req.params;
    const { page, limit, offset } = getPaginationParams(req);
    const { search } = req.query;
    const cacheKey = `products:brand:${brand_id}:search:${search || 'none'}:page:${page}:limit:${limit}`;
    
    // Check cache first
    const cachedData = await cacheUtils.get(cacheKey);
    if (cachedData) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Cached products by brand",
        fromCache: true,
        ...cachedData
      });
    }

    // 1. Validate brand exists
    const brand = await Brand.findByPk(brand_id);
    if (!brand) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Brand not found" });
    }

    // 2. Build where conditions with search
    const whereConditions = { brand_id };
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { short_description: { [Op.like]: `%${search}%` } }
      ];
    }

    // 3. Fetch all products for this brand
    const { count, rows: products } = await Product.findAndCountAll({
      limit,
      offset,
      where: whereConditions,
      include: [
        { model: Category, as: "category", attributes: ["name"] },
        {
          model: ProductVariant,
          as: "variants",
          attributes: [
            "product_variant_id",
            "price",
            "stock_quantity",
            "base_variant_image_url",
          ],
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
          attributes: ["product_media_id", "media_type"],
          include: [
            {
              model: productMediaUrl,
              as: "productMediaUrl",
              attributes: ["product_media_url", "media_type"],
              where: { media_type: "image" }, // Only get images
              required: false,
            },
          ],
          required: false,
        },
        {
          model: Coupon,
          as: "coupons",
          where: {
            is_active: true,
            valid_from: { [Op.lte]: new Date() },
            valid_to: { [Op.gte]: new Date() },
          },
          required: false,
        },
        {
          model: DiscountRule,
          as: "discountRules",
          where: {
            is_active: true,
          },
          required: false,
        },
        { model: ProductReview, as: "reviews", attributes: ["rating"] },
        { model: OrderItem, as: "orderItems", attributes: ["order_item_id"] },
      ],
    });

    // 4. Map into desired shape
    const data = products.map((prod) => {
      const basePrice = parseFloat(prod.base_price);
      const coupons = prod.coupons || []; // Fixed: use correct alias
      const rules = prod.discountRules || []; // Fixed: use correct alias
      const variants = prod.variants || []; // Fixed: use correct alias
      const reviews = prod.reviews || []; // Fixed: use correct alias
      const orders = prod.orderItems || []; // Fixed: use correct alias
      const productMedia = prod.productMedia || []; // Product productMedia

      // console.log("basePrice:", basePrice);
      // console.log("Coupons:", coupons);
      // console.log("Rules:", rules);
      // console.log("Variants:", variants);
      // console.log("Reviews:", reviews);
      // console.log("Orders:", orders);
      // console.log("productMedia:", productMedia);

      // Find the LEAST discount coupon to show to user (smallest discount_value)
      let leastDiscountCoupon = null;
      coupons.forEach((c) => {
        if (
          !leastDiscountCoupon ||
          parseFloat(c.discount_value) <
          parseFloat(leastDiscountCoupon.discount_value)
        ) {
          leastDiscountCoupon = c;
        }
      });

      // Calculate discount based on type (percentage or fixed)
      let discountPercent = 0;
      let discountAmount = 0;

      if (leastDiscountCoupon) {
        if (leastDiscountCoupon.type === "percentage") {
          discountPercent = parseFloat(leastDiscountCoupon.discount_value);
          discountAmount = (basePrice * discountPercent) / 100;
        } else if (leastDiscountCoupon.type === "fixed") {
          discountAmount = parseFloat(leastDiscountCoupon.discount_value);
          discountPercent = (discountAmount / basePrice) * 100;
        }
      }

      const couponDesc = leastDiscountCoupon
        ? `${leastDiscountCoupon.discount_value}${leastDiscountCoupon.type === "percentage" ? "%" : ""
        } off with ${leastDiscountCoupon.code}`
        : null;

      // Retailer/bulk rule
      const retailerRule = rules.find((r) => r.rule_type === "retailer");
      const bulkRule = rules.find((r) => r.rule_type === "bulk");
      const stockLevelDetailed = retailerRule
        ? {
          minRetailerQty: retailerRule.min_retailer_quantity,
          bulkDiscountQty: bulkRule?.bulk_discount_quantity || null,
        }
        : null;

      // Stock & variant summary
      const inStock = variants.some((v) => v.stock_quantity > 0);
      const stockLevel = variants.reduce((sum, v) => sum + v.stock_quantity, 0);
      const totalVariants = variants.length;
      const hasVariants = totalVariants > 0;

      // Get real variant attributes from database
      const variantAttributes = [];
      variants.slice(0, 2).forEach((variant) => {
        if (variant.AttributeValues && variant.AttributeValues.length > 0) {
          variant.AttributeValues.forEach((attrValue) => {
            if (attrValue.Attribute) {
              variantAttributes.push(
                `${attrValue.Attribute.name}: ${attrValue.value}`
              );
            }
          });
        }
      });

      // Ratings
      const ratingCount = reviews.length;
      const rating = ratingCount
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
        : 0;

      // Wholesale example (20% off)
      const wholesalePrice = +(basePrice * 0.8).toFixed(2);

      // Final price calculation using discount amount
      let finalPrice = basePrice;
      if (discountAmount > 0) {
        finalPrice = +(basePrice - discountAmount).toFixed(2);
        // Ensure final price doesn't go below 0
        finalPrice = Math.max(finalPrice, 0);
      }

      // Get product image from productMediaUrl
      let productImage = null;

      if (productMedia && productMedia.length > 0) {
        // Find the first productMedia item that has productMediaUrl (note the capital U)
        const mediaWithUrl = productMedia.find(
          (m) => m.productMediaUrl && m.productMediaUrl.length > 0
        );
        if (mediaWithUrl) {
          productImage = mediaWithUrl.productMediaUrl[0].product_media_url;
        }
      }

      // Fallback to variant image if no product productMedia found
      if (!productImage && variants && variants.length > 0) {
        productImage = variants[0]?.base_variant_image_url || null;
      }

      // Convert relative path to full URL for response
      if (productImage && !productImage.startsWith("http")) {
        productImage = `${req.protocol}://${req.get(
          "host"
        )}/${productImage.replace(/\\/g, "/")}`;
      }

      return {
        id: prod.product_id,
        name: prod.name,
        category: prod.category.name,
        brand: brand.name,
        basePrice,
        finalPrice,
        discount: couponDesc,
        discountPercent,
        availableOffers: coupons.map((c) => c.code),
        rating: +rating.toFixed(1),
        ratingCount,
        shortDescription: prod.short_description,
        image: productImage, // From productMediaUrl table
        inStock,
        stockLevel,
        hasVariants,
        totalVariants,
        variantAttributes,
        isFeatured: prod.is_featured,

        // Retailer-specific data
        stockLevelDetailed,
        wholesalePrice,
        orderHistoryCount: orders.length,
      };
    });

    const responseData = {
      data,
      pagination: createPaginationResponse(count, page, limit)
    };
    
    // Cache the results
    await cacheUtils.set(cacheKey, responseData);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      fromCache: false,
      ...responseData
    });
  } catch (err) {
    console.error("getProductsByBrand error:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

export default {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategoryId,
  getProductsByCategoryAndBrand,
  updateProduct,
  deleteProduct,
  getProductsByBrandId,
};
