import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

const JWT_SECRET = process.env.JWT_SECRET || 'susrutha_secret_key_2026';

export class AuthController {
  // POST /api/v1/admin/auth/login
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ApiError.badRequest('Email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase(), status: 'ACTIVE' }).populate('roleId');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.roleId,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json(
      ApiResponse.success(
        {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            roleId: user.roleId,   // populated Role document: { _id, name, displayName, permissions }
            roleName: typeof user.roleId === 'object' ? (user.roleId as any)?.name : '',
          },
        },
        'Admin authentication successful'
      )
    );
  }

  // GET /api/v1/admin/auth/me
  static async getProfile(req: Request, res: Response) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw ApiError.unauthorized('No auth token provided');

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).populate('roleId').select('-passwordHash');
      if (!user) throw ApiError.unauthorized('User not found');
      return res.status(200).json(ApiResponse.success(user, 'User profile fetched'));
    } catch (err) {
      throw ApiError.unauthorized('Invalid or expired auth token');
    }
  }
}
