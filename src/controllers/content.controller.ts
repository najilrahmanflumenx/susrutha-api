import { Request, Response, NextFunction } from 'express';
import { CarePackage } from '../models/CarePackage.model';
import { Infrastructure } from '../models/Infrastructure.model';
import { Blog } from '../models/Blog.model';
import { Testimonial } from '../models/Testimonial.model';
import { FAQ } from '../models/FAQ.model';
import { Lead } from '../models/Lead.model';
import { ApiResponse } from '../utils/ApiResponse';
import { resolveBranchObjectId } from '../utils/branchResolver';

export class ContentController {
  public static async getPackages(req: Request, res: Response, next: NextFunction) {
    try {
      const { branchId, branchCode } = req.query;
      const query: any = { isDeleted: false, status: 'ACTIVE' };
      const resolved = await resolveBranchObjectId(branchId || branchCode);
      if (resolved) query.assignedBranchIds = resolved;
      const packages = await CarePackage.find(query).sort({ sortOrder: 1 });
      res.status(200).json(new ApiResponse(200, 'Care packages fetched', packages));
    } catch (error) { next(error); }
  }

  public static async getInfrastructure(req: Request, res: Response, next: NextFunction) {
    try {
      const { branchId, category } = req.query;
      const query: any = { isDeleted: false, status: 'ACTIVE' };
      if (branchId) query.branchId = branchId;
      if (category) query.category = category;
      const items = await Infrastructure.find(query).sort({ sortOrder: 1 });
      res.status(200).json(new ApiResponse(200, 'Infrastructure items fetched', items));
    } catch (error) { next(error); }
  }

  public static async getBlogs(_req: Request, res: Response, next: NextFunction) {
    try {
      const blogs = await Blog.find({ isDeleted: false, status: 'PUBLISHED' }).sort({ publishedAt: -1 });
      res.status(200).json(new ApiResponse(200, 'Blogs fetched', blogs));
    } catch (error) { next(error); }
  }

  public static async getTestimonials(_req: Request, res: Response, next: NextFunction) {
    try {
      const testimonials = await Testimonial.find({ isDeleted: false, status: 'ACTIVE' }).sort({ rating: -1, createdAt: -1 });
      res.status(200).json(new ApiResponse(200, 'Testimonials fetched', testimonials));
    } catch (error) { next(error); }
  }

  public static async getFAQs(_req: Request, res: Response, next: NextFunction) {
    try {
      const faqs = await FAQ.find({ isDeleted: false, status: 'ACTIVE' }).sort({ sortOrder: 1 });
      res.status(200).json(new ApiResponse(200, 'FAQs fetched', faqs));
    } catch (error) { next(error); }
  }

  public static async createLead(req: Request, res: Response, next: NextFunction) {
    try {
      const lead = await Lead.create(req.body);
      res.status(201).json(new ApiResponse(201, 'Lead submitted successfully', lead));
    } catch (error) { next(error); }
  }
}
