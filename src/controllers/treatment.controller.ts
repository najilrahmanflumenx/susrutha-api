import { Request, Response } from 'express';
import Treatment from '../models/Treatment.model';

export const getTreatments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, status, page = 1, limit = 50 } = req.query;
    const filter: any = { isDeleted: false };
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [treatments, total] = await Promise.all([
      Treatment.find(filter)
        .populate('doctorIds', 'name designation photo slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Treatment.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: treatments,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTreatmentBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const treatment = await Treatment.findOne({ slug: req.params.slug, isDeleted: false })
      .populate('doctorIds');

    if (!treatment) {
      res.status(404).json({ success: false, message: 'Treatment not found' });
      return;
    }
    res.status(200).json({ success: true, data: treatment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTreatment = async (req: Request, res: Response): Promise<void> => {
  try {
    const treatment = await Treatment.create(req.body);
    res.status(201).json({ success: true, data: treatment });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTreatment = async (req: Request, res: Response): Promise<void> => {
  try {
    const treatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!treatment) {
      res.status(404).json({ success: false, message: 'Treatment not found' });
      return;
    }
    res.status(200).json({ success: true, data: treatment });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTreatment = async (req: Request, res: Response): Promise<void> => {
  try {
    const treatment = await Treatment.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!treatment) {
      res.status(404).json({ success: false, message: 'Treatment not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Treatment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
