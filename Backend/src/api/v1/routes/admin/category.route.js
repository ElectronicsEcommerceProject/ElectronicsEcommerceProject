import express from 'express';

import { verifyJwtToken } from '../../../middleware/jwt.js';
import { roleCheck } from '../../../middleware/roleCheck.js'; // Import the role check middleware
import { adminCategoryController } from '../../controllers/index.js';


const router = express.Router();

// Add a new category
router.post('/',verifyJwtToken,roleCheck,adminCategoryController.addCategory);

// Get all categories //esmai rolecheck ka koi jarurat nahi hai kyuki sabko dekhne hai...
router.get('/',verifyJwtToken,adminCategoryController.getAllCategories);

// Update a category
router.put('/:id', verifyJwtToken,roleCheck,adminCategoryController.updateCategory);

// Delete a category
router.delete('/:id',verifyJwtToken,roleCheck,adminCategoryController.deleteCategory);


export default router;