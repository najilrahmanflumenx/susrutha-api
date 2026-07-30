import { Request, Response } from 'express';
import Video from '../models/Video.model';

export const getVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status } = req.query;
    const filter: any = { isDeleted: false };
    if (status) filter.status = status;
    if (category) filter.category = category;

    const videos = await Video.find(filter)
      .populate('doctorId', 'name designation photo')
      .populate('treatmentId', 'title category')
      .sort({ sortOrder: 1, createdAt: -1 });

    // Auto-heal legacy video records where videoUrl was stored in thumbnailUrl or url
    const sanitizedVideos = videos.map((vid: any) => {
      const doc = vid.toObject ? vid.toObject() : { ...vid };
      const rawUrl = doc.videoUrl || doc.youtubeUrl || '';
      const fallbackUrl = doc.thumbnailUrl || doc.url || '';
      
      const isRawVideo = rawUrl && (rawUrl.includes('/uploads/') || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(rawUrl) || rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be') || /^[a-zA-Z0-9_-]{11}$/.test(rawUrl));
      const isFallbackVideo = fallbackUrl && (fallbackUrl.includes('/uploads/') || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(fallbackUrl) || fallbackUrl.includes('youtube.com') || fallbackUrl.includes('youtu.be'));

      if (!isRawVideo && isFallbackVideo) {
        doc.videoUrl = fallbackUrl;
        doc.youtubeUrl = fallbackUrl;
      } else if (!doc.videoUrl && doc.youtubeUrl) {
        doc.videoUrl = doc.youtubeUrl;
      } else if (doc.videoUrl && !doc.youtubeUrl) {
        doc.youtubeUrl = doc.videoUrl;
      }
      return doc;
    });

    res.status(200).json({ success: true, data: sanitizedVideos });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.slug && req.body.title) {
      const baseSlug = req.body.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      req.body.slug = `${baseSlug}-${Date.now()}`;
    }
    if (!req.body.status || req.body.status === 'ACTIVE') {
      req.body.status = 'published';
    }

    const inputUrl = req.body.videoUrl || req.body.youtubeUrl || req.body.thumbnailUrl || '';
    if (inputUrl) {
      req.body.youtubeUrl = inputUrl;
      req.body.videoUrl = inputUrl;
      const isUploaded = inputUrl.includes('/uploads/') || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(inputUrl);
      req.body.videoHost = isUploaded ? 'uploaded' : 'youtube';
    }

    const video = await Video.create(req.body);
    res.status(201).json({ success: true, data: video });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.body.title && !req.body.slug) {
      req.body.slug = req.body.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (req.body.status === 'ACTIVE') {
      req.body.status = 'published';
    }

    const inputUrl = req.body.videoUrl || req.body.youtubeUrl || req.body.thumbnailUrl || '';
    if (inputUrl) {
      req.body.youtubeUrl = inputUrl;
      req.body.videoUrl = inputUrl;
      const isUploaded = inputUrl.includes('/uploads/') || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(inputUrl);
      req.body.videoHost = isUploaded ? 'uploaded' : 'youtube';
    }

    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!video) {
      res.status(404).json({ success: false, message: 'Video not found' });
      return;
    }
    res.status(200).json({ success: true, data: video });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!video) {
      res.status(404).json({ success: false, message: 'Video not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
