import { Request, Response } from 'express';
import Ecosystem from '../models/Ecosystem.model';

export const getEcosystemPillars = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pillarType, status } = req.query;
    const filter: any = { isDeleted: false };
    if (status) filter.status = status;
    if (pillarType) filter.pillarType = pillarType;

    const pillars = await Ecosystem.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: pillars });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEcosystemPillar = async (req: Request, res: Response): Promise<void> => {
  try {
    const pillar = await Ecosystem.create(req.body);
    res.status(201).json({ success: true, data: pillar });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateEcosystemPillar = async (req: Request, res: Response): Promise<void> => {
  try {
    const pillar = await Ecosystem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pillar) {
      res.status(404).json({ success: false, message: 'Ecosystem pillar not found' });
      return;
    }
    res.status(200).json({ success: true, data: pillar });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteEcosystemPillar = async (req: Request, res: Response): Promise<void> => {
  try {
    const pillar = await Ecosystem.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!pillar) {
      res.status(404).json({ success: false, message: 'Ecosystem pillar not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
