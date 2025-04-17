import express from 'express';
import { addCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { verifyJwtToken } from '../middleware/jwt.js';


const router = express.Router();

// Add a new category
router.post('/',verifyJwtToken,addCategory);

// Get all categories
router.get('/',verifyJwtToken,getAllCategories);

// Update a category
router.put('/:id', verifyJwtToken,updateCategory);

// Delete a category
router.delete('/:id',verifyJwtToken,deleteCategory);


export default router;