import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiError } from '../utils/ApiError';

const isVercel = Boolean(process.env.VERCEL);
const uploadDir = isVercel ? '/tmp/uploads' : path.join(process.cwd(), 'uploads');

if (!isVercel) {
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch (e) {
    // Ignore filesystem creation errors on read-only environments
  }
}

const storage = isVercel
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, uploadDir);
      },
      filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    });

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|webp|svg|gif|mp4|webm|mov|mkv|avi|pdf|doc|docx/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype) || file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/');

  if (extName && mimeType) {
    return cb(null, true);
  }
  cb(new ApiError(400, 'Invalid file type. Allowed formats: Images (JPEG, PNG, WEBP, SVG, GIF), Videos (MP4, WEBM, MOV, MKV, AVI), Documents (PDF, DOC, DOCX)'));
};

export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max limit (allows video uploads)
  fileFilter,
});

