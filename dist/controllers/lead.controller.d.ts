import { Request, Response } from 'express';
export declare class LeadController {
    static getAllLeads(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createLead(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateLead(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static deleteLead(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
