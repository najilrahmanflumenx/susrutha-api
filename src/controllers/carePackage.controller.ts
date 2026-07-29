import { Request, Response } from 'express';
import { CarePackage } from '../models/CarePackage.model';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export class CarePackageController {
  static async getAllPackages(req: Request, res: Response) {
    const { branchId, q, page: reqPage, limit: reqLimit } = req.query;
    const query: any = { isDeleted: false };
    if (branchId && branchId !== 'ALL') query.assignedBranchIds = branchId;
    if (q) {
      query.$or = [
        { title: { $regex: q as string, $options: 'i' } },
        { subtitle: { $regex: q as string, $options: 'i' } },
        { overview: { $regex: q as string, $options: 'i' } },
      ];
    }

    const limit = reqLimit ? parseInt(reqLimit as string, 10) : 10;
    const page = reqPage ? parseInt(reqPage as string, 10) : 1;
    const skip = (page - 1) * limit;

    const [packages, total] = await Promise.all([
      CarePackage.find(query)
        .populate('assignedBranchIds', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CarePackage.countDocuments(query),
    ]);

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: 'Care packages fetched successfully',
      data: packages,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  }

  static async createPackage(req: Request, res: Response) {
    const pkg = await CarePackage.create(req.body);
    return res.status(201).json(ApiResponse.success(pkg, 'Care package created successfully'));
  }

  static async updatePackage(req: Request, res: Response) {
    const updated = await CarePackage.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
    return res.status(200).json(ApiResponse.success(updated, 'Care package updated successfully'));
  }

  static async deletePackage(req: Request, res: Response) {
    const deleted = await CarePackage.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    return res.status(200).json(ApiResponse.success(null, 'Care package deleted successfully'));
  }
}
