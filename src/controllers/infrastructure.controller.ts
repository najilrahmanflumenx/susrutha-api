import { Request, Response } from 'express';
import { Infrastructure } from '../models/Infrastructure.model';
import { ApiResponse } from '../utils/ApiResponse';
import { resolveBranchObjectId } from '../utils/branchResolver';

export class InfrastructureController {
  static async getAllInfrastructure(req: Request, res: Response) {
    const facilities = await Infrastructure.find({ isDeleted: false }).populate('branchId', 'name code');
    return res.status(200).json(ApiResponse.success(facilities, 'Infrastructure facilities fetched successfully'));
  }

  static async createFacility(req: Request, res: Response) {
    if (!req.body.branchId && (req.body.branchCode || req.body.preferredBranch)) {
      req.body.branchId = await resolveBranchObjectId(req.body.branchCode || req.body.preferredBranch);
    }
    if (!req.body.branchId) {
      req.body.branchId = await resolveBranchObjectId('KTK');
    }
    const facility = await Infrastructure.create(req.body);
    return res.status(201).json(ApiResponse.success(facility, 'Facility created successfully'));
  }

  static async updateFacility(req: Request, res: Response) {
    if (!req.body.branchId && (req.body.branchCode || req.body.preferredBranch)) {
      req.body.branchId = await resolveBranchObjectId(req.body.branchCode || req.body.preferredBranch);
    }
    const updated = await Infrastructure.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
    return res.status(200).json(ApiResponse.success(updated, 'Facility updated successfully'));
  }

  static async deleteFacility(req: Request, res: Response) {
    const deleted = await Infrastructure.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    return res.status(200).json(ApiResponse.success(null, 'Facility deleted successfully'));
  }
}
