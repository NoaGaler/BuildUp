import express from 'express';
import profileController from '../controllers/ProfileController.js';
import { validateProfileUpdate } from '../middleware/professionalValidation.js';

const router = express.Router();

// router.get('/', profileController.getAllProfessionals);
// router.get('/:id', profileController.getProfessionalProfile);
// router.patch('/profile/:id', validateProfileUpdate, profileController.updateProfile);
// router.get('/client/:id', profileController.getClientProfile);
// router.patch('/client/:id', profileController.updateClientProfile);


router.get('/', profileController.getAllProfessionals);
router.get('/:id', profileController.getProfile);
router.patch('/:id', validateProfileUpdate, profileController.updateProfile);

export default router;