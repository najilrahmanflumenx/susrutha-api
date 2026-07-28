import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { ApiError } from '../utils/ApiError';

const JWT_SECRET = process.env.JWT_SECRET || 'susrutha_secret_key_2026';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

// 1. Verify JWT Authentication Middleware
export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Access denied. Authentication token required.'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).populate('roleId');
    if (!user || user.status !== 'ACTIVE') {
      return next(ApiError.unauthorized('User account is inactive or no longer exists.'));
    }
    req.user = user;
    next();
  } catch (err) {
    return next(ApiError.unauthorized('Invalid or expired authentication token. Please log in again.'));
  }
};

// 2. Granular RBAC Permission Check Middleware
export const requirePermission = (requiredPermission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('User authentication required.'));
    }

    const userPermissions: string[] = req.user.roleId?.permissions || [];

    // Super Admin wildcard check or explicit permission check
    const hasPermission =
      userPermissions.includes('*') ||
      userPermissions.includes('ALL_PERMISSIONS') ||
      userPermissions.includes(requiredPermission);

    if (!hasPermission) {
      return next(
        ApiError.forbidden(`Permission denied. Required privilege: '${requiredPermission}'`)
      );
    }
    next();
  };
};
