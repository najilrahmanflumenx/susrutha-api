import { Request, Response, NextFunction } from 'express';
export declare class ContentController {
    static getPackages(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getInfrastructure(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBlogs(_req: Request, res: Response, next: NextFunction): Promise<void>;
    static getTestimonials(_req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFAQs(_req: Request, res: Response, next: NextFunction): Promise<void>;
    static createLead(req: Request, res: Response, next: NextFunction): Promise<void>;
}
