import { Request, Response } from 'express';
import { Role } from '../models/Role.model';
import { ApiResponse } from '../utils/ApiResponse';

export class RoleController {
  static async getAllRoles(req: Request, res: Response) {
    const roles = await Role.find({ isDeleted: false });
    return res.status(200).json(ApiResponse.success(roles, 'Roles fetched successfully'));
  }

  static async createRole(req: Request, res: Response) {
    const role = await Role.create(req.body);
    return res.status(201).json(ApiResponse.success(role, 'Role created successfully'));
  }

  static async updateRole(req: Request, res: Response) {
    const updated = await Role.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
    return res.status(200).json(ApiResponse.success(updated, 'Role updated successfully'));
  }

  static async deleteRole(req: Request, res: Response) {
    const deleted = await Role.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    return res.status(200).json(ApiResponse.success(null, 'Role deleted successfully'));
  }
}
