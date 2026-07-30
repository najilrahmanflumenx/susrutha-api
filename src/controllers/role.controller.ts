import { Request, Response } from 'express';
import { Role } from '../models/Role.model';
import { ApiResponse } from '../utils/ApiResponse';
import { logAudit } from '../utils/auditLogger';

export class RoleController {
  static async getAllRoles(req: Request, res: Response) {
    const roles = await Role.find({ isDeleted: { $ne: true } });
    return res.status(200).json(ApiResponse.success(roles, 'Roles fetched successfully'));
  }

  static async createRole(req: Request, res: Response) {
    const role = await Role.create(req.body);
    await logAudit({
      action: 'ROLE_CREATED',
      module: 'RBAC',
      entityId: role._id.toString(),
      details: {
        summary: `Created new custom RBAC role "${role.displayName}" (${role.name})`,
        name: role.name,
        displayName: role.displayName,
        permissionsCount: role.permissions?.length || 0,
      },
    });
    return res.status(201).json(ApiResponse.success(role, 'Role created successfully'));
  }

  static async updateRole(req: Request, res: Response) {
    const updated = await Role.findOneAndUpdate({ _id: req.params.id, isDeleted: { $ne: true } }, req.body, { new: true, runValidators: true });
    await logAudit({
      action: 'ROLE_UPDATED',
      module: 'RBAC',
      entityId: req.params.id,
      details: {
        summary: `Configured permission matrix for role "${updated?.displayName || req.params.id}" (${updated?.permissions?.length || 0} permissions)`,
        name: updated?.name,
        displayName: updated?.displayName,
        permissions: updated?.permissions,
      },
    });
    return res.status(200).json(ApiResponse.success(updated, 'Role updated successfully'));
  }

  static async deleteRole(req: Request, res: Response) {
    await Role.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    await logAudit({
      action: 'ROLE_DELETED',
      module: 'RBAC',
      entityId: req.params.id,
      details: {
        summary: `Deleted RBAC system role (ID: ${req.params.id})`,
      },
    });
    return res.status(200).json(ApiResponse.success(null, 'Role deleted successfully'));
  }
}
