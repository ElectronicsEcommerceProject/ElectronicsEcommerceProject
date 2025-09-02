import db from "../../../../models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../constants/message.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Sequelize from "sequelize";
import { deleteImages } from "../../../../utils/imageUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const {
  Category,
  Brand,
  Product,
  ProductVariant,
  Attribute,
  AttributeValue,
  VariantAttributeValue,
  ProductMedia,
  productMediaUrl,
  User,
  CartItem,
  WishlistItem,
  OrderItem,
  StockAlert,
  ProductReview,
  DiscountRule,
  Coupon,
} = db;

/**
 * Retrieves product management data for the admin dashboard
 * - Categories with target roles
 * - Brands with slugs
 * - Products with their categories and brands
 * - Product Variants with SKUs and product references
 * - Product Attributes with types
 * - Attribute Values with their attributes
 * - Variant Attribute Value mappings with complete relationship data
 */
const getProductManagementData = async (req, res) => {
  try {
    // Fetch all required data in parallel for performance
    const [
      categories,
      brands,
      products,
      productVariants,
      productAttributes,
      attributeValues,
      variantAttributeValues,
      productMedia,
    ] = await Promise.all([
      // 1. Categories
      Category.findAll({
        attributes: ["category_id", "name", "slug", "target_role"],
      }),

      // 2. Brands
      Brand.findAll({
        attributes: ["brand_id", "name", "slug"],
      }),

      // 3. Products with their Category and Brand
      Product.findAll({
        attributes: [
          "product_id",
          "name",
          "slug",
          "description",
          "base_price",
          "rating_average",
          "category_id",
          "brand_id",
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
            attributes: ["brand_id", "name", "slug"],
          },
        ],
      }),

      // 4. Product Variants with their Product
      ProductVariant.findAll({
        attributes: [
          "product_variant_id",
          "sku",
          "price",
          "description",
          "stock_quantity",
          "discount_percentage",
          "discount_quantity",
          "min_retailer_quantity",
          "bulk_discount_percentage",
          "bulk_discount_quantity",
          "product_id",
        ],
        include: [
          {
            model: Product,
            attributes: ["product_id", "name"],
          },
        ],
      }),

      // 5. Product Attributes
      Attribute.findAll({
        attributes: ["product_attribute_id", "name", "data_type"],
      }),

      // 6. Attribute Values with their Attribute
      AttributeValue.findAll({
        attributes: [
          "product_attribute_value_id",
          "value",
          "product_attribute_id",
        ],
        include: [
          {
            model: Attribute,
            attributes: ["product_attribute_id", "name"],
          },
        ],
      }),

      // 7. Variant Attribute Value mappings with complete relationship data
      VariantAttributeValue.findAll({
        attributes: [
          "variant_attribute_value_id",
          "product_variant_id",
          "product_attribute_value_id",
        ],
        include: [
          {
            model: ProductVariant,
            attributes: ["product_variant_id", "sku", "product_id"],
            include: [
              {
                model: Product,
                attributes: ["product_id", "name", "category_id", "brand_id"],
              },
            ],
          },
          {
            model: AttributeValue,
            attributes: [
              "product_attribute_value_id",
              "value",
              "product_attribute_id",
            ],
            include: [
              {
                model: Attribute,
                attributes: ["product_attribute_id", "name"],
              },
            ],
          },
        ],
      }),

      // 8. Product Media with URLs
      ProductMedia.findAll({
        attributes: [
          "product_media_id",
          "product_id",
          "product_variant_id",
          "media_type",
        ],
        include: [
          {
            model: productMediaUrl,
            as: "productMediaUrl",
            attributes: ["product_media_url", "media_type"],
          },
        ],
      }),
    ]);

    // Create a mapping of product_attribute_id to products that use it
    // This helps us know which attributes are used by which products
    const attributeToProductMap = {};

    // Process variant attribute values to build the attribute-product relationship
    variantAttributeValues.forEach((vav) => {
      const productId = vav.ProductVariant.Product.product_id;
      const attributeId = vav.AttributeValue.product_attribute_id;

      if (!attributeToProductMap[attributeId]) {
        attributeToProductMap[attributeId] = new Set();
      }
      attributeToProductMap[attributeId].add(productId);
    });

    // Format the response to use model field names
    const response = {
      categories: categories.map((category) => ({
        category_id: category.category_id,
        name: category.name,
        slug: category.slug,
        target_role: category.target_role,
        // Add products that belong to this category for easy filtering
        product_ids: products
          .filter((product) => product.category_id === category.category_id)
          .map((product) => product.product_id),
      })),

      brands: brands.map((brand) => ({
        brand_id: brand.brand_id,
        name: brand.name,
        slug: brand.slug,
        // Add products that belong to this brand for easy filtering
        product_ids: products
          .filter((product) => product.brand_id === brand.brand_id)
          .map((product) => product.product_id),
      })),

      products: products.map((product) => {
        // Find media for this product
        const media = productMedia.find(
          (m) => m.product_id === product.product_id
        );
        const mediaUrl =
          media?.productMediaUrl?.[0]?.product_media_url || null;

        return {
          id: product.product_id,
          product_id: product.product_id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.description,
          basePrice: product.base_price,
          finalPrice: product.base_price,
          base_price: product.base_price,
          rating: product.rating_average || 0,
          rating_average: product.rating_average,
          ratingCount: 0,
          category: product.category.name,
          category_id: product.category.category_id,
          category_name: product.category.name,
          brand: product.brand.name,
          brand_id: product.brand.brand_id,
          brand_name: product.brand.name,
          brand_slug: product.brand.slug,
          image: mediaUrl
            ? `${process.env.BASE_URL || "http://localhost:3000"}/${mediaUrl}`
            : "/default-product-image.jpg",
          inStock: true,
          stockLevel: 10,
          discountPercent: 0,
          wholesalePrice: product.base_price * 0.8,
          isFeatured: false,
          availableOffers: [],
        };
      }),

      variants: productVariants.map((variant) => ({
        product_variant_id: variant.product_variant_id,
        product_id: variant.product_id,
        product_name: variant.Product.name,
        sku: variant.sku,
        price: variant.price,
        description: variant.description,
        stock_quantity: variant.stock_quantity,
        discount_percentage: variant.discount_percentage,
        discount_quantity: variant.discount_quantity,
        min_retailer_quantity: variant.min_retailer_quantity,
        bulk_discount_percentage: variant.bulk_discount_percentage,
        bulk_discount_quantity: variant.bulk_discount_quantity,
      })),

      attributes: productAttributes.map((attr) => ({
        product_attribute_id: attr.product_attribute_id,
        name: attr.name,
        data_type: attr.data_type,
      })),

      attributeValues: attributeValues.map((attrValue) => {
        // Find products that use this attribute value through variant attribute values
        const productIds = variantAttributeValues
          .filter(
            (vav) =>
              vav.product_attribute_value_id ===
              attrValue.product_attribute_value_id
          )
          .map((vav) => vav.ProductVariant.Product.product_id);

        return {
          product_attribute_value_id: attrValue.product_attribute_value_id,
          product_attribute_id: attrValue.product_attribute_id,
          attribute_name: attrValue.Attribute.name,
          value: attrValue.value,
          // Add products that use this attribute value for easy filtering
          product_ids: [...new Set(productIds)],
        };
      }),

      media: productMedia.map((media) => ({
        product_media_id: media.product_media_id,
        product_id: media.product_id,
        product_variant_id: media.product_variant_id,
        media_type: media.media_type,
        urls:
          media.productMediaUrl?.map((url) => ({
            product_media_url: url.product_media_url,
            media_type: url.media_type,
          })) || [],
      })),
    };

    return res.status(StatusCodes.OK).json({
      success: true,
      message: MESSAGE.get.succ,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching product management data:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.get.fail,
      error: error.message,
    });
  }
};

const addProductManagmentData = async (req, res) => {
  let productImageUrl = null;

  try {
    // Get the user from the token
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: MESSAGE.post.empty,
      });
    }

    // Parse JSON strings if they're coming from form-data
    let {
      category,
      brand,
      product,
      variant,
      attributeValue,
      media,
      newFormData,
    } = req.body;
    try {
      if (typeof category === "string") category = JSON.parse(category);
      if (typeof brand === "string") brand = JSON.parse(brand);
      if (typeof product === "string") product = JSON.parse(product);
      if (typeof variant === "string") variant = JSON.parse(variant);
      if (typeof attributeValue === "string")
        attributeValue = JSON.parse(attributeValue);
      if (typeof media === "string") media = JSON.parse(media);
      if (typeof newFormData === "string")
        newFormData = JSON.parse(newFormData);
    } catch (parseError) {
      console.error("Error parsing form data:", parseError);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid JSON in form data",
        error: parseError.message,
      });
    }

    // Validate required fields (media is now part of product)
    if (!category || !brand || !product || !variant || !attributeValue) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const created_by = user.user_id;

    // Handle file uploads - req.files is available from the upload middleware
    if (req.files) {
      if (req.files.media_file) {
        productImageUrl = `uploads/product_images/${req.files.media_file[0].filename}`;
      }
    } else if (req.file) {
      // Fallback for single file upload
      productImageUrl = `uploads/product_images/${req.file.filename}`;
    }

    // Use transaction to ensure data consistency
    const result = await db.sequelize.transaction(async (t) => {
      // Step 1: Create or find Category
      let categoryRecord;

      // Check if category exists by name
      let existingCategory = await Category.findOne({
        where: { name: category.name },
        transaction: t,
      });

      if (existingCategory) {
        categoryRecord = existingCategory;
      } else {
        categoryRecord = await Category.create(
          {
            name: category.name,
            slug:
              category.slug || category.name.toLowerCase().replace(/\s+/g, "-"),
            target_role: category.target_role || "both",
            created_by,
          },
          { transaction: t }
        );
      }

      // Step 2: Create or find Brand
      let brandRecord;

      // Check if brand exists by name
      let existingBrand = await Brand.findOne({
        where: { name: brand.name },
        transaction: t,
      });

      if (existingBrand) {
        brandRecord = existingBrand;
      } else {
        brandRecord = await Brand.create(
          {
            name: brand.name,
            slug: brand.slug || brand.name.toLowerCase().replace(/\s+/g, "-"),
            created_by,
          },
          { transaction: t }
        );
      }

      // Step 3: Create or find Product
      let productRecord;

      // Check if product exists by name
      let existingProduct = await Product.findOne({
        where: { name: product.name },
        transaction: t,
      });

      if (existingProduct) {
        productRecord = existingProduct;
      } else {
        productRecord = await Product.create(
          {
            name: product.name,
            slug:
              product.slug || product.name.toLowerCase().replace(/\s+/g, "-"),
            description: product.description,
            base_price: product.base_price,
            rating_average: product.average_rating || 0,
            category_id: categoryRecord.category_id,
            brand_id: brandRecord.brand_id,
            created_by,
          },
          { transaction: t }
        );
      }

      // Step 4: Create or find Product Variant
      let productVariantRecord;

      // Prepare variant image URL
      const variantImageUrl = req.files?.variant_media_file
        ? `uploads/product_images/${req.files.variant_media_file[0].filename}`
        : null;

      // Check if variant exists by SKU
      let existingProductVariant = await ProductVariant.findOne({
        where: { sku: variant.sku },
        transaction: t,
      });

      if (existingProductVariant) {
        productVariantRecord = existingProductVariant;
        // Update variant image if new one is provided
        if (variantImageUrl) {
          await productVariantRecord.update(
            { base_variant_image_url: variantImageUrl },
            { transaction: t }
          );
        }
      } else {
        productVariantRecord = await ProductVariant.create(
          {
            product_id: productRecord.product_id,
            sku: variant.sku.toLowerCase(),
            price: variant.price,
            description: variant.description,
            stock_quantity: variant.stock_quantity,
            discount_percentage: variant.discount_percentage,
            discount_quantity: variant.discount_quantity,
            min_retailer_quantity: variant.min_retailer_quantity,
            bulk_discount_percentage: variant.bulk_discount_percentage,
            bulk_discount_quantity: variant.bulk_discount_quantity,
            base_variant_image_url: variantImageUrl,
            created_by,
          },
          { transaction: t }
        );
      }

      // Step 5: Create or find Attribute
      let attributeRecord;

      // Check if attribute exists by name
      let existingAttribute = await Attribute.findOne({
        where: { name: attributeValue.attribute_name },
        transaction: t,
      });

      if (existingAttribute) {
        attributeRecord = existingAttribute;
      } else {
        attributeRecord = await Attribute.create(
          {
            name: attributeValue.attribute_name,
            data_type: attributeValue.type || "text",
            created_by,
          },
          { transaction: t }
        );
      }

      // Step 6: Create or find Attribute Value
      let attributeValueRecord;

      // Check if attribute value exists by value and attribute ID
      let existingAttributeValue = await AttributeValue.findOne({
        where: {
          product_attribute_id: attributeRecord.product_attribute_id,
          value: attributeValue.value,
        },
        transaction: t,
      });

      if (existingAttributeValue) {
        attributeValueRecord = existingAttributeValue;
      } else {
        attributeValueRecord = await AttributeValue.create(
          {
            product_attribute_id: attributeRecord.product_attribute_id,
            value: attributeValue.value,
            created_by,
          },
          { transaction: t }
        );
      }

      // Step 7: Create or find Variant Attribute Value mapping
      let variantAttributeValueRecord;

      // Check if mapping already exists
      let existingVariantAttributeValue = await VariantAttributeValue.findOne({
        where: {
          product_variant_id: productVariantRecord.product_variant_id,
          product_attribute_value_id:
            attributeValueRecord.product_attribute_value_id,
        },
        transaction: t,
      });

      if (existingVariantAttributeValue) {
        variantAttributeValueRecord = existingVariantAttributeValue;
      } else {
        variantAttributeValueRecord = await VariantAttributeValue.create(
          {
            product_variant_id: productVariantRecord.product_variant_id,
            product_attribute_value_id:
              attributeValueRecord.product_attribute_value_id,
            created_by,
          },
          { transaction: t }
        );
      }

      // Step 8: Create or find Product Media (media data is now in product object)
      let productMediaRecord;

      // Check if media already exists for this product/variant
      let existingProductMedia = await ProductMedia.findOne({
        where: {
          product_id: productRecord.product_id,
          product_variant_id: productVariantRecord.product_variant_id,
        },
        transaction: t,
      });

      if (existingProductMedia) {
        productMediaRecord = existingProductMedia;
      } else {
        productMediaRecord = await ProductMedia.create(
          {
            product_id: productRecord.product_id,
            product_variant_id: productVariantRecord.product_variant_id,
            media_type: product?.media_type || media?.media_type || "image",
            created_by,
          },
          { transaction: t }
        );
      }

      // Step 9: Create or update Product Media URL only if media is provided
      let productMediaUrlRecord = null;

      if (productImageUrl || media?.media_file?.fileName) {
        const mediaUrl =
          productImageUrl ||
          `uploads/product_images/${media.media_file.fileName}`;

        // Check if productMediaUrl already exists for this ProductMedia
        const existingproductMediaUrl = await productMediaUrl.findOne({
          where: { product_media_id: productMediaRecord.product_media_id },
          transaction: t,
        });

        if (existingproductMediaUrl) {
          // Update existing productMediaUrl
          await existingproductMediaUrl.update(
            {
              product_media_url: mediaUrl,
              media_type: product?.media_type || media?.media_type || "image",
            },
            { transaction: t }
          );
          productMediaUrlRecord = existingproductMediaUrl;
        } else {
          // Create new productMediaUrl
          productMediaUrlRecord = await productMediaUrl.create(
            {
              product_media_id: productMediaRecord.product_media_id,
              product_media_url: mediaUrl,
              media_type: product?.media_type || media?.media_type || "image",
              created_by,
            },
            { transaction: t }
          );
        }
      }

      // Return all created/found records
      return {
        category: categoryRecord,
        brand: brandRecord,
        product: productRecord,
        variant: productVariantRecord,
        attribute: attributeRecord,
        attributeValue: attributeValueRecord,
        variantAttributeValue: variantAttributeValueRecord,
        productMedia: productMediaRecord,
        productMediaUrl: productMediaUrlRecord,
      };
    });

    // Convert relative paths to full URLs for response
    if (
      result.productMediaUrl &&
      result.productMediaUrl.product_media_url &&
      !result.productMediaUrl.product_media_url.startsWith("http")
    ) {
      result.productMediaUrl.product_media_url = `${req.protocol}://${req.get(
        "host"
      )}/${result.productMediaUrl.product_media_url.replace(/\\/g, "/")}`;
    }

    // Convert variant image URL to full URL
    if (
      result.variant.base_variant_image_url &&
      !result.variant.base_variant_image_url.startsWith("http")
    ) {
      result.variant.base_variant_image_url = `${req.protocol}://${req.get(
        "host"
      )}/${result.variant.base_variant_image_url.replace(/\\/g, "/")}`;
    }

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: MESSAGE.post.succ,
      data: result,
    });
  } catch (error) {
    console.error("Error adding product management data:", error);

    // If there was an error and we uploaded files, clean them up
    if (req.files) {
      if (req.files.media_file && req.files.media_file[0]) {
        try {
          const filePath = req.files.media_file[0].path;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("🗑 Product media file deleted due to error:", filePath);
          }
        } catch (cleanupError) {
          console.error("Error cleaning up product media file:", cleanupError);
        }
      }
      if (req.files.variant_media_file && req.files.variant_media_file[0]) {
        try {
          const filePath = req.files.variant_media_file[0].path;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("🗑 Variant media file deleted due to error:", filePath);
          }
        } catch (cleanupError) {
          console.error("Error cleaning up variant media file:", cleanupError);
        }
      }
    } else if (req.file && productImageUrl) {
      try {
        const filePath = req.file.path;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("🗑 Uploaded file deleted due to error:", filePath);
        }
      } catch (cleanupError) {
        console.error("Error cleaning up file:", cleanupError);
      }
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.post.fail,
      error: error.message,
    });
  }
};

const deleteProductManagementData = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    let formattedData = data.toLowerCase().replace(/\s+/g, "-");



    if (formattedData == "attribute-values") {
      const product_attribute_value_id = id;
      // First, check if the attribute value exists
      const attributeValue = await AttributeValue.findByPk(
        product_attribute_value_id
      );
      if (!attributeValue) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: MESSAGE.delete.fail,
        });
      }
      // Use a transaction to ensure data consistency
      await db.sequelize.transaction(async (t) => {
        // Step 1: Find and delete all variant attribute value mappings that reference this attribute value
        await VariantAttributeValue.destroy({
          where: { product_attribute_value_id },
          transaction: t,
        });
        // Step 2: Delete the attribute value itself
        await attributeValue.destroy({ transaction: t });
      });
      return res.status(StatusCodes.OK).json({
        success: true,
        message: MESSAGE.delete.succ,
      });
    } else if (formattedData == "product-variants") {
      const product_variant_id = id;

      // First, check if the product variant exists
      const productVariant = await ProductVariant.findByPk(product_variant_id);
      if (!productVariant) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Product variant not found",
        });
      }

      // Use a transaction to ensure data consistency
      await db.sequelize.transaction(async (t) => {
        // MANDATORY DELETIONS - These must succeed

        // Step 1: Find all product_attribute_value_ids associated with this product_variant_id
        const variantAttributeValues = await VariantAttributeValue.findAll({
          where: { product_variant_id },
          attributes: ["product_attribute_value_id"],
          transaction: t,
        });

        // Extract all product_attribute_value_ids
        const productAttributeValueIds = variantAttributeValues.map(
          (vav) => vav.product_attribute_value_id
        );

        // Step 2: Delete the associated AttributeValues from the AttributeValue table
        if (productAttributeValueIds.length > 0) {
          await AttributeValue.destroy({
            where: {
              product_attribute_value_id: {
                [Sequelize.Op.in]: productAttributeValueIds,
              },
            },
            transaction: t,
          });
        }

        // Step 3: Delete related VariantAttributeValues
        await VariantAttributeValue.destroy({
          where: { product_variant_id },
          transaction: t,
        });

        // Step 4: Find ProductMedia related to this variant
        const productMediaRecords = await ProductMedia.findAll({
          where: { product_variant_id },
          transaction: t,
        });

        // Get all product_media_ids to delete related URLs
        const productMediaIds = productMediaRecords.map(
          (media) => media.product_media_id
        );

        // Step 5: Delete related productMediaUrl
        if (productMediaIds.length > 0) {
          await productMediaUrl.destroy({
            where: {
              product_media_id: {
                [Sequelize.Op.in]: productMediaIds,
              },
            },
            transaction: t,
          });
        }

        // Step 6: Delete ProductMedia records
        await ProductMedia.destroy({
          where: { product_variant_id },
          transaction: t,
        });

        // OPTIONAL DELETIONS - Continue if these fail
        try {
          // Try to delete related CartItems
          await CartItem.destroy({
            where: { product_variant_id },
            transaction: t,
          });
        } catch (error) {
          console.log("CartItem deletion skipped:", error.message);
        }

        try {
          // Try to delete related WishlistItems
          await WishlistItem.destroy({
            where: { product_variant_id },
            transaction: t,
          });
        } catch (error) {
          console.log("WishlistItem deletion skipped:", error.message);
        }

        try {
          // Try to delete related OrderItems
          await OrderItem.destroy({
            where: { product_variant_id },
            transaction: t,
          });
        } catch (error) {
          console.log("OrderItem deletion skipped:", error.message);
        }

        try {
          // Try to delete related StockAlerts
          await StockAlert.destroy({
            where: { product_variant_id },
            transaction: t,
          });
        } catch (error) {
          console.log("StockAlert deletion skipped:", error.message);
        }

        try {
          // Try to delete related ProductReviews
          await ProductReview.destroy({
            where: { product_variant_id },
            transaction: t,
          });
        } catch (error) {
          console.log("ProductReview deletion skipped:", error.message);
        }

        try {
          // Try to delete related DiscountRules
          await DiscountRule.destroy({
            where: { product_variant_id },
            transaction: t,
          });
        } catch (error) {
          console.log("DiscountRule deletion skipped:", error.message);
        }

        try {
          // Try to delete related Coupons
          await Coupon.destroy({
            where: { product_variant_id },
            transaction: t,
          });
        } catch (error) {
          console.log("Coupon deletion skipped:", error.message);
        }

        // Step 7: Finally, delete the ProductVariant itself (mandatory)
        await productVariant.destroy({ transaction: t });
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: MESSAGE.delete.succ,
      });
    } else if (formattedData == "products") {
      const product_id = id;

      // First, check if the product exists
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Product not found",
        });
      }

      // Get product with its images BEFORE deletion
      const productWithImages = await Product.findByPk(product_id, {
        include: [
          {
            model: ProductVariant,
            as: "variants",
            attributes: ["base_variant_image_url"]
          },
          {
            model: ProductMedia,
            as: "media",
            include: [{
              model: productMediaUrl,
              attributes: ["product_media_url"]
            }]
          }
        ]
      });

      // Collect all image paths
      const imagesToDelete = [];

      // Add variant images
      if (productWithImages.variants) {
        productWithImages.variants.forEach(variant => {
          if (variant.base_variant_image_url) {
            imagesToDelete.push(variant.base_variant_image_url);
          }
        });
      }

      // Add product media images
      if (productWithImages.media) {
        productWithImages.media.forEach(media => {
          if (media.productMediaUrl) {
            media.productMediaUrl.forEach(mediaUrl => {
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

      // Use a transaction to ensure data consistency
      await db.sequelize.transaction(async (t) => {
        // MANDATORY DELETIONS - These must succeed

        // Step 1: Find all ProductVariants associated with this product
        const productVariants = await ProductVariant.findAll({
          where: { product_id },
          attributes: ["product_variant_id"],
          transaction: t,
        });

        const productVariantIds = productVariants.map(
          (variant) => variant.product_variant_id
        );

        // Step 2: Delete all related records for each ProductVariant
        if (productVariantIds.length > 0) {
          // Step 2.1: Find all product_attribute_value_ids for these product variants
          const variantAttributeValues = await VariantAttributeValue.findAll({
            where: {
              product_variant_id: {
                [Sequelize.Op.in]: productVariantIds,
              },
            },
            attributes: ["product_attribute_value_id"],
            transaction: t,
          });

          const productAttributeValueIds = variantAttributeValues.map(
            (vav) => vav.product_attribute_value_id
          );

          // Step 2.2: Delete the associated AttributeValues
          if (productAttributeValueIds.length > 0) {
            await AttributeValue.destroy({
              where: {
                product_attribute_value_id: {
                  [Sequelize.Op.in]: productAttributeValueIds,
                },
              },
              transaction: t,
            });
          }

          // Step 2.3: Delete related VariantAttributeValues
          await VariantAttributeValue.destroy({
            where: {
              product_variant_id: {
                [Sequelize.Op.in]: productVariantIds,
              },
            },
            transaction: t,
          });

          // Step 2.4: Find ProductMedia related to these variants
          const productMediaRecords = await ProductMedia.findAll({
            where: {
              product_variant_id: {
                [Sequelize.Op.in]: productVariantIds,
              },
            },
            transaction: t,
          });

          const productMediaIds = productMediaRecords.map(
            (media) => media.product_media_id
          );

          // Step 2.5: Delete related productMediaUrl
          if (productMediaIds.length > 0) {
            await productMediaUrl.destroy({
              where: {
                product_media_id: {
                  [Sequelize.Op.in]: productMediaIds,
                },
              },
              transaction: t,
            });
          }

          // Step 2.6: Delete ProductMedia records
          await ProductMedia.destroy({
            where: {
              product_variant_id: {
                [Sequelize.Op.in]: productVariantIds,
              },
            },
            transaction: t,
          });
        }

        // Step 4: Delete ProductVariants
        await ProductVariant.destroy({
          where: { product_id },
          transaction: t,
        });

        // Step 5: Delete the Product itself
        await product.destroy({ transaction: t });

        // OPTIONAL DELETIONS - Continue if these fail

        try {
          // Step 3: Delete ProductReviews directly associated with the product
          await ProductReview.destroy({
            where: { product_id },
            transaction: t,
          });
        } catch (error) {
          console.log("ProductReview deletion skipped:", error.message);
        }

        try {
          // Try to delete related CartItems (if product_id exists)
          await CartItem.destroy({
            where: { product_id },
            transaction: t,
          });
        } catch (error) {
          console.log("CartItem deletion skipped:", error.message);
        }

        try {
          // Try to delete related Coupons (if product_id exists)
          await Coupon.destroy({
            where: { product_id },
            transaction: t,
          });
        } catch (error) {
          console.log("Coupon deletion skipped:", error.message);
        }

        try {
          // Try to delete related DiscountRules (if product_id exists)
          await DiscountRule.destroy({
            where: { product_id },
            transaction: t,
          });
        } catch (error) {
          console.log("DiscountRule deletion skipped:", error.message);
        }

        try {
          // Try to delete related OrderItems (if product_id exists)
          await OrderItem.destroy({
            where: { product_id },
            transaction: t,
          });
        } catch (error) {
          console.log("OrderItem deletion skipped:", error.message);
        }

        try {
          // Try to delete related StockAlerts (if product_id exists)
          await StockAlert.destroy({
            where: { product_id },
            transaction: t,
          });
        } catch (error) {
          console.log("StockAlert deletion skipped:", error.message);
        }

        try {
          // Try to delete related WishlistItems (if product_id exists)
          await WishlistItem.destroy({
            where: { product_id },
            transaction: t,
          });
        } catch (error) {
          console.log("WishlistItem deletion skipped:", error.message);
        }
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: MESSAGE.delete.succ,
      });
    } else if (formattedData == "brands") {
      const brand_id = id;

      // First, check if the brand exists
      const brand = await Brand.findByPk(brand_id);
      if (!brand) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Brand not found",
        });
      }

      // Get all products of this brand with their images BEFORE deletion
      const productsWithImages = await Product.findAll({
        where: { brand_id },
        include: [
          {
            model: ProductVariant,
            as: "variants",
            attributes: ["base_variant_image_url"],
          },
          {
            model: ProductMedia,
            as: "media",
            include: [
              {
                model: productMediaUrl,
                attributes: ["product_media_url"],
              },
            ],
          },
        ],
      });

      // Collect all image paths
      const imagesToDelete = [];
      productsWithImages.forEach((product) => {
        // Add variant images
        if (product.variants) {
          product.variants.forEach((variant) => {
            if (variant.base_variant_image_url) {
              imagesToDelete.push(variant.base_variant_image_url);
            }
          });
        }

        // Add product media images
        if (product.media) {
          product.media.forEach((media) => {
            if (media.productMediaUrl) {
              media.productMediaUrl.forEach((mediaUrl) => {
                if (mediaUrl.product_media_url) {
                  imagesToDelete.push(mediaUrl.product_media_url);
                }
              });
            }
          });
        }
      });

      // Delete associated images from filesystem FIRST
      if (imagesToDelete.length > 0) {
        deleteImages(imagesToDelete);
      }

      // Use a transaction to ensure data consistency
      await db.sequelize.transaction(async (t) => {
        // MANDATORY DELETIONS - These must succeed

        // Step 1: Find all Products associated with this brand
        const products = await Product.findAll({
          where: { brand_id },
          attributes: ["product_id"],
          transaction: t,
        });

        const productIds = products.map((product) => product.product_id);

        // Initialize productVariantIds as an empty array to avoid ReferenceError
        let productVariantIds = [];

        // Step 2: Handle deletions for each Product
        if (productIds.length > 0) {
          // Step 2.1: Find all ProductVariants for these products
          const productVariants = await ProductVariant.findAll({
            where: {
              product_id: {
                [Sequelize.Op.in]: productIds,
              },
            },
            attributes: ["product_variant_id"],
            transaction: t,
          });

          productVariantIds = productVariants.map(
            (variant) => variant.product_variant_id
          );

          // Step 2.2: Delete all related records for each ProductVariant
          if (productVariantIds.length > 0) {
            // Step 2.2.1: Find all product_attribute_value_ids for these product variants
            const variantAttributeValues = await VariantAttributeValue.findAll({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              attributes: ["product_attribute_value_id"],
              transaction: t,
            });

            const productAttributeValueIds = variantAttributeValues.map(
              (vav) => vav.product_attribute_value_id
            );

            // Step 2.2.2: Delete the associated AttributeValues
            if (productAttributeValueIds.length > 0) {
              await AttributeValue.destroy({
                where: {
                  product_attribute_value_id: {
                    [Sequelize.Op.in]: productAttributeValueIds,
                  },
                },
                transaction: t,
              });
            }

            // Step 2.2.3: Delete related VariantAttributeValues
            await VariantAttributeValue.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });

            // Step 2.2.4: Find ProductMedia related to these variants
            const productMediaRecords = await ProductMedia.findAll({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });

            const productMediaIds = productMediaRecords.map(
              (media) => media.product_media_id
            );

            // Step 2.2.5: Delete related productMediaUrl
            if (productMediaIds.length > 0) {
              await productMediaUrl.destroy({
                where: {
                  product_media_id: {
                    [Sequelize.Op.in]: productMediaIds,
                  },
                },
                transaction: t,
              });
            }

            // Step 2.2.6: Delete ProductMedia records
            await ProductMedia.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });
          }

          // Step 2.3: Delete ProductReviews directly associated with these products (MANDATORY)
          await ProductReview.destroy({
            where: {
              product_id: {
                [Sequelize.Op.in]: productIds,
              },
            },
            transaction: t,
          });

          // Step 2.4: Delete ProductVariants
          await ProductVariant.destroy({
            where: {
              product_id: {
                [Sequelize.Op.in]: productIds,
              },
            },
            transaction: t,
          });

          // Step 2.5: Delete the Products
          await Product.destroy({
            where: { brand_id },
            transaction: t,
          });
        }

        // Step 3: Delete the Brand itself
        await brand.destroy({ transaction: t });

        // OPTIONAL DELETIONS - Continue if these fail
        if (productIds.length > 0) {
          try {
            // Try to delete related CartItems (if product_id exists)
            await CartItem.destroy({
              where: {
                product_id: {
                  [Sequelize.Op.in]: productIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log("CartItem deletion skipped (product):", error.message);
          }

          try {
            // Try to delete related Coupons (if product_id exists)
            await Coupon.destroy({
              where: {
                product_id: {
                  [Sequelize.Op.in]: productIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log("Coupon deletion skipped (product):", error.message);
          }

          try {
            // Try to delete related DiscountRules (if product_id exists)
            await DiscountRule.destroy({
              where: {
                product_id: {
                  [Sequelize.Op.in]: productIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log(
              "DiscountRule deletion skipped (product):",
              error.message
            );
          }

          try {
            // Try to delete related OrderItems (if product_id exists)
            await OrderItem.destroy({
              where: {
                product_id: {
                  [Sequelize.Op.in]: productIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log("OrderItem deletion skipped (product):", error.message);
          }

          try {
            // Try to delete related StockAlerts (if product_id exists)
            await StockAlert.destroy({
              where: {
                product_id: {
                  [Sequelize.Op.in]: productIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log(
              "StockAlert deletion skipped (product):",
              error.message
            );
          }

          try {
            // Try to delete related WishlistItems (if product_id exists)
            await WishlistItem.destroy({
              where: {
                product_id: {
                  [Sequelize.Op.in]: productIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log(
              "WishlistItem deletion skipped (product):",
              error.message
            );
          }
        }

        if (productVariantIds.length > 0) {
          try {
            // Try to delete related CartItems (if product_variant_id exists)
            await CartItem.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log("CartItem deletion skipped (variant):", error.message);
          }

          try {
            // Try to delete related WishlistItems (if product_variant_id exists)
            await WishlistItem.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log(
              "WishlistItem deletion skipped (variant):",
              error.message
            );
          }

          try {
            // Try to delete related OrderItems (if product_variant_id exists)
            await OrderItem.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log("OrderItem deletion skipped (variant):", error.message);
          }

          try {
            // Try to delete related StockAlerts (if product_variant_id exists)
            await StockAlert.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log(
              "StockAlert deletion skipped (variant):",
              error.message
            );
          }

          try {
            // Try to delete related ProductReviews (if product_variant_id exists) - Optional
            await ProductReview.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log(
              "ProductReview deletion skipped (variant):",
              error.message
            );
          }

          try {
            // Try to delete related DiscountRules (if product_variant_id exists)
            await DiscountRule.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log(
              "DiscountRule deletion skipped (variant):",
              error.message
            );
          }

          try {
            // Try to delete related Coupons (if product_variant_id exists)
            await Coupon.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log("Coupon deletion skipped (variant):", error.message);
          }
        }
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: MESSAGE.delete.succ,
      });
    } else if (formattedData == "categories") {
      const category_id = id;

      // First, check if the category exists
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Category not found",
        });
      }

      console.log(
        `🔍 Starting deletion process for category: ${category.name}`
      );

      // Get all products in this category with their images BEFORE deletion
      const productsWithImages = await Product.findAll({
        where: { category_id },
        include: [
          {
            model: ProductVariant,
            as: "variants",
            attributes: ["base_variant_image_url"],
          },
          {
            model: ProductMedia,
            as: "media",
            include: [
              {
                model: productMediaUrl,
                attributes: ["product_media_url"],
              },
            ],
          },
        ],
      });

      console.log(`🔍 Found ${productsWithImages.length} products in category`);

      // Collect all image paths
      const imagesToDelete = [];
      productsWithImages.forEach((product) => {
        console.log(`🔍 Processing product: ${product.name}`);

        // Add variant images
        if (product.variants) {
          console.log(`🔍 Found ${product.variants.length} variants`);
          product.variants.forEach((variant) => {
            if (variant.base_variant_image_url) {
              console.log(
                `🔍 Adding variant image: ${variant.base_variant_image_url}`
              );
              imagesToDelete.push(variant.base_variant_image_url);
            }
          });
        }

        // Add product media images
        if (product.media) {
          console.log(`🔍 Found ${product.media.length} media items`);
          product.media.forEach((media) => {
            console.log('🔍 Media object:', media);
            if (media.productMediaUrl) {
              media.productMediaUrl.forEach((mediaUrl) => {
                if (mediaUrl.product_media_url) {
                  console.log(
                    `🔍 Adding media image: ${mediaUrl.product_media_url}`
                  );
                  imagesToDelete.push(mediaUrl.product_media_url);
                }
              });
            } else {
              console.log('🔍 No productMediaUrl found for this media');
            }
          });
        }
      });

      console.log(`🔍 Total images to delete: ${imagesToDelete.length}`);
      console.log("🔍 Image paths:", imagesToDelete);

      // Delete associated images from filesystem FIRST
      if (imagesToDelete.length > 0) {
        deleteImages(imagesToDelete);
      }

      // Use a transaction to ensure data consistency
      await db.sequelize.transaction(async (t) => {
        // MANDATORY DELETIONS - These must succeed

        // Step 1: Find all Products associated with this category
        const products = await Product.findAll({
          where: { category_id },
          attributes: ["product_id", "brand_id"],
          transaction: t,
        });

        const productIds = products.map((product) => product.product_id);

        // Collect all brand_ids from products in this category
        const brandIds = [
          ...new Set(
            products
              .map((product) => product.brand_id)
              .filter((id) => id !== null)
          ),
        ]; // Filter out null brand_ids

        // Initialize productVariantIds as an empty array to avoid ReferenceError
        let productVariantIds = [];

        // Step 2: Handle deletions for each Product
        if (productIds.length > 0) {
          // Step 2.1: Find all ProductVariants for these products
          const productVariants = await ProductVariant.findAll({
            where: {
              product_id: {
                [Sequelize.Op.in]: productIds,
              },
            },
            attributes: ["product_variant_id"],
            transaction: t,
          });

          productVariantIds = productVariants.map(
            (variant) => variant.product_variant_id
          );

          // Step 2.2: Delete all related records for each ProductVariant
          if (productVariantIds.length > 0) {
            // Step 2.2.1: Find all product_attribute_value_ids for these product variants
            const variantAttributeValues = await VariantAttributeValue.findAll({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              attributes: ["product_attribute_value_id"],
              transaction: t,
            });

            const productAttributeValueIds = variantAttributeValues.map(
              (vav) => vav.product_attribute_value_id
            );

            // Step 2.2.2: Delete the associated AttributeValues
            if (productAttributeValueIds.length > 0) {
              await AttributeValue.destroy({
                where: {
                  product_attribute_value_id: {
                    [Sequelize.Op.in]: productAttributeValueIds,
                  },
                },
                transaction: t,
              });
            }

            // Step 2.2.3: Delete related VariantAttributeValues
            await VariantAttributeValue.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });

            // Step 2.2.4: Find ProductMedia related to these variants
            const productMediaRecords = await ProductMedia.findAll({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });

            const productMediaIds = productMediaRecords.map(
              (media) => media.product_media_id
            );

            // Step 2.2.5: Delete related productMediaUrl
            if (productMediaIds.length > 0) {
              await productMediaUrl.destroy({
                where: {
                  product_media_id: {
                    [Sequelize.Op.in]: productMediaIds,
                  },
                },
                transaction: t,
              });
            }

            // Step 2.2.6: Delete ProductMedia records
            await ProductMedia.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });
          }

          // Step 2.3: Delete ProductReviews directly associated with these products (MANDATORY)
          await ProductReview.destroy({
            where: {
              product_id: {
                [Sequelize.Op.in]: productIds,
              },
            },
            transaction: t,
          });

          // Step 2.4: Delete ProductVariants
          await ProductVariant.destroy({
            where: {
              product_id: {
                [Sequelize.Op.in]: productIds,
              },
            },
            transaction: t,
          });

          // Step 2.5: Delete the Products
          await Product.destroy({
            where: { category_id },
            transaction: t,
          });
        }

        // Step 3: Delete the Brands associated with this category's products
        if (brandIds.length > 0) {
          // First check if these brands are used by products in other categories
          const productsWithSameBrands = await Product.findAll({
            where: {
              brand_id: {
                [Sequelize.Op.in]: brandIds,
              },
              category_id: {
                [Sequelize.Op.ne]: category_id,
              },
            },
            attributes: ["brand_id"],
            transaction: t,
          });

          // Get brands that are used exclusively by this category
          const exclusiveBrandIds = brandIds.filter(
            (brandId) =>
              !productsWithSameBrands.some((p) => p.brand_id === brandId)
          );

          // Delete brands that are exclusively used by this category
          if (exclusiveBrandIds.length > 0) {
            await Brand.destroy({
              where: {
                brand_id: {
                  [Sequelize.Op.in]: exclusiveBrandIds,
                },
              },
              transaction: t,
            });
          }
        }

        // Step 4: Delete the Category itself
        await category.destroy({ transaction: t });

        // OPTIONAL DELETIONS - Continue if these fail
        if (productIds.length > 0) {
          try {
            // Try to delete related CartItems (if product_id exists)
            await CartItem.destroy({
              where: {
                product_id: {
                  [Sequelize.Op.in]: productIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log("CartItem deletion skipped (product):", error.message);
          }

          try {
            // Try to delete related Coupons (if product_id exists)
            await Coupon.destroy({
              where: {
                product_id: {
                  [Sequelize.Op.in]: productIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log("Coupon deletion skipped (product):", error.message);
          }

          try {
            // Try to delete related DiscountRules (if product_id exists)
            await DiscountRule.destroy({
              where: {
                product_id: {
                  [Sequelize.Op.in]: productIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log(
              "DiscountRule deletion skipped (product):",
              error.message
            );
          }

          try {
            // Try to delete related OrderItems (if product_id exists)
            await OrderItem.destroy({
              where: {
                product_id: {
                  [Sequelize.Op.in]: productIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log("OrderItem deletion skipped (product):", error.message);
          }

          try {
            // Try to delete related StockAlerts (if product_id exists)
            await StockAlert.destroy({
              where: {
                product_id: {
                  [Sequelize.Op.in]: productIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log(
              "StockAlert deletion skipped (product):",
              error.message
            );
          }

          try {
            // Try to delete related WishlistItems (if product_id exists)
            await WishlistItem.destroy({
              where: {
                product_id: {
                  [Sequelize.Op.in]: productIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log(
              "WishlistItem deletion skipped (product):",
              error.message
            );
          }
        }

        if (productVariantIds.length > 0) {
          try {
            // Try to delete related CartItems (if product_variant_id exists)
            await CartItem.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log("CartItem deletion skipped (variant):", error.message);
          }

          try {
            // Try to delete related WishlistItems (if product_variant_id exists)
            await WishlistItem.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log(
              "WishlistItem deletion skipped (variant):",
              error.message
            );
          }

          try {
            // Try to delete related OrderItems (if product_variant_id exists)
            await OrderItem.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log("OrderItem deletion skipped (variant):", error.message);
          }

          try {
            // Try to delete related StockAlerts (if product_variant_id exists)
            await StockAlert.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log(
              "StockAlert deletion skipped (variant):",
              error.message
            );
          }

          try {
            // Try to delete related ProductReviews (if product_variant_id exists) - Optional
            await ProductReview.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log(
              "ProductReview deletion skipped (variant):",
              error.message
            );
          }

          try {
            // Try to delete related DiscountRules (if product_variant_id exists)
            await DiscountRule.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log(
              "DiscountRule deletion skipped (variant):",
              error.message
            );
          }

          try {
            // Try to delete related Coupons (if product_variant_id exists)
            await Coupon.destroy({
              where: {
                product_variant_id: {
                  [Sequelize.Op.in]: productVariantIds,
                },
              },
              transaction: t,
            });
          } catch (error) {
            console.log("Coupon deletion skipped (variant):", error.message);
          }
        }
      });



      return res.status(StatusCodes.OK).json({
        success: true,
        message: MESSAGE.delete.succ,
      });
    }

    // If we reach here, the data type wasn't recognized
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Invalid data type specified",
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.delete.fail,
      error: error.message,
    });
  }
};

const updateProductManagementData = async (req, res) => {
  try {
    const { id } = req.params;
    const formattedData = id.replace(/\s+/g, "").toLowerCase();

    if (formattedData == "categories") {
      const { category_id, name, description, slug, target_role } = req.body;

      // Validate required fields
      if (!category_id || !name || !slug || !target_role) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Category ID, name, slug, and target_role are required",
        });
      }

      // Check if the category exists
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Category not found",
        });
      }

      // Update the category
      await category.update({ name, description, slug, target_role });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Category updated successfully",
        data: category,
      });
    } else if (formattedData == "brands") {
      const { brand_id, name, slug } = req.body;

      // Validate required fields
      if (!brand_id || !name || !slug) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Brand ID, name, and slug are required",
        });
      }

      // Check if the brand exists
      const brand = await Brand.findByPk(brand_id);
      if (!brand) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Brand not found",
        });
      }

      // Update the brand (removed target_role which isn't in Brand model)
      await brand.update({ name, slug });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Brand updated successfully",
        data: brand,
      });
    } else if (formattedData == "products") {
      const {
        product_id,
        name,
        description,
        rating_average,
        slug,
        base_price,
        category_id,
        brand_id,
        media_type,
      } = req.body;

      // Validate required fields
      if (
        !product_id ||
        !name ||
        !slug ||
        !base_price ||
        !brand_id ||
        !category_id
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message:
            "Product ID, name, slug, base price, brand ID and category ID are required",
        });
      }

      //check if category_id, brand_id, and product_id exists
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Category not found",
        });
      }

      const brand = await Brand.findByPk(brand_id);
      if (!brand) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Brand not found",
        });
      }

      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Product not found",
        });
      }

      // Validate that the slug is unique
      const existingProduct = await Product.findOne({
        where: {
          slug: slug.toLowerCase(),
          product_id: { [Sequelize.Op.ne]: product_id },
        },
      });
      if (existingProduct) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Slug already exists",
        });
      }

      // Update the product
      await product.update({
        name,
        slug: slug.toLowerCase(),
        description,
        base_price,
        rating_average,
        category_id,
        brand_id,
      });

      // Update media type if provided and media exists
      if (media_type) {
        try {
          await ProductMedia.update({ media_type }, { where: { product_id } });
        } catch (mediaError) {
          console.log("Media update skipped:", mediaError.message);
        }
      }

      // Add missing return statement
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });
    } else if (formattedData == "productvariants") {
      const {
        sku,
        price,
        description,
        stock_quantity,
        discount_percentage,
        discount_quantity,
        min_retailer_quantity,
        bulk_discount_percentage,
        bulk_discount_quantity,
        product_variant_id,
      } = req.body;

      // Validate required fields
      if (
        !product_variant_id ||
        !sku ||
        !price ||
        !description ||
        !stock_quantity
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message:
            "Product variant ID, SKU, price, description and stock quantity are required",
        });
      }

      // Check if the product variant exists
      const productVariant = await ProductVariant.findByPk(product_variant_id);
      if (!productVariant) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Product variant not found",
        });
      }

      // Update the product variant
      await productVariant.update({
        sku: sku.toLowerCase(),
        price,
        description,
        stock_quantity,
        discount_percentage,
        discount_quantity,
        min_retailer_quantity,
        bulk_discount_percentage,
        bulk_discount_quantity,
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Product variant updated successfully",
        data: productVariant,
      });
    } else if (formattedData == "attributevalues") {
      const { attribute_id, attribute, value, product_attribute_value_id } =
        req.body;

      // Validate required fields
      if (
        !product_attribute_value_id ||
        !attribute_id ||
        !attribute ||
        !value
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message:
            "Product attribute value ID, attribute ID, attribute, and value are required",
        });
      }

      // Check if attribute_id and product_attribute_value_id exists
      const attributeModel = await Attribute.findByPk(attribute_id);
      if (!attributeModel) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Attribute not found",
        });
      }

      const attributeValue = await AttributeValue.findByPk(
        product_attribute_value_id
      );
      if (!attributeValue) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Attribute value not found",
        });
      }

      // Update attribute name
      await attributeModel.update({
        name: attribute.toLowerCase(),
      });

      // Update attribute value
      await attributeValue.update({
        value: value.toLowerCase(),
      });

      // Add missing return statement
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Attribute value updated successfully",
        data: { attribute: attributeModel, attributeValue },
      });
    } else {
      // Add default case for unrecognized data type
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid data type specified",
      });
    }
  } catch (error) {
    console.error("Error updating product management data:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update product management data",
      error: error.message,
    });
  }
};

export default {
  getProductManagementData,
  addProductManagmentData,
  deleteProductManagementData,
  updateProductManagementData,
};
