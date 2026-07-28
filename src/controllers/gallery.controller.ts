import { Request, Response } from 'express';
import GalleryAlbum from '../models/GalleryAlbum.model';

export const getGalleryAlbums = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status } = req.query;
    const filter: any = { isDeleted: false };
    if (status) filter.status = status;
    if (category) filter.category = category;

    const albums = await GalleryAlbum.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: albums });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createGalleryAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const album = await GalleryAlbum.create(req.body);
    res.status(201).json({ success: true, data: album });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateGalleryAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const album = await GalleryAlbum.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!album) {
      res.status(404).json({ success: false, message: 'Gallery album not found' });
      return;
    }
    res.status(200).json({ success: true, data: album });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteGalleryAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const album = await GalleryAlbum.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!album) {
      res.status(404).json({ success: false, message: 'Gallery album not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
