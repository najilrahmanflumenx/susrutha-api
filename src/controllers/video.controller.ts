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

    res.status(200).json({ success: true, data: videos });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const video = await Video.create(req.body);
    res.status(201).json({ success: true, data: video });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateVideo = async (req: Request, res: Response): Promise<void> => {
  try {
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
