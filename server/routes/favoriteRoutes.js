import express from 'express';
import favoriteController from '../controllers/favoriteController.js';
import favoriteValidation from'../middleware/FavoriteValidation.js';

const router = express.Router();

// Route configurations utilizing express structural validation nodes
router.post('/add', favoriteValidation.validateActionBody, favoriteController.addFavorite);
router.delete('/remove', favoriteValidation.validateActionBody, favoriteController.removeFavorite);
router.get('/', favoriteValidation.validateFetchQuery, favoriteController.getFavoriteProjects);

export default router;