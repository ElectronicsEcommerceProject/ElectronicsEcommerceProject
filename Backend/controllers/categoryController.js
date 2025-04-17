import db from '../models/index.js'; // Import the database models
const { Category } = db;



// Add a new category
export const addCategory = async (req, res) => {
  try {
    const { name, target_role} = req.body;

    if (!name || !target_role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newCategory = await Category.create({ name, target_role });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
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
export const deleteCategory = async (req, res) => {
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
