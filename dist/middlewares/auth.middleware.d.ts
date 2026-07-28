import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: any;
}
export declare const authenticateJWT: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requirePermission: (requiredPermission: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
