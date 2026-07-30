import { Request, Response } from 'express';
import { Lead } from '../models/Lead.model';
import { ApiResponse } from '../utils/ApiResponse';

export class LeadController {
  static async getAllLeads(req: Request, res: Response) {
    const { branchId, status, leadType, q, page: reqPage, limit: reqLimit } = req.query;
    const query: any = { isDeleted: false };
    if (branchId && branchId !== 'ALL') query.branchId = branchId;
    if (status && status !== 'ALL') query.status = status;

    if (leadType && leadType !== 'ALL') {
      if (leadType === 'PACKAGE_BOOKING') {
        query.$or = [
          { leadType: 'PACKAGE_BOOKING' },
          { packageId: { $ne: null } },
          { subject: { $regex: 'package', $options: 'i' } },
          { message: { $regex: 'package', $options: 'i' } },
        ];
      } else if (leadType === 'SINGLE_TREATMENT') {
        query.$or = [
          { leadType: 'SINGLE_TREATMENT' },
          { treatmentId: { $ne: null } },
          { subject: { $regex: 'treatment|therapy', $options: 'i' } },
          { message: { $regex: 'treatment|therapy', $options: 'i' } },
        ];
      } else if (leadType === 'FEEDBACK_RATING') {
        query.$or = [
          { leadType: 'FEEDBACK_RATING' },
          { rating: { $ne: null } },
          { subject: { $regex: 'rating|feedback', $options: 'i' } },
        ];
      } else if (leadType === 'GENERAL_INQUIRY') {
        query.packageId = null;
        query.treatmentId = null;
        query.subject = { $not: { $regex: 'package|treatment|therapy', $options: 'i' } };
      }
    }

    if (q) {
      const searchRegex = { $regex: q as string, $options: 'i' };
      query.$and = [
        {
          $or: [
            { name: searchRegex },
            { phone: searchRegex },
            { email: searchRegex },
            { subject: searchRegex },
            { message: searchRegex },
          ],
        },
      ];
    }

    const limit = reqLimit ? parseInt(reqLimit as string, 10) : 50;
    const page = reqPage ? parseInt(reqPage as string, 10) : 1;
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .populate('branchId', 'name code')
        .populate('packageId', 'title durationDays price coverImage')
        .populate('treatmentId', 'title name price duration')
        .populate('doctorId', 'name designation specialization photo')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Lead.countDocuments(query),
    ]);

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: 'Patient leads fetched successfully',
      data: leads,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
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
