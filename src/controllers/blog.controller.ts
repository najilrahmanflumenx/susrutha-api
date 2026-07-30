import { Request, Response } from 'express';
import { Blog } from '../models/Blog.model';
import { ApiResponse } from '../utils/ApiResponse';

export class BlogController {
  static async getAllBlogs(req: Request, res: Response) {
    const { branchId, q, page: reqPage, limit: reqLimit } = req.query;
    const query: any = { isDeleted: false };
    if (branchId && branchId !== 'ALL') query.branchId = branchId;
    if (q) {
      query.$or = [
        { title: { $regex: q as string, $options: 'i' } },
        { excerpt: { $regex: q as string, $options: 'i' } },
        { category: { $regex: q as string, $options: 'i' } },
      ];
    }

    const limit = reqLimit ? parseInt(reqLimit as string, 10) : 10;
    const page = reqPage ? parseInt(reqPage as string, 10) : 1;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(query),
    ]);

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: 'Blogs fetched successfully',
      data: blogs,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  }

  static async createBlog(req: Request, res: Response) {
    if (!req.body.slug && req.body.title) {
      req.body.slug = req.body.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const blog = await Blog.create(req.body);
    return res.status(201).json(ApiResponse.success(blog, 'Blog created successfully'));
  }

  static async updateBlog(req: Request, res: Response) {
    if (!req.body.slug && req.body.title) {
      req.body.slug = req.body.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const updated = await Blog.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
    return res.status(200).json(ApiResponse.success(updated, 'Blog updated successfully'));
  }

  static async deleteBlog(req: Request, res: Response) {
    const deleted = await Blog.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    return res.status(200).json(ApiResponse.success(null, 'Blog deleted successfully'));
  }
}
