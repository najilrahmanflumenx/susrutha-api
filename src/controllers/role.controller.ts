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
}
