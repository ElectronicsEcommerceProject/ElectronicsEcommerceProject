import db from '../models/index.js';

const { Product, Category, User } = db;

// ✅ Create product
export const createProduct = async (req, res) => {

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

// ✅ Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    console.error("❌ Error while fetching product by ID:", error);
    res.status(500).json({ message: 'An error occurred while fetching the product' });
  }
};
