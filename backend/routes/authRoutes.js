import { Router } from 'express';
import { googleLogin, mockLogin } from '../controllers/authController.js';

const router = Router();

router.post('/google', googleLogin);
router.post('/mock', mockLogin);

export default router;
