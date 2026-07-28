import { Request, Response } from 'express';
export declare class SettingController {
    static getAllSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateSetting(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
