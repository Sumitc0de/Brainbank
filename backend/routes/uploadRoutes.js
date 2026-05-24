import { Router } from 'express';
import { deleteUpload, uploadIdeaImage, uploadIdeaPdf } from '../controllers/uploadController.js';
import { uploadImage, uploadPdf } from '../middleware/uploadMiddleware.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { checkUploadLimit } from '../middleware/gatingMiddleware.js';

const router = Router();

// Apply upload rate limiter
router.use(uploadLimiter);

router.post('/image', checkUploadLimit, uploadImage.single('file'), uploadIdeaImage);
router.post('/pdf', checkUploadLimit, uploadPdf.single('file'), uploadIdeaPdf);
router.delete('/:publicId(*)', deleteUpload);

export default router;
