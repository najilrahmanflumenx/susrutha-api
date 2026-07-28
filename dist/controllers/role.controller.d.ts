import { Request, Response } from 'express';
export declare class RoleController {
    static getAllRoles(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createRole(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
