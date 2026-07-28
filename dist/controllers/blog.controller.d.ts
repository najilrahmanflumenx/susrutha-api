import { Request, Response } from 'express';
export declare class BlogController {
    static getAllBlogs(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static createBlog(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
