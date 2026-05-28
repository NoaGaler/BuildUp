import { Router } from 'express';
import authController from '../controllers/authController.js';
import { UserValidation } from '../middleware/authValidation.js';

const router = Router();

// register
router.post('/register-step1', UserValidation.registerStep1, authController.registerStep1);
router.put('/register-step2', UserValidation.registerStep2, authController.registerStep2);

// login
router.post('/login', UserValidation.login, authController.login);
router.get('/check-auth/:id', authController.checkAuthStatus);

export default router;