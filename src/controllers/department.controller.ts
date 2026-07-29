import { Request, Response } from 'express';
import { Department } from '../models/Department.model';
import { ApiResponse } from '../utils/ApiResponse';

export class DepartmentController {
  static async getAllDepartments(req: Request, res: Response) {
    const departments = await Department.find({ isDeleted: false }).populate('assignedBranchIds', 'name code');
    return res.status(200).json(ApiResponse.success(departments, 'Departments fetched successfully'));
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
