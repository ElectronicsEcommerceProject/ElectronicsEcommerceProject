import express from 'express';
import { addCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { verifyJwtToken } from '../middleware/jwt.js';
import { roleCheck } from '../middleware/roleCheck.js'; // Import the role check middleware


const router = express.Router();

// Add a new category
router.post('/',verifyJwtToken,roleCheck,addCategory);

// Get all categories
router.get('/',verifyJwtToken,roleCheck,getAllCategories);

// Update a category
router.put('/:id', verifyJwtToken,roleCheck,updateCategory);

// Delete a category
router.delete('/:id',verifyJwtToken,roleCheck,deleteCategory);


export default router;