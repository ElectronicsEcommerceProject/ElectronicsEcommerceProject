import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import db from "../../../../models/index.js";
import MESSAGE from "../../../../constants/message.js";

const { ProductVariant, Product, Category, Brand, Order, OrderItem, User, CartItem } = db;

/**
 * Get all product variants with stock data including reserved/sold quantities
 * @route GET /api/v1/admin/stock-management/stock-variants
 * @desc Get all product variants with related Product, Category, Brand data and calculated reserved/sold quantities
 * @access Private (Admin only)
 */
export const getAllProductVariantsWithStock = async (req, res) => {
  try {
    // console.log("🔄 Fetching all product variants with stock data...");

    // Get all product variants with related data
    const variants = await ProductVariant.findAll({
      include: [
        {
          model: Product,
          attributes: [
            "product_id",
            "name",
            "category_id",
            "brand_id",
            "base_price",
            "is_active",
            "is_featured",
          ],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["category_id", "name"],
            },
            {
              model: Brand,
              as: "brand",
              attributes: ["brand_id", "name"],
            },
          ],
        },
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "name", "email"],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    if (!variants || variants.length === 0) {
      return res.status(StatusCodes.OK).json({
        message: MESSAGE.get.empty,
        data: [],
      });
    }

    // console.log(`📦 Found ${variants.length} product variants`);

    // Calculate reserved and sold quantities for each variant
    const variantsWithCalculations = await Promise.all(
      variants.map(async (variant) => {
        try {
          // Calculate reserved quantity (pending + processing orders)
          const reservedResult = await OrderItem.findOne({
            attributes: [
              [
                db.sequelize.fn(
                  "COALESCE",
                  db.sequelize.fn("SUM", db.sequelize.col("total_quantity")),
                  0
                ),
                "reserved_quantity",
              ],
            ],
            where: {
              product_variant_id: variant.product_variant_id,
            },
            include: [
              {
                model: Order,
                as: "order",
                where: {
                  order_status: {
                    [Op.in]: ["pending", "processing"],
                  },
                },
                attributes: [],
              },
            ],
            raw: true,
          });

          // Calculate cart items quantity
          const cartItemsResult = await CartItem.findOne({
            attributes: [
              [
                db.sequelize.fn(
                  "COALESCE",
                  db.sequelize.fn("SUM", db.sequelize.col("total_quantity")),
                  0
                ),
                "cart_quantity",
              ],
            ],
            where: {
              product_variant_id: variant.product_variant_id,
            },
            raw: true,
          });

          // Calculate sold quantity (delivered orders)
          const soldResult = await OrderItem.findOne({
            attributes: [
              [
                db.sequelize.fn(
                  "COALESCE",
                  db.sequelize.fn("SUM", db.sequelize.col("total_quantity")),
                  0
                ),
                "sold_quantity",
              ],
            ],
            where: {
              product_variant_id: variant.product_variant_id,
            },
            include: [
              {
                model: Order,
                as: "order",
                where: {
                  order_status: "delivered",
                },
                attributes: [],
              },
            ],
            raw: true,
          });

          const reservedQuantity = parseInt(
            reservedResult?.reserved_quantity || 0
          );
          const cartQuantity = parseInt(
            cartItemsResult?.cart_quantity || 0
          );
          const soldQuantity = parseInt(soldResult?.sold_quantity || 0);
          const currentStock = parseInt(variant.stock_quantity || 0);
          const totalReserved = reservedQuantity + cartQuantity;
          const availableStock = Math.max(0, currentStock - totalReserved);

          // Calculate status
          const getStatus = (stock_quantity) => {
            if (stock_quantity <= 0) return "Out of Stock";
            if (stock_quantity < 5) return "Low";
            return "In Stock";
          };

          return {
            product_variant_id: variant.product_variant_id,
            product_id: variant.product_id,
            description: variant.description,
            short_description: variant.short_description,
            sku: variant.sku,
            price: parseFloat(variant.price || 0),
            stock_quantity: currentStock,
            base_variant_image_url: variant.base_variant_image_url,
            discount_quantity: variant.discount_quantity,
            discount_percentage: parseFloat(variant.discount_percentage || 0),
            min_retailer_quantity: variant.min_retailer_quantity,
            bulk_discount_quantity: variant.bulk_discount_quantity,
            bulk_discount_percentage: parseFloat(
              variant.bulk_discount_percentage || 0
            ),
            created_by: variant.created_by,
            updated_by: variant.updated_by,
            createdAt: variant.createdAt,
            updatedAt: variant.updatedAt,

            // Calculated quantities
            reserved: reservedQuantity,
            cartItems: cartQuantity,
            sold: soldQuantity,
            availableStock: availableStock,
            status: getStatus(availableStock),

            // Product information for easier frontend access
            product_name: variant.Product?.name || "Unknown Product",
            category_name:
              variant.Product?.category?.name || "Unknown Category",
            brand_name: variant.Product?.brand?.name || "Unknown Brand",
            category_id: variant.Product?.category_id,
            brand_id: variant.Product?.brand_id,
            base_price: parseFloat(variant.Product?.base_price || 0),
            is_active: variant.Product?.is_active || false,
            is_featured: variant.Product?.is_featured || false,

            // Include related data
            Product: variant.Product,
            creator: variant.creator,
          };
        } catch (error) {
          console.error(
            `❌ Error calculating quantities for variant ${variant.product_variant_id}:`,
            error
          );

          // Return variant with zero calculations if error occurs
          return {
            ...variant.toJSON(),
            reserved: 0,
            cartItems: 0,
            sold: 0,
            availableStock: variant.stock_quantity || 0,
            status: variant.stock_quantity > 0 ? "In Stock" : "Out of Stock",
            product_name: variant.Product?.name || "Unknown Product",
            category_name:
              variant.Product?.category?.name || "Unknown Category",
            brand_name: variant.Product?.brand?.name || "Unknown Brand",
            price: parseFloat(variant.price || 0),
          };
        }
      })
    );

    // console.log(`✅ Successfully calculated stock data for ${variantsWithCalculations.length} variants`);

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: variantsWithCalculations,
    });
  } catch (error) {
    console.error("❌ Error fetching product variants with stock:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

/**
 * Update stock quantity for a specific product variant
 * @route PUT /api/v1/admin/stock-management/stock-variants/:variant_id
 * @desc Update stock quantity for a specific product variant
 * @access Private (Admin only)
 */
export const updateProductVariantStock = async (req, res) => {
  try {
    const { variant_id } = req.params;
    const { stock_quantity } = req.body;

    // console.log(`🔄 Updating stock for variant ${variant_id} to ${stock_quantity}`);

    // Validate input
    if (stock_quantity === undefined || stock_quantity === null) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "stock_quantity is required",
      });
    }

    if (stock_quantity < 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Stock quantity cannot be negative",
      });
    }

    // Check if variant exists
    const variant = await ProductVariant.findByPk(variant_id, {
      include: [
        {
          model: Product,
          attributes: ["product_id", "name", "category_id", "brand_id"],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["category_id", "name"],
            },
            {
              model: Brand,
              as: "brand",
              attributes: ["brand_id", "name"],
            },
          ],
        },
      ],
    });

    if (!variant) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product variant not found",
      });
    }

    // Get the user from the token for audit trail
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
      });
    }

    // Update the stock quantity
    const oldStockQuantity = variant.stock_quantity;
    await variant.update({
      stock_quantity: parseInt(stock_quantity),
      updated_by: user.user_id,
    });

    // console.log(`✅ Stock updated for variant ${variant_id}: ${oldStockQuantity} → ${stock_quantity}`);

    // Get updated variant with calculations
    const updatedVariant = await ProductVariant.findByPk(variant_id, {
      include: [
        {
          model: Product,
          attributes: [
            "product_id",
            "name",
            "category_id",
            "brand_id",
            "base_price",
            "is_active",
            "is_featured",
          ],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["category_id", "name"],
            },
            {
              model: Brand,
              as: "brand",
              attributes: ["brand_id", "name"],
            },
          ],
        },
        {
          model: User,
          as: "updater",
          attributes: ["user_id", "name", "email"],
        },
      ],
    });

    // Calculate reserved, cart, and sold quantities for the updated variant
    const [reservedResult, cartItemsResult, soldResult] = await Promise.all([
      // Reserved quantity
      OrderItem.findOne({
        attributes: [
          [
            db.sequelize.fn(
              "COALESCE",
              db.sequelize.fn("SUM", db.sequelize.col("total_quantity")),
              0
            ),
            "reserved_quantity",
          ],
        ],
        where: { product_variant_id: variant_id },
        include: [
          {
            model: Order,
            as: "order",
            where: { order_status: { [Op.in]: ["pending", "processing"] } },
            attributes: [],
          },
        ],
        raw: true,
      }),

      // Cart items quantity
      CartItem.findOne({
        attributes: [
          [
            db.sequelize.fn(
              "COALESCE",
              db.sequelize.fn("SUM", db.sequelize.col("total_quantity")),
              0
            ),
            "cart_quantity",
          ],
        ],
        where: { product_variant_id: variant_id },
        raw: true,
      }),

      // Sold quantity
      OrderItem.findOne({
        attributes: [
          [
            db.sequelize.fn(
              "COALESCE",
              db.sequelize.fn("SUM", db.sequelize.col("total_quantity")),
              0
            ),
            "sold_quantity",
          ],
        ],
        where: { product_variant_id: variant_id },
        include: [
          {
            model: Order,
            as: "order",
            where: { order_status: "delivered" },
            attributes: [],
          },
        ],
        raw: true,
      }),
    ]);

    const reservedQuantity = parseInt(reservedResult?.reserved_quantity || 0);
    const cartQuantity = parseInt(cartItemsResult?.cart_quantity || 0);
    const soldQuantity = parseInt(soldResult?.sold_quantity || 0);
    const currentStock = parseInt(updatedVariant.stock_quantity || 0);
    const totalReserved = reservedQuantity + cartQuantity;
    const availableStock = Math.max(0, currentStock - totalReserved);

    // Calculate status
    const getStatus = (stock_quantity) => {
      if (stock_quantity <= 0) return "Out of Stock";
      if (stock_quantity < 5) return "Low";
      return "In Stock";
    };

    const responseData = {
      product_variant_id: updatedVariant.product_variant_id,
      product_id: updatedVariant.product_id,
      sku: updatedVariant.sku,
      price: parseFloat(updatedVariant.price || 0),
      stock_quantity: currentStock,
      old_stock_quantity: oldStockQuantity,
      reserved: reservedQuantity,
      cartItems: cartQuantity,
      sold: soldQuantity,
      availableStock: availableStock,
      status: getStatus(availableStock),
      product_name: updatedVariant.Product?.name || "Unknown Product",
      category_name:
        updatedVariant.Product?.category?.name || "Unknown Category",
      brand_name: updatedVariant.Product?.brand?.name || "Unknown Brand",
      updatedAt: updatedVariant.updatedAt,
      updated_by: updatedVariant.updated_by,
      updater: updatedVariant.updater,
    };

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.put.succ,
      data: responseData,
    });
  } catch (error) {
    console.error("❌ Error updating product variant stock:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.put.fail,
      error: error.message,
    });
  }
};

/**
 * Get stock analytics summary
 * @route GET /api/v1/admin/stock-management/stock-analytics
 * @desc Get summary statistics (total variants, in stock, low stock, out of stock, total stock value)
 * @access Private (Admin only)
 */
export const getStockAnalytics = async (req, res) => {
  try {
    // console.log("🔄 Calculating stock analytics...");

    // Get all product variants with basic data
    const variants = await ProductVariant.findAll({
      attributes: ["product_variant_id", "stock_quantity", "price"],
      include: [
        {
          model: Product,
          attributes: ["product_id", "name", "is_active"],
        },
      ],
    });

    if (!variants || variants.length === 0) {
      return res.status(StatusCodes.OK).json({
        message: MESSAGE.get.succ,
        data: {
          totalVariants: 0,
          inStock: 0,
          lowStock: 0,
          outStock: 0,
          reservedItems: 0,
          soldItems: 0,
          totalStockValue: 0,
          activeProducts: 0,
          inactiveProducts: 0,
        },
      });
    }

    // Calculate reserved and cart quantities for all variants in bulk
    const [reservedResults, cartResults] = await Promise.all([
      OrderItem.findAll({
        attributes: [
          "product_variant_id",
          [
            db.sequelize.fn("SUM", db.sequelize.col("total_quantity")),
            "reserved_quantity",
          ],
        ],
        include: [
          {
            model: Order,
            as: "order",
            where: { order_status: { [Op.in]: ["pending", "processing"] } },
            attributes: [],
          },
        ],
        group: ["product_variant_id"],
        raw: true,
      }),

      CartItem.findAll({
        attributes: [
          "product_variant_id",
          [
            db.sequelize.fn("SUM", db.sequelize.col("total_quantity")),
            "cart_quantity",
          ],
        ],
        group: ["product_variant_id"],
        raw: true,
      }),
    ]);

    // Calculate sold quantities for all variants in bulk
    const soldResults = await OrderItem.findAll({
      attributes: [
        "product_variant_id",
        [
          db.sequelize.fn("SUM", db.sequelize.col("total_quantity")),
          "sold_quantity",
        ],
      ],
      include: [
        {
          model: Order,
          as: "order",
          where: { order_status: "delivered" },
          attributes: [],
        },
      ],
      group: ["product_variant_id"],
      raw: true,
    });

    // Create lookup maps for reserved, cart, and sold quantities
    const reservedMap = {};
    const cartMap = {};
    const soldMap = {};

    reservedResults.forEach((result) => {
      reservedMap[result.product_variant_id] = parseInt(
        result.reserved_quantity || 0
      );
    });

    cartResults.forEach((result) => {
      cartMap[result.product_variant_id] = parseInt(
        result.cart_quantity || 0
      );
    });

    soldResults.forEach((result) => {
      soldMap[result.product_variant_id] = parseInt(result.sold_quantity || 0);
    });

    // Calculate analytics
    let totalVariants = 0;
    let inStock = 0;
    let lowStock = 0;
    let outStock = 0;
    let totalReservedItems = 0;
    let totalCartItems = 0;
    let totalSoldItems = 0;
    let totalStockValue = 0;
    let activeProducts = 0;
    let inactiveProducts = 0;

    variants.forEach((variant) => {
      const stockQuantity = parseInt(variant.stock_quantity || 0);
      const price = parseFloat(variant.price || 0);
      const reserved = reservedMap[variant.product_variant_id] || 0;
      const cartItems = cartMap[variant.product_variant_id] || 0;
      const sold = soldMap[variant.product_variant_id] || 0;
      const totalReserved = reserved + cartItems;
      const availableStock = Math.max(0, stockQuantity - totalReserved);

      totalVariants++;
      totalReservedItems += reserved;
      totalCartItems += cartItems;
      totalSoldItems += sold;
      totalStockValue += stockQuantity * price;

      // Count active/inactive products
      if (variant.Product?.is_active) {
        activeProducts++;
      } else {
        inactiveProducts++;
      }

      // Categorize by stock status (based on available stock)
      if (availableStock <= 0) {
        outStock++;
      } else if (availableStock < 5) {
        lowStock++;
      } else {
        inStock++;
      }
    });

    const analytics = {
      totalVariants,
      inStock,
      lowStock,
      outStock,
      reservedItems: totalReservedItems,
      cartItems: totalCartItems,
      soldItems: totalSoldItems,
      totalStockValue: Math.round(totalStockValue * 100) / 100, // Round to 2 decimal places
      activeProducts,
      inactiveProducts,

      // Additional useful metrics
      stockUtilization:
        totalVariants > 0 ? Math.round((inStock / totalVariants) * 100) : 0,
      lowStockPercentage:
        totalVariants > 0 ? Math.round((lowStock / totalVariants) * 100) : 0,
      outOfStockPercentage:
        totalVariants > 0 ? Math.round((outStock / totalVariants) * 100) : 0,
      averageStockValue:
        totalVariants > 0
          ? Math.round((totalStockValue / totalVariants) * 100) / 100
          : 0,

      // Timestamps
      calculatedAt: new Date().toISOString(),
      currency: "INR",
    };

    // console.log(`✅ Stock analytics calculated: ${totalVariants} variants, ₹${totalStockValue.toFixed(2)} total value`);

    return res.status(StatusCodes.OK).json({
      message: MESSAGE.get.succ,
      data: analytics,
    });
  } catch (error) {
    console.error("❌ Error calculating stock analytics:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

// Export all functions
export default {
  getAllProductVariantsWithStock,
  updateProductVariantStock,
  getStockAnalytics,
};
