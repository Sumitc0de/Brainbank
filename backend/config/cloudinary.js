import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function assertCloudinaryConfig() {
  const missing = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
    .filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Cloudinary is not configured. Missing ${missing.join(', ')}.`);
  }
}

export default cloudinary;
