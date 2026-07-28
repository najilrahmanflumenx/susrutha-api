import { Request, Response } from 'express';
import { FAQ } from '../models/FAQ.model';

export const getFAQs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status } = req.query;
    const filter: any = { isDeleted: false };
    if (status) filter.status = status;
    if (category) filter.category = category;

    const faqs = await FAQ.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: faqs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faq) {
      res.status(404).json({ success: false, message: 'FAQ not found' });
      return;
    }
    res.status(200).json({ success: true, data: faq });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!faq) {
      res.status(404).json({ success: false, message: 'FAQ not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
