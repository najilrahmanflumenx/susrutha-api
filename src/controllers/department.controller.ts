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
}
