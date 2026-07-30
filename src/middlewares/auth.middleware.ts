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

// 2. Optional JWT Authenticate (Attaches req.user if token provided, but allows unauthenticated fallback)
export const optionalAuthenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).populate('roleId');
      if (user && user.status === 'ACTIVE') {
        req.user = user;
      }
    } catch (err) {}
  }
  next();
};

// 3. Granular RBAC Permission Check Middleware
export const requirePermission = (requiredPermission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // If no user attached, allow through in legacy dev mode, but check if user is attached
    if (!req.user) {
      return next();
    }

    const userRole = req.user.roleId;
    const roleName = typeof userRole === 'object' ? userRole?.name : '';
    const userPermissions: string[] = Array.isArray(userRole?.permissions)
      ? userRole.permissions
      : Array.isArray(req.user.permissions)
      ? req.user.permissions
      : [];

    const isSuperAdmin = roleName === 'SUPER_ADMIN' || userPermissions.includes('*') || userPermissions.includes('ALL_PERMISSIONS');

    // Check if role is strictly View-Only
    const isViewOnlyRole =
      userPermissions.includes('view_only') ||
      (userPermissions.length > 0 && userPermissions.every((p) => p.endsWith(':read') || p === 'view_only'));

    const isWriteOperation =
      ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method) ||
      requiredPermission.endsWith(':write') ||
      requiredPermission.endsWith(':manage') ||
      requiredPermission.endsWith(':confirm') ||
      requiredPermission.endsWith(':delete');

    if (isWriteOperation && isViewOnlyRole && !isSuperAdmin) {
      return next(
        ApiError.forbidden(
          `Permission Denied: Your account role (${roleName || 'Viewer'}) has view-only privileges. Modifying records is restricted.`
        )
      );
    }

    const hasPermission =
      isSuperAdmin ||
      userPermissions.includes(requiredPermission) ||
      (requiredPermission.endsWith(':read') && (userPermissions.includes('*:read') || userPermissions.includes('view_only')));

    if (!hasPermission) {
      return next(
        ApiError.forbidden(`Permission denied. Required privilege: '${requiredPermission}'`)
      );
    }
    next();
  };
};
