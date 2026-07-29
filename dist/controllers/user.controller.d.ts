import { Request, Response } from 'express';
export declare class UserController {
    static getAllUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
