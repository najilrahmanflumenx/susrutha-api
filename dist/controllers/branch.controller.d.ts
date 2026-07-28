import { Request, Response, NextFunction } from 'express';
export declare class BranchController {
    static getAllBranches(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBranchById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createBranch(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateBranch(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteBranch(req: Request, res: Response, next: NextFunction): Promise<void>;
}
