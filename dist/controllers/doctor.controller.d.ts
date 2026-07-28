import { Request, Response, NextFunction } from 'express';
export declare class DoctorController {
    static getAllDoctors(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getDoctorBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createDoctor(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateDoctor(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteDoctor(req: Request, res: Response, next: NextFunction): Promise<void>;
}
