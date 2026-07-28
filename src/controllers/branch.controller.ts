import { Request, Response, NextFunction } from 'express';
import { Branch } from '../models/Branch.model';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export class BranchController {
  public static async getAllBranches(req: Request, res: Response, next: NextFunction) {
    try {
      const branches = await Branch.find({ isDeleted: false }).sort({ isMainBranch: -1, name: 1 });
      res.status(200).json(new ApiResponse(200, 'Branches fetched successfully', branches));
    } catch (error) {
      next(error);
    }
  }

  public static async getBranchById(req: Request, res: Response, next: NextFunction) {
    try {
      const branch = await Branch.findOne({ _id: req.params.id, isDeleted: false });
      if (!branch) throw new ApiError(404, 'Branch not found');
      res.status(200).json(new ApiResponse(200, 'Branch fetched successfully', branch));
    } catch (error) {
      next(error);
    }
  }

  public static async createBranch(req: Request, res: Response, next: NextFunction) {
    try {
      const newBranch = await Branch.create(req.body);
      res.status(201).json(new ApiResponse(201, 'Branch created successfully', newBranch));
    } catch (error) {
      next(error);
    }
  }

  public static async updateBranch(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await Branch.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated) throw new ApiError(404, 'Branch not found');
      res.status(200).json(new ApiResponse(200, 'Branch updated successfully', updated));
    } catch (error) {
      next(error);
    }
  }

  public static async deleteBranch(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await Branch.findOneAndUpdate(
        { _id: req.params.id },
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
      );
      if (!deleted) throw new ApiError(404, 'Branch not found');
      res.status(200).json(new ApiResponse(200, 'Branch deleted successfully', null));
    } catch (error) {
      next(error);
    }
  }
}
