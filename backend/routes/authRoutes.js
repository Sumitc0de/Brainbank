import { Router } from 'express';
import { googleLogin, mockLogin, refreshToken, logout, getMe } from '../controllers/authController.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate, googleLoginSchema } from '../middleware/validate.js';

const router = Router();

router.post('/google', authLimiter, validate(googleLoginSchema), googleLogin);
router.post('/mock', authLimiter, mockLogin);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', getMe);

export default router;
