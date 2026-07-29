import { Router } from 'express';
import CategoryController from '../controllers/categoryController.js';

const router = Router();

// Get all categories
router.get('/', CategoryController.getAllCategories);

export default router;