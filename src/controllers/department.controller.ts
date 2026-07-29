import { Request, Response } from 'express';
import { Department } from '../models/Department.model';
import { ApiResponse } from '../utils/ApiResponse';

export class DepartmentController {
  static async getAllDepartments(req: Request, res: Response) {
    const { q, page: reqPage, limit: reqLimit } = req.query;
    const query: any = { isDeleted: false };
    if (q) {
      query.$or = [
        { title: { $regex: q as string, $options: 'i' } },
        { code: { $regex: q as string, $options: 'i' } },
        { description: { $regex: q as string, $options: 'i' } },
      ];
    }

    const limit = reqLimit ? parseInt(reqLimit as string, 10) : 10;
    const page = reqPage ? parseInt(reqPage as string, 10) : 1;
    const skip = (page - 1) * limit;

    const [departments, total] = await Promise.all([
      Department.find(query)
        .populate('assignedBranchIds', 'name code')
        .sort({ sortOrder: 1, title: 1 })
        .skip(skip)
        .limit(limit),
      Department.countDocuments(query),
    ]);

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: 'Departments fetched successfully',
      data: departments,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  }

  static async createDepartment(req: Request, res: Response) {
    const department = await Department.create(req.body);
    return res.status(201).json(ApiResponse.success(department, 'Department created successfully'));
  }

  static async updateDepartment(req: Request, res: Response) {
    const updated = await Department.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
    return res.status(200).json(ApiResponse.success(updated, 'Department updated successfully'));
  }

  static async deleteDepartment(req: Request, res: Response) {
    const deleted = await Department.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    return res.status(200).json(ApiResponse.success(null, 'Department deleted successfully'));
  }
}
