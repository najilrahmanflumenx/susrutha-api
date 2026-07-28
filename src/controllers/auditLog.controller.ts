import { Request, Response } from 'express';
import AuditLog from '../models/AuditLog.model';

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { module, action, page = 1, limit = 50 } = req.query;
    const filter: any = {};
    if (module) filter.module = module;
    if (action) filter.action = action;

    const skip = (Number(page) - 1) * Number(limit);
    const [logs, total] = await Promise.all([
      AuditLog.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      AuditLog.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: logs,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
