import db from '../models/index.js'; // Import the database models
const { Category, User } = db;


// Add a new category
const addCategory = async (req, res) => {
  try {
    const { name, target_role} = req.body;

    // console.log('testing', req.user.email)

    let user_id = await User.findOne({ where: { email: req.user.email } });
    let created_by = user_id.dataValues.user_id;// Get the user ID from the database

    if (!name || !target_role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newCategory = await Category.create({ name, target_role, created_by });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all categories based on user role
const getAllCategories = async (req, res) => {
  const userRole = req.user.role; // 'customer', 'retailer', 'admin'

  try {
    let categories;

    if (userRole === 'admin') {
      // Admin ko sab categories dikhni chahiye
      categories = await Category.findAll();
    } else if (userRole === 'customer') {
      categories = await Category.findAll({
        where: {
          target_role: ['customer', 'both'],
        },
      });
    } else if (userRole === 'retailer') {
      categories = await Category.findAll({
        where: {
          target_role: ['retailer', 'both'],
        },
      });
    } else {
      return res.status(403).json({ message: 'Unauthorized role' });
    }

    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, target_role } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.name = name || category.name;
    category.target_role = target_role || category.target_role;

    await category.save();

    res.status(200).json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.destroy();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
};
