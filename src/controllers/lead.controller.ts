import { Request, Response } from 'express';
import { Lead } from '../models/Lead.model';
import { ApiResponse } from '../utils/ApiResponse';

export class LeadController {
  static async getAllLeads(req: Request, res: Response) {
    const { branchId, status, q, page: reqPage, limit: reqLimit } = req.query;
    const query: any = { isDeleted: false };
    if (branchId && branchId !== 'ALL') query.branchId = branchId;
    if (status) query.status = status;
    if (q) {
      query.$or = [
        { name: { $regex: q as string, $options: 'i' } },
        { phone: { $regex: q as string, $options: 'i' } },
        { email: { $regex: q as string, $options: 'i' } },
        { subject: { $regex: q as string, $options: 'i' } },
      ];
    }

    const limit = reqLimit ? parseInt(reqLimit as string, 10) : 10;
    const page = reqPage ? parseInt(reqPage as string, 10) : 1;
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find(query).populate('branchId', 'name code').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Lead.countDocuments(query),
    ]);

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: 'Patient leads fetched successfully',
      data: leads,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }

  static async createLead(req: Request, res: Response) {
    const lead = await Lead.create(req.body);
    return res.status(201).json(ApiResponse.success(lead, 'Lead created successfully'));
  }

  static async updateLead(req: Request, res: Response) {
    const updated = await Lead.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
    return res.status(200).json(ApiResponse.success(updated, 'Lead updated successfully'));
  }

  static async deleteLead(req: Request, res: Response) {
    const deleted = await Lead.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    return res.status(200).json(ApiResponse.success(null, 'Lead deleted successfully'));
  }
}
