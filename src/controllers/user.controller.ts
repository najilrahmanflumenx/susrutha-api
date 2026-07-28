import { Request, Response } from 'express';
import { User } from '../models/User.model';
import { ApiResponse } from '../utils/ApiResponse';

export class UserController {
  static async getAllUsers(req: Request, res: Response) {
    const users = await User.find({ isDeleted: false }).populate('roleId', 'name displayName').select('-passwordHash');
    return res.status(200).json(ApiResponse.success(users, 'Users fetched successfully'));
  }

  static async createUser(req: Request, res: Response) {
    const user = await User.create(req.body);
    return res.status(201).json(ApiResponse.success(user, 'User created successfully'));
  }
}
