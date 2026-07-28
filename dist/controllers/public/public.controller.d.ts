import { Request, Response } from 'express';
export declare class PublicController {
    static getHome(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getBranches(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getDoctors(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getDoctorBySlug(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getDepartments(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getPackages(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getPackageBySlug(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getBlogs(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getBlogBySlug(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getFacilities(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getTestimonials(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getFaqs(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static bookAppointment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static submitLead(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static submitFeedback(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getConditions(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getConditionBySlug(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getTreatments(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getTreatmentBySlug(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getEcosystemPillars(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getEcosystemPillarBySlug(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getVideos(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getAffiliations(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
