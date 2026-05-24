import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const IMAGE_FORMATS = ['png', 'jpg', 'jpeg', 'webp'];
const IMAGE_MIME_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
const PDF_MIME_TYPES = ['application/pdf'];

const FOLDERS = {
  logo: 'brainbank/logos',
  idea: 'brainbank/ideas',
  prd: 'brainbank/prds',
  research: 'brainbank/research',
  inspiration: 'brainbank/ui-inspirations',
};

function resolveFolder(category, fallback) {
  return FOLDERS[category] || FOLDERS[fallback];
}

function sanitizePublicId(name = 'brainbank-file') {
  return name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'brainbank-file';
}

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: resolveFolder(req.body.category, 'idea'),
    allowed_formats: IMAGE_FORMATS,
    public_id: `${Date.now()}-${sanitizePublicId(file.originalname)}`,
    resource_type: 'image',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  }),
});

const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: resolveFolder(req.body.category, 'prd'),
    allowed_formats: ['pdf'],
    public_id: `${Date.now()}-${sanitizePublicId(file.originalname)}`,
    resource_type: 'raw',
    flags: 'inline',
  }),
});

function fileTypeGuard(allowedTypes, label) {
  return (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error(`Invalid ${label} type.`));
      return;
    }

    cb(null, true);
  };
}

export const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: fileTypeGuard(IMAGE_MIME_TYPES, 'image'),
});

export const uploadPdf = multer({
  storage: pdfStorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: fileTypeGuard(PDF_MIME_TYPES, 'PDF'),
});
