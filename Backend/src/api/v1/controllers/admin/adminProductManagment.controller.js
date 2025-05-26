import db from "../../../../models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../constants/message.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

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
  ProductMediaUrl,
  User,
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

      products: products.map((product) => ({
        product_id: product.product_id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        base_price: product.base_price,
        rating_average: product.rating_average,
        category_id: product.category.category_id,
        category_name: product.category.name,
        brand_id: product.brand.brand_id,
        brand_name: product.brand.name,
        brand_slug: product.brand.slug,
      })),

      productVariants: productVariants.map((variant) => ({
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
    // console.log("Headers:", req.headers);
    // console.log("Request body keys:", Object.keys(req.body));
    // console.log("File:", req.file);

    // Check if we have media data in the request body
    if (req.body.media) {
      console.log("Media data from body:");
    }

    // Get the user from the token
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: MESSAGE.get.none,
      });
    }

    // Parse JSON strings if they're coming from form-data
    let { category, brand, product, variant, attributeValue, media } = req.body;

    try {
      if (typeof category === "string") category = JSON.parse(category);
      if (typeof brand === "string") brand = JSON.parse(brand);
      if (typeof product === "string") product = JSON.parse(product);
      if (typeof variant === "string") variant = JSON.parse(variant);
      if (typeof attributeValue === "string")
        attributeValue = JSON.parse(attributeValue);
      if (typeof media === "string") media = JSON.parse(media);
    } catch (parseError) {
      console.error("Error parsing form data:", parseError);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid JSON in form data",
        error: parseError.message,
      });
    }

    const created_by = user.user_id;

    // Handle file upload - req.file is available from the upload middleware
    if (req.file) {
      // Store relative path in DB - use forward slashes for consistency
      productImageUrl = `uploads/product_images/${req.file.filename}`;
      console.log("Product image URL:", productImageUrl);
    }

    // Use transaction to ensure data consistency
    const result = await db.sequelize.transaction(async (t) => {
      // Step 1: Create or find Category
      let categoryRecord;

      // Make sure category.name exists before using it in the query
      if (!category || !category.name) {
        throw new Error("Category name is required");
      }

      const existingCategory = await Category.findOne({
        where: { name: category.name },
        transaction: t,
      });

      if (existingCategory) {
        categoryRecord = existingCategory;
      } else {
        categoryRecord = await Category.create(
          {
            name: category.name,
            slug: category.slug,
            target_role: category.target_role,
            created_by,
          },
          { transaction: t }
        );
      }

      // Step 2: Create or find Brand
      let brandRecord;
      const existingBrand = await Brand.findOne({
        where: { name: brand.name },
        transaction: t,
      });

      if (existingBrand) {
        brandRecord = existingBrand;
      } else {
        brandRecord = await Brand.create(
          {
            name: brand.name,
            slug: brand.slug,
            created_by,
          },
          { transaction: t }
        );
      }

      // Step 3: Create Product
      const productRecord = await Product.create(
        {
          name: product.name,
          slug: product.slug,
          description: product.description,
          base_price: product.base_price,
          rating_average: product.average_rating || 0,
          category_id: categoryRecord.category_id,
          brand_id: brandRecord.brand_id,
          created_by,
        },
        { transaction: t }
      );

      // Step 4: Create Product Variant
      const productVariantRecord = await ProductVariant.create(
        {
          product_id: productRecord.product_id,
          sku: variant.sku,
          price: variant.price,
          description: variant.description,
          stock_quantity: variant.stock_quantity,
          discount_percentage: variant.discount_percentage,
          discount_quantity: variant.discount_quantity,
          min_retailer_quantity: variant.min_retailer_quantity,
          bulk_discount_percentage: variant.bulk_discount_percentage,
          bulk_discount_quantity: variant.bulk_discount_quantity,
          created_by,
        },
        { transaction: t }
      );

      // Step 5: Create or find Attribute
      let attributeRecord;
      const existingAttribute = await Attribute.findOne({
        where: { name: attributeValue.attribute_name },
        transaction: t,
      });

      if (existingAttribute) {
        attributeRecord = existingAttribute;
      } else {
        attributeRecord = await Attribute.create(
          {
            name: attributeValue.attribute_name,
            data_type: attributeValue.type,
            created_by,
          },
          { transaction: t }
        );
      }

      // Step 6: Create Attribute Value
      const attributeValueRecord = await AttributeValue.create(
        {
          product_attribute_id: attributeRecord.product_attribute_id,
          value: attributeValue.value,
          created_by,
        },
        { transaction: t }
      );

      // Step 7: Create Variant Attribute Value mapping
      const variantAttributeValueRecord = await VariantAttributeValue.create(
        {
          product_variant_id: productVariantRecord.product_variant_id,
          product_attribute_value_id:
            attributeValueRecord.product_attribute_value_id,
          created_by,
        },
        { transaction: t }
      );

      // Step 8: Create Product Media
      const productMediaRecord = await ProductMedia.create(
        {
          product_id: productRecord.product_id,
          product_variant_id: productVariantRecord.product_variant_id,
          media_type: media?.media_type || "image",
          created_by,
        },
        { transaction: t }
      );

      // Step 9: Create Product Media URL using the uploaded file
      const productMediaUrlRecord = await ProductMediaUrl.create(
        {
          product_media_id: productMediaRecord.product_media_id,
          product_media_url:
            productImageUrl ||
            media?.media_file?.fileName ||
            "default-product-image.jpg",
          media_type: media?.media_type || "image",
          created_by,
        },
        { transaction: t }
      );

      // Return all created records
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

    // Convert relative path to full URL for response
    if (
      result.productMediaUrl.product_media_url &&
      !result.productMediaUrl.product_media_url.startsWith("http")
    ) {
      result.productMediaUrl.product_media_url = `${req.protocol}://${req.get(
        "host"
      )}/${result.productMediaUrl.product_media_url.replace(/\\/g, "/")}`;
    }

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: MESSAGE.post.succ,
      data: result,
    });
  } catch (error) {
    console.error("Error adding product management data:", error);

    // If there was an error and we uploaded a file, clean it up
    if (req.file && productImageUrl) {
      try {
        // Use the actual file path from req.file
        const filePath = req.file.path;
        console.log("Actual file path for cleanup:", filePath);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("🗑 Uploaded file deleted due to error:", filePath);
        } else {
          console.log("❌ File not found at path:", filePath);
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

export default { getProductManagementData, addProductManagmentData };
