import db from '../models/index.js';

const { Product, Category, User } = db;

// ✅ Reusable validation function
export const validateProductBody = (req) => {
  const errors = [];

  if (!req.body.name) errors.push({ field: 'name', message: 'Name is required' });
  if (!req.body.price) {
    errors.push({ field: 'price', message: 'Price is required' });
  } else if (isNaN(req.body.price) || !/^\d+(\.\d{1,2})?$/.test(req.body.price)) {
    errors.push({ field: 'price', message: 'Price must be a decimal value' });
  }

  if (req.body.stock && (!Number.isInteger(req.body.stock) || req.body.stock < 0))
    errors.push({ field: 'stock', message: 'Stock must be a non-negative integer' });

  if (req.body.image_url && !/^https?:\/\/.+\..+/.test(req.body.image_url))
    errors.push({ field: 'image_url', message: 'Image URL must be valid' });

  if (req.body.discount_quantity && req.body.discount_quantity < 1)
    errors.push({ field: 'discount_quantity', message: 'Discount quantity must be at least 1' });

  if (req.body.discount_percentage && (req.body.discount_percentage < 0 || req.body.discount_percentage > 100))
    errors.push({ field: 'discount_percentage', message: 'Discount percentage must be between 0 and 100' });

  if (req.body.min_retailer_quantity && req.body.min_retailer_quantity < 1)
    errors.push({ field: 'min_retailer_quantity', message: 'Min retailer quantity must be at least 1' });

  if (req.body.bulk_discount_quantity && req.body.bulk_discount_quantity < 1)
    errors.push({ field: 'bulk_discount_quantity', message: 'Bulk discount quantity must be at least 1' });

  if (req.body.bulk_discount_percentage && (req.body.bulk_discount_percentage < 0 || req.body.bulk_discount_percentage > 100))
    errors.push({ field: 'bulk_discount_percentage', message: 'Bulk discount percentage must be between 0 and 100' });

  if (req.body.stock_alert_threshold && req.body.stock_alert_threshold < 0)
    errors.push({ field: 'stock_alert_threshold', message: 'Stock alert threshold must be a non-negative integer' });

  if (!req.body.target_role || !['customer', 'retailer', 'both'].includes(req.body.target_role))
    errors.push({ field: 'target_role', message: 'Target role must be one of: customer, retailer, or both' });

  return errors.length > 0 ? errors : null;
};

// ✅ Create product
export const createProduct = async (req, res) => {
  const validationErrors = validateProductBody(req);
  if (validationErrors) return res.status(400).json({ errors: validationErrors });

  try {
    // Validate user
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Validate category
    const category = await Category.findOne({ where: { category_id: req.body.category_id } });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    // Ensure the category belongs to the user or is valid for the target role
    if (category.created_by !== user.user_id) {
      return res.status(403).json({ message: 'You are not authorized to use this category' });
    }

    // Create the product
    const product = await Product.create({
      ...req.body,
      created_by: user.user_id,
      category_id: category.category_id,
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error("❌ Error while creating product:", error);
    res.status(500).json({ message: 'An error occurred while creating the product' });
  }
};

// ✅ Update product
export const updateProduct = async (req, res) => {
  const validationErrors = validateProductBody(req);
  if (validationErrors) return res.status(400).json({ errors: validationErrors });

  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const category = await Category.findOne({ where: { created_by: user.user_id } });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await product.update({
      ...req.body,
      created_by: user.user_id,
      category_id: category.category_id,
    });

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error("❌ Error while updating product:", error);
    res.status(500).json({ message: 'An error occurred while updating the product' });
  }
};

// ✅ Get all products based on user role
export const getProducts = async (req, res) => {
  const userRole = req.user.role; // 'customer', 'retailer', 'admin'

  console.log(`📦 Fetching products for role: ${userRole}`);

  try {
    let products;

    if (userRole === 'admin') {
      // Admin ko sab products dikhne chahiye
      products = await Product.findAll();
    } else if (userRole === 'customer') {
      products = await Product.findAll({
        where: {
          target_role: ['customer', 'both'],
        },
      });
    } else if (userRole === 'retailer') {
      products = await Product.findAll({
        where: {
          target_role: ['retailer', 'both'],
        },
      });
    } else {
      return res.status(403).json({ message: 'Unauthorized role' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Error while fetching products:", error);
    res.status(500).json({ message: 'An error occurred while fetching the products' });
  }
};

// ✅ Get products by category ID
export const getProductsByCategoryId = async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Check if the category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Fetch products for the given category ID
    const products = await Product.findAll({
      where: { category_id: categoryId },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Error while fetching products by category ID:", error);
    res.status(500).json({ message: "An error occurred while fetching products" });
  }
};

// ✅ Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.destroy();
    res.status(200).json({ message: 'Product successfully deleted' });
  } catch (error) {
    console.error("❌ Error while deleting product:", error);
    res.status(500).json({ message: 'An error occurred while deleting the product' });
  }
};
