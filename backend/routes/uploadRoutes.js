import { Router } from 'express';
import { deleteUpload, uploadIdeaImage, uploadIdeaPdf } from '../controllers/uploadController.js';
import { uploadImage, uploadPdf } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/image', uploadImage.single('file'), uploadIdeaImage);
router.post('/pdf', uploadPdf.single('file'), uploadIdeaPdf);
router.delete('/:publicId(*)', deleteUpload);

export default router;
