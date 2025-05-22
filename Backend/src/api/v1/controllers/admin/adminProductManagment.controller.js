import db from "../../../../models/index.js";
import { StatusCodes } from "http-status-codes";
import MESSAGE from "../../../../constants/message.js";

const {
  Category,
  Brand,
  Product,
  ProductVariant,
  Attribute,
  AttributeValue,
  VariantAttributeValue,
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
        attributes: ["category_id", "name", "target_role"],
      }),

      // 2. Brands
      Brand.findAll({
        attributes: ["brand_id", "name", "slug"],
      }),

      // 3. Products with their Category and Brand
      Product.findAll({
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
            attributes: ["brand_id", "name", "slug"],
          },
        ],
      }),

      // 4. Product Variants with their Product
      ProductVariant.findAll({
        attributes: ["product_variant_id", "sku", "product_id"],
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

export default { getProductManagementData };
