import { Request, Response } from 'express';
import AuditLog from '../models/AuditLog.model';

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { module, action, q, page = 1, limit = 15 } = req.query;
    const filter: any = {};

    if (module && module !== 'ALL') {
      filter.module = module;
    }
    if (action && action !== 'ALL') {
      filter.action = action;
    }
    if (q) {
      const searchRegex = { $regex: q as string, $options: 'i' };
      filter.$or = [
        { userName: searchRegex },
        { userEmail: searchRegex },
        { action: searchRegex },
        { module: searchRegex },
        { entityId: searchRegex },
        { 'details.summary': searchRegex },
      ];
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(100, Number(limit) || 15));
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate('user', 'name email')
        .sort({ timestamp: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      AuditLog.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      data: logs,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
