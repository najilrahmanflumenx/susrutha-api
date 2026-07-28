import { Request, Response } from 'express';
import MediaFile from '../models/MediaFile.model';

export const getMediaFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { folder, mimeType, search, page = 1, limit = 50 } = req.query;
    const filter: any = { isDeleted: false };
    if (folder) filter.folder = folder;
    if (mimeType) filter.mimeType = { $regex: mimeType, $options: 'i' };
    if (search) {
      filter.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { altText: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [files, total] = await Promise.all([
      MediaFile.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      MediaFile.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: files,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMediaFileRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const media = await MediaFile.create(req.body);
    res.status(201).json({ success: true, data: media });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteMediaFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = await MediaFile.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!file) {
      res.status(404).json({ success: false, message: 'Media file not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
