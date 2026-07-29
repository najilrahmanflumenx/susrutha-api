import { Request, Response } from 'express';
import { Blog } from '../models/Blog.model';
import { ApiResponse } from '../utils/ApiResponse';

export class BlogController {
  static async getAllBlogs(req: Request, res: Response) {
    const blogs = await Blog.find({ isDeleted: false });
    return res.status(200).json(ApiResponse.success(blogs, 'Blogs fetched successfully'));
  }

  static async createBlog(req: Request, res: Response) {
    const blog = await Blog.create(req.body);
    return res.status(201).json(ApiResponse.success(blog, 'Blog created successfully'));
  }

  static async updateBlog(req: Request, res: Response) {
    const updated = await Blog.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
    return res.status(200).json(ApiResponse.success(updated, 'Blog updated successfully'));
  }

  static async deleteBlog(req: Request, res: Response) {
    const deleted = await Blog.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    return res.status(200).json(ApiResponse.success(null, 'Blog deleted successfully'));
  }
}
