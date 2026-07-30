import { Request, Response } from 'express';
import Condition from '../models/Condition.model';

export const getConditions = async (req: Request, res: Response): Promise<void> => {
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
    const [conditions, total] = await Promise.all([
      Condition.find(filter)
        .populate('specialistDoctorIds', 'name designation photo slug')
        .populate('recommendedTreatmentIds', 'title category slug coverImage')
        .populate('recommendedPackageIds', 'title durationDays price slug image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Condition.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: conditions,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getConditionBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const condition = await Condition.findOne({ slug: req.params.slug, isDeleted: false })
      .populate('specialistDoctorIds')
      .populate('recommendedTreatmentIds')
      .populate('recommendedPackageIds');

    if (!condition) {
      res.status(404).json({ success: false, message: 'Condition not found' });
      return;
    }
    res.status(200).json({ success: true, data: condition });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCondition = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.slug && req.body.title) {
      req.body.slug = req.body.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const condition = await Condition.create(req.body);
    res.status(201).json({ success: true, data: condition });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCondition = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.slug && req.body.title) {
      req.body.slug = req.body.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const condition = await Condition.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!condition) {
      res.status(404).json({ success: false, message: 'Condition not found' });
      return;
    }
    res.status(200).json({ success: true, data: condition });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCondition = async (req: Request, res: Response): Promise<void> => {
  try {
    const condition = await Condition.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!condition) {
      res.status(404).json({ success: false, message: 'Condition not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Condition deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
