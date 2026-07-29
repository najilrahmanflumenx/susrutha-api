import { Request, Response, NextFunction } from 'express';
import { Branch } from '../models/Branch.model';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export class BranchController {
  public static async getAllBranches(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, type, page: reqPage, limit: reqLimit } = req.query;
      const query: any = { isDeleted: false };
      if (type && type !== 'ALL') query.type = type;
      if (q) {
        query.$or = [
          { name: { $regex: q as string, $options: 'i' } },
          { code: { $regex: q as string, $options: 'i' } },
          { 'address.city': { $regex: q as string, $options: 'i' } },
        ];
      }

      const limit = reqLimit ? parseInt(reqLimit as string, 10) : 10;
      const page = reqPage ? parseInt(reqPage as string, 10) : 1;
      const skip = (page - 1) * limit;

      const [branches, total] = await Promise.all([
        Branch.find(query).sort({ isMainBranch: -1, name: 1 }).skip(skip).limit(limit),
        Branch.countDocuments(query),
      ]);

      res.status(200).json({
        statusCode: 200,
        success: true,
        message: 'Branches fetched successfully',
        data: branches,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
      });
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
