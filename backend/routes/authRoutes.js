import { Router } from 'express';
import { googleLogin, mockLogin, refreshToken, logout, getMe, devSetPlan } from '../controllers/authController.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate, googleLoginSchema } from '../middleware/validate.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/google', authLimiter, validate(googleLoginSchema), googleLogin);
router.post('/mock', authLimiter, mockLogin);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', getMe);
router.post('/dev-set-plan', authMiddleware, devSetPlan);

export default router;
