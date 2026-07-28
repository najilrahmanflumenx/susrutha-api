import { Request, Response, NextFunction } from 'express';
export declare class AppointmentController {
    static getAllAppointments(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createAppointment(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateAppointmentStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}
