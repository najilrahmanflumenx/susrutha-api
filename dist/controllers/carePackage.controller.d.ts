import { Request, Response } from 'express';
export declare class CarePackageController {
    static getAllPackages(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createPackage(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updatePackage(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static deletePackage(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
