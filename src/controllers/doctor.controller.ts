import { Request, Response, NextFunction } from 'express';
import { Doctor } from '../models/Doctor.model';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { resolveBranchObjectId, resolveBranchObjectIds } from '../utils/branchResolver';

export class DoctorController {
  public static async getAllDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const { branchId, branchCode, departmentId, isDirector, q, page: reqPage, limit: reqLimit } = req.query;
      const query: any = { isDeleted: false };

      const branchParam = branchId || branchCode || req.query.assignedBranchIds;
      if (branchParam) {
        const resolvedBranchId = await resolveBranchObjectId(branchParam);
        if (resolvedBranchId) {
          query.assignedBranchIds = resolvedBranchId;
        }
      }
      if (departmentId) {
        query.departmentId = departmentId;
      }
      if (isDirector !== undefined) {
        query.isDirector = isDirector === 'true';
      }
      if (q) {
        query.$or = [
          { name: { $regex: q as string, $options: 'i' } },
          { qualifications: { $regex: q as string, $options: 'i' } },
          { designation: { $regex: q as string, $options: 'i' } },
          { specialties: { $regex: q as string, $options: 'i' } },
        ];
      }

      const isAll = req.query.all === 'true' || reqLimit === '0' || reqLimit === 'all';
      const limit = isAll ? 1000 : reqLimit ? parseInt(reqLimit as string, 10) : 50;
      const page = reqPage ? parseInt(reqPage as string, 10) : 1;
      const skip = (page - 1) * limit;

      const [doctors, total] = await Promise.all([
        Doctor.find(query)
          .populate('departmentId', 'title slug code')
          .populate('assignedBranchIds', 'name code type')
          .sort({ sortOrder: 1, name: 1 })
          .skip(skip)
          .limit(limit),
        Doctor.countDocuments(query),
      ]);

      res.status(200).json({
        statusCode: 200,
        success: true,
        message: 'Doctors fetched successfully',
        data: doctors,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getDoctorBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const doctor = await Doctor.findOne({ slug: req.params.slug, isDeleted: false })
        .populate('departmentId', 'title slug code')
        .populate('assignedBranchIds', 'name code type address');

      if (!doctor) throw new ApiError(404, 'Doctor not found');
      res.status(200).json(new ApiResponse(200, 'Doctor details fetched', doctor));
    } catch (error) {
      next(error);
    }
  }

  public static async createDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.slug && req.body.name) {
        req.body.slug = req.body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      if (req.body.assignedBranchIds || req.body.branchCode) {
        const rawBranches = req.body.assignedBranchIds || req.body.branchCode;
        req.body.assignedBranchIds = await resolveBranchObjectIds(rawBranches);
      }

      const doctor = await Doctor.create(req.body);
      res.status(201).json(new ApiResponse(201, 'Doctor profile created', doctor));
    } catch (error) {
      next(error);
    }
  }

  public static async updateDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.slug && req.body.name) {
        req.body.slug = req.body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      if (req.body.assignedBranchIds || req.body.branchCode) {
        const rawBranches = req.body.assignedBranchIds || req.body.branchCode;
        req.body.assignedBranchIds = await resolveBranchObjectIds(rawBranches);
      }

      const updated = await Doctor.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated) throw new ApiError(404, 'Doctor not found');
      res.status(200).json(new ApiResponse(200, 'Doctor profile updated', updated));
    } catch (error) {
      next(error);
    }
  }

  public static async deleteDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await Doctor.findOneAndUpdate(
        { _id: req.params.id },
        { isDeleted: true },
        { new: true }
      );
      if (!deleted) throw new ApiError(404, 'Doctor not found');
      res.status(200).json(new ApiResponse(200, 'Doctor deleted successfully', null));
    } catch (error) {
      next(error);
    }
  }
}
