import { Request, Response } from 'express';
export declare class AuthController {
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
