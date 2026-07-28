import { Request, Response } from 'express';
export declare class InfrastructureController {
    static getAllInfrastructure(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createFacility(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
