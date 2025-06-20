import db from "../../../../../models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../../constants/message.js";
import { Op } from "sequelize";

// Convert relative path to full URL for response
const convertToFullUrl = (imagePath, req) => {
  if (imagePath && !imagePath.startsWith("http")) {
    return `${req.protocol}://${req.get("host")}/${imagePath.replace(/\\/g, "/")}`;
  }
  return imagePath || "";
};

const {
  Cart,
  CartItem,
  Product,
  ProductVariant,
  Brand,
  Category,
  ProductMedia,
  ProductMediaUrl,
  VariantAttributeValue,
  AttributeValue,
  Attribute,
  User,
  Address,
  Coupon,
  ProductReview,
} = db;

// Helper function to calculate the best discount (quantity vs coupon)
const calculateBestDiscount = async (
  variantData,
  quantity,
  couponId = null
) => {
  const basePrice = parseFloat(variantData?.price || 0);

  // Validate inputs
  if (!variantData || isNaN(basePrice) || basePrice <= 0) {
    console.warn("Invalid variant data or price for discount calculation");
    return {
      discountValue: 0,
      discountType: null,
      discountSource: null,
      actualDiscountAmount: 0,
    };
  }

  if (!quantity || quantity <= 0) {
    console.warn("Invalid quantity for discount calculation:", quantity);
    return {
      discountValue: 0,
      discountType: null,
      discountSource: null,
      actualDiscountAmount: 0,
    };
  }

  // Calculate quantity-based discount
  const regularDiscountQty = variantData?.discount_quantity || 0;
  const regularDiscountPercent = parseFloat(
    variantData?.discount_percentage || 0
  );
  const bulkDiscountQty = variantData?.bulk_discount_quantity || 0;
  const bulkDiscountPercent = parseFloat(
    variantData?.bulk_discount_percentage || 0
  );

  let quantityDiscountValue = 0;
  let quantityDiscountType = null;

  if (quantity >= bulkDiscountQty && bulkDiscountQty > 0) {
    quantityDiscountValue = bulkDiscountPercent;
    quantityDiscountType = "percentage";
  } else if (quantity >= regularDiscountQty && regularDiscountQty > 0) {
    quantityDiscountValue = regularDiscountPercent;
    quantityDiscountType = "percentage";
  }

  // Calculate coupon discount if applied
  let couponDiscountValue = 0;
  let couponDiscountType = null;
  let couponData = null;

  if (couponId) {
    try {
      couponData = await Coupon.findByPk(couponId);
      if (couponData && couponData.is_active) {
        const discountValue = parseFloat(couponData.discount_value);
        if (!isNaN(discountValue) && discountValue > 0) {
          couponDiscountValue = discountValue;
          couponDiscountType = couponData.type; // "percentage" or "fixed"
        } else {
          console.warn(
            "Invalid coupon discount value:",
            couponData.discount_value
          );
        }
      } else {
        console.warn("Coupon not found or inactive:", couponId);
      }
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  }

  // Calculate actual discount amounts to compare
  let quantityDiscountAmount = 0;
  if (quantityDiscountType === "percentage") {
    quantityDiscountAmount = (basePrice * quantityDiscountValue) / 100;
  }

  let couponDiscountAmount = 0;
  if (couponDiscountType === "percentage") {
    couponDiscountAmount = (basePrice * couponDiscountValue) / 100;
  } else if (couponDiscountType === "fixed") {
    couponDiscountAmount = couponDiscountValue;
  }

  // Return the better discount
  if (couponDiscountAmount > quantityDiscountAmount) {
    return {
      discountValue: couponDiscountValue,
      discountType: couponDiscountType,
      discountSource: "coupon",
      actualDiscountAmount: couponDiscountAmount,
    };
  } else if (quantityDiscountAmount > 0) {
    return {
      discountValue: quantityDiscountValue,
      discountType: quantityDiscountType,
      discountSource: "quantity",
      actualDiscountAmount: quantityDiscountAmount,
    };
  }

  return {
    discountValue: 0,
    discountType: null,
    discountSource: null,
    actualDiscountAmount: 0,
  };
};

// Add item to cart
const addItemToCart = async (req, res) => {
  try {
    const { user_id } = req.user; // From JWT token
    const {
      cart_id,
      product_id,
      product_variant_id,
      total_quantity,
      price_at_time,
      final_price,
      discount_quantity,
      discount_applied,
      discount_type,
      coupon_id,
    } = req.body;

    // Verify cart belongs to user
    const cart = await Cart.findOne({
      where: { cart_id, user_id },
    });

    if (!cart) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Cart not found or does not belong to user",
      });
    }

    // Verify product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product not found",
      });
    }

    // Verify product variant if provided
    if (product_variant_id) {
      const variant = await ProductVariant.findOne({
        where: { product_variant_id, product_id },
      });
      if (!variant) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product variant not found or does not belong to product",
        });
      }
    }

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      where: {
        cart_id,
        product_id,
        product_variant_id: product_variant_id || null,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      existingItem.total_quantity += total_quantity;
      existingItem.discount_quantity = discount_quantity;
      existingItem.price_at_time = price_at_time;
      existingItem.discount_applied = discount_applied;
      existingItem.discount_type = discount_type;
      existingItem.final_price = final_price;
      existingItem.coupon_id = coupon_id || null;
      await existingItem.save();

      return res.status(StatusCodes.OK).json({
        message: "Item quantity updated in cart",
        data: existingItem,
      });
    }

    // Create new cart item
    const newCartItem = await CartItem.create({
      cart_id,
      product_id,
      product_variant_id,
      total_quantity,
      price_at_time,
      final_price,
      discount_quantity,
      discount_applied,
      discount_type,
      coupon_id: coupon_id || null,
    });

    res.status(StatusCodes.CREATED).json({
      message: MESSAGE.post.succ,
      data: newCartItem,
    });
  } catch (err) {
    console.error("❌ Error in addItemToCart:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.post.fail,
      error: err.message,
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { user_id } = req.user; // From JWT token
    const { cart_item_id } = req.params;
    const { total_quantity } = req.body;

    // Find cart item and verify it belongs to user's cart
    const cartItem = await CartItem.findOne({
      where: { cart_item_id },
      include: [
        {
          model: Cart,
          as: "cart",
          where: { user_id },
          required: true,
        },
        {
          model: Product,
          as: "product",
          required: true,
        },
        {
          model: ProductVariant,
          as: "variant",
          required: false,
        },
      ],
    });

    if (!cartItem) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Cart item not found or does not belong to user",
      });
    }

    // Update quantity
    cartItem.total_quantity = total_quantity;

    // Get variant data for discount calculations
    const variantData = cartItem.variant || cartItem.product;
    const basePrice = parseFloat(cartItem.price_at_time);

    // Use the calculateBestDiscount function to get the best available discount
    const bestDiscount = await calculateBestDiscount(
      variantData,
      total_quantity,
      cartItem.coupon_id
    );

    // Calculate final price based on best discount
    let discountedPrice = basePrice;
    if (bestDiscount.discountType === "percentage") {
      discountedPrice = basePrice * (1 - bestDiscount.discountValue / 100);
    } else if (bestDiscount.discountType === "fixed") {
      discountedPrice = Math.max(0, basePrice - bestDiscount.discountValue);
    }

    cartItem.final_price = discountedPrice * total_quantity;
    const actualDiscountAmount = (basePrice - discountedPrice) * total_quantity;

    // Update cart item with new discount values
    cartItem.discount_quantity =
      bestDiscount.discountSource === "quantity"
        ? bestDiscount.discountSource === "bulk_discount"
          ? variantData?.bulk_discount_quantity
          : variantData?.discount_quantity
        : null;
    cartItem.discount_applied = actualDiscountAmount; // Store actual discount amount
    cartItem.discount_type = bestDiscount.discountType;

    await cartItem.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.post.succ,
      data: cartItem,
    });
  } catch (err) {
    console.error("❌ Error in updateCartItem:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.put.fail,
      error: err.message,
    });
  }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
  try {
    const { user_id } = req.user; // From JWT token
    const { cart_item_id } = req.params;

    // Find cart item and verify it belongs to user's cart
    const cartItem = await CartItem.findOne({
      where: { cart_item_id },
      include: [
        {
          model: Cart,
          as: "cart",
          where: { user_id },
          required: true,
        },
      ],
    });

    if (!cartItem) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Cart item not found or does not belong to user",
      });
    }

    // Delete the cart item
    await cartItem.destroy();

    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.delete.succ,
    });
  } catch (err) {
    console.error("❌ Error in removeCartItem:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.delete.fail,
      error: err.message,
    });
  }
};

// Get all items in user's cart
const getCartItemsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Find user's cart with comprehensive includes
    const cart = await Cart.findOne({
      where: { user_id },
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "user_id",
            "name",
            "phone_number",
            "email",
            "profileImage_url",
            "role",
            "status",
            "current_address_id",
          ],
          include: [
            {
              model: Address,
              as: "addresses",
              attributes: [
                "address_id",
                "address_line1",
                "address_line2",
                "city",
                "state",
                "postal_code",
                "country",
                "is_default",
                "is_active",
              ],
              where: { is_active: true },
              required: false,
            },
          ],
        },
        {
          model: CartItem,
          as: "cartItems",
          include: [
            {
              model: Product,
              as: "product",
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
                  attributes: ["product_media_id", "media_type"],
                  include: [
                    {
                      model: ProductMediaUrl,
                      attributes: ["product_media_url"],
                    },
                  ],
                  limit: 1,
                  required: false,
                },
                {
                  model: ProductReview,
                  as: "reviews",
                  attributes: [
                    "product_review_id",
                    "user_id",
                    "rating",
                    "title",
                    "review",
                    "is_verified_purchase",
                    "createdAt",
                  ],
                  where: {
                    review_action: "approve",
                  },
                  include: [
                    {
                      model: User,
                      as: "reviewer",
                      attributes: ["user_id", "name"],
                    },
                  ],
                  required: false,
                  limit: 5, // Limit to recent 5 reviews
                  order: [["createdAt", "DESC"]],
                },
              ],
            },
            {
              model: ProductVariant,
              as: "variant",
              include: [
                {
                  model: ProductMedia,
                  attributes: ["product_media_id", "media_type"],
                  include: [
                    {
                      model: ProductMediaUrl,
                      attributes: ["product_media_url"],
                    },
                  ],
                  limit: 1,
                  required: false,
                },
                {
                  model: VariantAttributeValue,
                  as: "variantAttributeValues",
                  include: [
                    {
                      model: AttributeValue,
                      include: [
                        {
                          model: Attribute,
                          attributes: ["name", "data_type"],
                        },
                      ],
                    },
                  ],
                  required: false,
                },
                {
                  model: ProductReview,
                  attributes: [
                    "product_review_id",
                    "user_id",
                    "rating",
                    "title",
                    "review",
                    "is_verified_purchase",
                    "createdAt",
                  ],
                  where: {
                    review_action: "approve",
                  },
                  include: [
                    {
                      model: User,
                      as: "reviewer",
                      attributes: ["user_id", "name"],
                    },
                  ],
                  required: false,
                  limit: 3, // Limit to recent 3 variant reviews
                  order: [["createdAt", "DESC"]],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Cart not found",
      });
    }

    // Get available coupons for the user
    const availableCoupons = await Coupon.findAll({
      where: {
        is_active: true,
        valid_from: { [Op.lte]: new Date() },
        valid_to: { [Op.gte]: new Date() },
        target_role: {
          [Op.in]: ["both", cart.user.role],
        },
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
      ],
      limit: 10, // Limit to prevent too many coupons
    });

    // Transform the data to match frontend expectations
    const transformedCartItems = cart.cartItems.map((item) => {
      const product = item.product;
      const variant = item.variant;

      // Get main image - priority: variant base_variant_image_url > variant ProductMedia > product ProductMedia > default
      let mainImage = "/assets/shop.jpg"; // default fallback

      if (variant?.base_variant_image_url) {
        // First priority: variant's base_variant_image_url field
        mainImage = convertToFullUrl(variant.base_variant_image_url, req);
      } else if (
        variant?.ProductMedia?.[0]?.ProductMediaURLs?.[0]?.product_media_url
      ) {
        // Second priority: variant's ProductMedia URL
        mainImage = convertToFullUrl(
          variant.ProductMedia[0].ProductMediaURLs[0].product_media_url,
          req
        );
      } else if (
        product?.media?.[0]?.ProductMediaURLs?.[0]?.product_media_url
      ) {
        // Third priority: product's ProductMedia URL
        mainImage = convertToFullUrl(
          product.media[0].ProductMediaURLs[0].product_media_url,
          req
        );
      }

      // Parse variant attributes from VariantAttributeValue
      let variantAttributes = {};
      if (variant?.variantAttributeValues) {
        variant.variantAttributeValues.forEach((attrValue) => {
          if (attrValue.AttributeValue?.Attribute) {
            const attrName =
              attrValue.AttributeValue.Attribute.name.toLowerCase();
            const attrVal = attrValue.AttributeValue.value;
            variantAttributes[attrName] = attrVal;
          }
        });
      }

      // Calculate discount thresholds based on variant data
      const quantityDiscount =
        variant?.discount_quantity && variant?.discount_percentage
          ? {
              threshold: variant.discount_quantity,
              type: "percentage",
              value: parseFloat(variant.discount_percentage),
            }
          : null;

      const bulkDiscount =
        variant?.bulk_discount_quantity && variant?.bulk_discount_percentage
          ? {
              threshold: variant.bulk_discount_quantity,
              type: "percentage",
              value: parseFloat(variant.bulk_discount_percentage),
            }
          : null;

      // Calculate combined review count (product + variant reviews)
      const productReviewCount = product.reviews ? product.reviews.length : 0;
      const variantReviewCount = variant?.ProductReviews
        ? variant.ProductReviews.length
        : 0;
      const totalReviewCount = productReviewCount + variantReviewCount;

      // Calculate combined average rating
      let combinedRating = 0;
      if (totalReviewCount > 0) {
        const productRatingSum = product.reviews
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0)
          : 0;
        const variantRatingSum = variant?.ProductReviews
          ? variant.ProductReviews.reduce(
              (sum, review) => sum + review.rating,
              0
            )
          : 0;
        combinedRating =
          (productRatingSum + variantRatingSum) / totalReviewCount;
      }

      return {
        ...item.toJSON(),
        // Add missing fields that frontend expects
        min_order_quantity: variant?.min_retailer_quantity || 1,
        quantity_discount: quantityDiscount,
        bulk_discount: bulkDiscount,
        product: {
          ...product.toJSON(),
          mainImage,
          price: variant?.price || product.base_price,
          // Override rating_count with combined count
          rating_count: totalReviewCount,
          // Override rating_average with combined average
          rating_average: combinedRating.toFixed(1),
          variant: variant
            ? {
                ...variant.toJSON(),
                base_variant_image_url: (() => {
                  // Use same priority logic for variant image
                  if (variant.base_variant_image_url) {
                    return convertToFullUrl(variant.base_variant_image_url, req);
                  } else if (
                    variant?.ProductMedia?.[0]?.ProductMediaURLs?.[0]
                      ?.product_media_url
                  ) {
                    return convertToFullUrl(
                      variant.ProductMedia[0].ProductMediaURLs[0].product_media_url,
                      req
                    );
                  } else {
                    return mainImage;
                  }
                })(),
                attributes: variantAttributes,
              }
            : null,
        },
      };
    });

    // Get user's default address or first active address
    const defaultAddress =
      cart.user.addresses?.find((addr) => addr.is_default) ||
      cart.user.addresses?.[0] ||
      null;

    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: {
        cartItems: transformedCartItems,
        user: {
          user_id: cart.user.user_id,
          name: cart.user.name,
          email: cart.user.email,
          phone_number: cart.user.phone_number,
          profileImage_url: cart.user.profileImage_url,
          role: cart.user.role,
          status: cart.user.status,
        },
        selectedAddress: defaultAddress,
        availableAddresses: cart.user.addresses || [],
        availableCoupons: availableCoupons,
        cart: {
          cart_id: cart.cart_id,
          user_id: cart.user_id,
          createdAt: cart.createdAt,
          updatedAt: cart.updatedAt,
        },
      },
    });
  } catch (err) {
    console.error("❌ Error in getCartItems:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: err.message,
    });
  }
};

// FindOrCreate cart item - dedicated method for BuyNowPage
const findOrCreateCartItem = async (req, res) => {
  try {
    const { user_id } = req.user; // From JWT token
    const {
      cart_id,
      product_id,
      product_variant_id,
      total_quantity,
      price_at_time,
      final_price,
      discount_quantity,
      discount_applied,
      discount_type,
      coupon_id,
    } = req.body;

    // Verify cart belongs to user
    const cart = await Cart.findOne({
      where: { cart_id, user_id },
    });

    if (!cart) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Cart not found or does not belong to user",
        success: false,
      });
    }

    // Verify product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product not found",
        success: false,
      });
    }

    // Verify product variant if provided
    if (product_variant_id) {
      const variant = await ProductVariant.findOne({
        where: { product_variant_id, product_id },
      });
      if (!variant) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product variant not found or does not belong to product",
          success: false,
        });
      }
    }

    // Use Sequelize findOrCreate method
    const [cartItem, created] = await CartItem.findOrCreate({
      where: {
        cart_id,
        product_id,
        product_variant_id: product_variant_id || null,
      },
      defaults: {
        total_quantity,
        price_at_time,
        final_price,
        discount_quantity,
        discount_applied,
        discount_type,
        coupon_id: coupon_id || null,
      },
    });

    if (!created) {
      // Item already exists, update the quantity and other fields
      cartItem.total_quantity += total_quantity;
      cartItem.discount_quantity = discount_quantity;
      cartItem.price_at_time = price_at_time;
      cartItem.discount_applied = discount_applied;
      cartItem.discount_type = discount_type;
      cartItem.final_price = final_price;
      cartItem.coupon_id = coupon_id || null;
      await cartItem.save();

      return res.status(StatusCodes.OK).json({
        message: "Item quantity updated in cart",
        success: true,
        data: cartItem,
        created: false,
      });
    }

    // New item was created
    res.status(StatusCodes.CREATED).json({
      message: "Item added to cart successfully",
      success: true,
      data: cartItem,
      created: true,
    });
  } catch (err) {
    console.error("❌ Error in findOrCreateCartItem:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to add item to cart",
      success: false,
      error: err.message,
    });
  }
};

const getCartItemsByNumberByUserId = async (req, res) => {
  try {
    const { user_id } = req.user; // From JWT token

    // Find user's cart
    const cart = await Cart.findOne({
      where: { user_id },
      include: [
        {
          model: CartItem,
          as: "cartItems",
        },
      ],
    });

    if (!cart) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Cart not found",
        success: false,
      });
    }

    // Return the number of items in the cart
    const itemCount = cart.cartItems.length;

    res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: { itemCount },
    });
  } catch (err) {
    console.error("❌ Error in getCartItemsByNumberByUserId:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      success: false,
      error: err.message,
    });
  }
};

export default {
  addItemToCart,
  updateCartItem,
  removeCartItem,
  getCartItemsByUserId,
  findOrCreateCartItem,
  getCartItemsByNumberByUserId,
};
