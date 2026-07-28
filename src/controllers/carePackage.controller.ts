import { Request, Response } from 'express';
import { CarePackage } from '../models/CarePackage.model';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export class CarePackageController {
  static async getAllPackages(req: Request, res: Response) {
    const packages = await CarePackage.find({ isDeleted: false }).populate('assignedBranchIds', 'name code');
    return res.status(200).json(ApiResponse.success(packages, 'Care packages fetched successfully'));
  }

  static async createPackage(req: Request, res: Response) {
    const pkg = await CarePackage.create(req.body);
    return res.status(201).json(ApiResponse.success(pkg, 'Care package created successfully'));
  }
}
