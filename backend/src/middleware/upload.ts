import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Cloudinary auto-configures from CLOUDINARY_URL env var
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('[Cloudinary] Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'root-rise-products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  } as any,
});

export const upload = multer({ storage });