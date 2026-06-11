import express from 'express';
import ProfessionalReviewController from '../controllers/ProfessionalReviewController.js';

const router = express.Router();

// Route to fetch all reviews for a specific professional
router.get('/professional/:professionalId', ProfessionalReviewController.getProfessionalReviews);
// Route to post a new review for a specific professional
router.post('/professional/:professionalId', ProfessionalReviewController.addReview);
// Route to delete a specific review
router.delete('/:reviewId', ProfessionalReviewController.deleteReview);

export default router;