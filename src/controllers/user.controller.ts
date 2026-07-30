import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import { Role } from '../models/Role.model';
import { Branch } from '../models/Branch.model';
import { ApiResponse } from '../utils/ApiResponse';

export class UserController {
  static async getAllUsers(req: Request, res: Response) {
    const users = await User.find({ isDeleted: false })
      .populate('roleId', 'name displayName')
      .populate('assignedBranchIds', 'name code')
      .select('-passwordHash');
    return res.status(200).json(ApiResponse.success(users, 'Users fetched successfully'));
  }

  static async createUser(req: Request, res: Response) {
    const payload: any = { ...req.body };

    // Hash password
    const rawPassword = payload.password || 'SusruthaUser2026!';
    delete payload.password;
    payload.passwordHash = await bcrypt.hash(rawPassword, 10);

    // Resolve roleId from roleCode or roleName
    if (!payload.roleId) {
      const roleCode = payload.roleCode || payload.roleName;
      let role = null;
      if (roleCode) {
        role = await Role.findOne({
          $or: [
            { name: roleCode.toUpperCase() },
            { displayName: { $regex: roleCode, $options: 'i' } },
          ],
          isDeleted: false,
        });
      }
      // Fallback: use any active role
      if (!role) role = await Role.findOne({ isDeleted: false, status: 'ACTIVE' });
      if (role) payload.roleId = role._id;
    }
    delete payload.roleCode;
    delete payload.roleName;

    // Resolve branchScope → assignedBranchIds
    if (!payload.assignedBranchIds) {
      const branchScope: string = payload.branchScope || 'GLOBAL';
      delete payload.branchScope;
      if (branchScope !== 'GLOBAL') {
        const branch = await Branch.findOne({ code: branchScope, isDeleted: false });
        if (branch) payload.assignedBranchIds = [branch._id];
      } else {
        // GLOBAL = access to all branches
        const allBranches = await Branch.find({ isDeleted: false }).select('_id');
        payload.assignedBranchIds = allBranches.map((b: any) => b._id);
      }
    }

    if (!payload.roleId) {
      return res.status(400).json({ success: false, message: 'No roles found in database. Please create a role first.' });
    }

    const user = await User.create(payload);
    const populatedUser = await User.findById(user._id)
      .populate('roleId', 'name displayName')
      .populate('assignedBranchIds', 'name code')
      .select('-passwordHash');
    return res.status(201).json(ApiResponse.success(populatedUser, 'User created successfully'));
  }

  static async updateUser(req: Request, res: Response) {
    const payload: any = { ...req.body };
    if (payload.password) {
      payload.passwordHash = await bcrypt.hash(payload.password, 10);
      delete payload.password;
    }
    if (payload.roleCode && !payload.roleId) {
      const role = await Role.findOne({ name: payload.roleCode.toUpperCase(), isDeleted: false });
      if (role) payload.roleId = role._id;
      delete payload.roleCode;
    }

    const updated = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      payload,
      { new: true, runValidators: true }
    ).populate('roleId', 'name displayName').select('-passwordHash');

    return res.status(200).json(ApiResponse.success(updated, 'User updated successfully'));
  }

  static async deleteUser(req: Request, res: Response) {
    await User.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    return res.status(200).json(ApiResponse.success(null, 'User deleted successfully'));
  }
}
