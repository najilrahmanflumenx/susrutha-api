import { Request, Response } from 'express';
import Affiliation from '../models/Affiliation.model';

export const getAffiliations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status } = req.query;
    const filter: any = { isDeleted: false };
    if (status) filter.status = status;
    if (category) filter.category = category;

    const affiliations = await Affiliation.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: affiliations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAffiliation = async (req: Request, res: Response): Promise<void> => {
  try {
    const title = req.body.title || req.body.name || 'Accreditation Item';
    const name = req.body.name || title;
    const status = req.body.status === 'ACTIVE' ? 'published' : req.body.status || 'published';

    const payload = {
      ...req.body,
      title,
      name,
      status,
    };

    const affiliation = await Affiliation.create(payload);
    res.status(201).json({ success: true, data: affiliation });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateAffiliation = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.body.name && !req.body.title) {
      req.body.title = req.body.name;
    }
    if (req.body.title && !req.body.name) {
      req.body.name = req.body.title;
    }
    if (req.body.status === 'ACTIVE') {
      req.body.status = 'published';
    }

    const affiliation = await Affiliation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!affiliation) {
      res.status(404).json({ success: false, message: 'Affiliation not found' });
      return;
    }
    res.status(200).json({ success: true, data: affiliation });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAffiliation = async (req: Request, res: Response): Promise<void> => {
  try {
    const affiliation = await Affiliation.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!affiliation) {
      res.status(404).json({ success: false, message: 'Affiliation not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
