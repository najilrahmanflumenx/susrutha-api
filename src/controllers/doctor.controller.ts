import { Request, Response, NextFunction } from 'express';
import { Doctor } from '../models/Doctor.model';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export class DoctorController {
  public static async getAllDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const { branchId, departmentId, isDirector } = req.query;
      const query: any = { isDeleted: false };

      if (branchId) {
        query.assignedBranchIds = branchId;
      }
      if (departmentId) {
        query.departmentId = departmentId;
      }
      if (isDirector !== undefined) {
        query.isDirector = isDirector === 'true';
      }

      const doctors = await Doctor.find(query)
        .populate('departmentId', 'title slug code')
        .populate('assignedBranchIds', 'name code type')
        .sort({ sortOrder: 1, name: 1 });

      res.status(200).json(new ApiResponse(200, 'Doctors fetched successfully', doctors));
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
      const doctor = await Doctor.create(req.body);
      res.status(201).json(new ApiResponse(201, 'Doctor profile created', doctor));
    } catch (error) {
      next(error);
    }
  }

  public static async updateDoctor(req: Request, res: Response, next: NextFunction) {
    try {
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
