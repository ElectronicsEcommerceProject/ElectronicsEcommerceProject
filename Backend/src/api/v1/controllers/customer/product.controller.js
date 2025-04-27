import db from '../../../../models/index.js'; // Import the database models

const { Product, Category, User } = db;

// ✅ Get all products based on user role
const getProducts = async (req, res) => {
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
const getProductsByCategoryId = async (req, res) => {
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

// ✅ Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    console.error("❌ Error while fetching product by ID:", error);
    res.status(500).json({ message: 'An error occurred while fetching the product' });
  }
};


export default {
  getProducts,
  getProductsByCategoryId,
  getProductById,
};