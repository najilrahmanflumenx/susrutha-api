import { Request, Response } from 'express';
export declare class DepartmentController {
    static getAllDepartments(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createDepartment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
