import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

let ffmpegPath: string | null = null;
try {
  ffmpegPath = require('ffmpeg-static');
} catch (e) {
  // ffmpeg-static not available
}

export interface OptimizedFileResult {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path?: string;
  buffer?: Buffer;
}

/**
 * Ensures a directory exists synchronously.
 */
function ensureDir(dirPath: string) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (e) {
    // Ignore filesystem errors on read-only environments
  }
}

/**
 * Optimizes uploaded files (Images -> WebP via Sharp, Videos -> MP4 via FFmpeg).
 * Automatically creates target upload directory if missing.
 */
export async function optimizeUploadedFile(file: Express.Multer.File): Promise<OptimizedFileResult> {
  const isVercel = Boolean(process.env.VERCEL);
  const mime = file.mimetype.toLowerCase();
  const ext = path.extname(file.originalname).toLowerCase();
  const uploadDir = isVercel ? '/tmp/uploads' : path.join(process.cwd(), 'uploads');

  // Always ensure destination upload directory exists
  ensureDir(uploadDir);

  const isImage = mime.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|bmp|tiff|avif)$/i.test(ext);
  const isSvg = mime.includes('svg') || ext === '.svg';
  const isVideo = mime.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi)$/i.test(ext);

  // Leave SVGs, PDFs, DOCs, and other non-media files as is
  if (isSvg || (!isImage && !isVideo)) {
    return {
      filename: file.filename || file.originalname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      buffer: file.buffer,
    };
  }

  // --- IMAGE OPTIMIZATION (SHARP -> WEBP) ---
  if (isImage) {
    const rawFilename = file.filename || file.originalname;
    const baseName = path.basename(rawFilename, path.extname(rawFilename));
    const webpFilename = `${baseName}.webp`;
    const outputPath = path.join(uploadDir, webpFilename);

    ensureDir(path.dirname(outputPath));

    try {
      let sharpInstance: sharp.Sharp;

      if (file.buffer) {
        sharpInstance = sharp(file.buffer, { animated: mime.includes('gif') });
      } else if (file.path && fs.existsSync(file.path)) {
        sharpInstance = sharp(file.path, { animated: mime.includes('gif') });
      } else {
        throw new Error(`File source path not found on disk: ${file.path}`);
      }

      const processedBuffer = await sharpInstance
        .resize(1920, 1920, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality: 80,
          effort: 4,
        })
        .toBuffer();

      if (!isVercel) {
        fs.writeFileSync(outputPath, processedBuffer);

        // Remove raw original file if different and exists
        if (file.path && file.path !== outputPath && fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
          } catch (e) {
            // Ignore unlink errors
          }
        }
      }

      const originalBaseName = path.basename(file.originalname, ext);
      return {
        filename: webpFilename,
        originalname: `${originalBaseName}.webp`,
        mimetype: 'image/webp',
        size: processedBuffer.length,
        path: isVercel ? undefined : outputPath,
        buffer: processedBuffer,
      };
    } catch (error) {
      console.error('[FileOptimizer] Sharp image optimization failed, using original file:', error);

      // If optimization fails, fallback cleanly to original file
      return {
        filename: file.filename || file.originalname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        buffer: file.buffer,
      };
    }
  }

  // --- VIDEO OPTIMIZATION (FFMPEG -> MP4) ---
  if (isVideo && ffmpegPath && !isVercel && file.path && fs.existsSync(file.path)) {
    const baseName = path.basename(file.filename, path.extname(file.filename));
    const mp4Filename = `${baseName}-opt.mp4`;
    const outputPath = path.join(uploadDir, mp4Filename);

    ensureDir(path.dirname(outputPath));

    try {
      const cmd = `"${ffmpegPath}" -y -i "${file.path}" -vf "scale='min(1920,iw)':-2" -c:v libx264 -crf 26 -preset fast -c:a aac -b:a 128k "${outputPath}"`;
      await execPromise(cmd);

      if (fs.existsSync(outputPath)) {
        const newStats = fs.statSync(outputPath);
        if (file.path !== outputPath && fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
          } catch (e) {
            // Ignore cleanup error
          }
        }
        return {
          filename: mp4Filename,
          originalname: file.originalname,
          mimetype: 'video/mp4',
          size: newStats.size,
          path: outputPath,
        };
      }
    } catch (error) {
      console.error('[FileOptimizer] FFmpeg video optimization failed, using original file:', error);
    }
  }

  // Fallback if no optimizer ran
  return {
    filename: file.filename || file.originalname,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path,
    buffer: file.buffer,
  };
}
