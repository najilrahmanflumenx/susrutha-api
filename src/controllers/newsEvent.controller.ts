import { Request, Response } from 'express';
import NewsEvent from '../models/NewsEvent.model';

export const getNewsEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, status } = req.query;
    const filter: any = { isDeleted: false };
    if (status) filter.status = status;
    if (type) filter.type = type;

    const items = await NewsEvent.find(filter).sort({ publishedDate: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNewsEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await NewsEvent.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateNewsEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await NewsEvent.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      res.status(404).json({ success: false, message: 'News item not found' });
      return;
    }
    res.status(200).json({ success: true, data: item });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteNewsEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await NewsEvent.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!item) {
      res.status(404).json({ success: false, message: 'News item not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
