"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const Blog_model_1 = require("../models/Blog.model");
const ApiResponse_1 = require("../utils/ApiResponse");
class BlogController {
    static async getAllBlogs(req, res) {
        const { branchId, q, page: reqPage, limit: reqLimit } = req.query;
        const query = { isDeleted: false };
        if (branchId && branchId !== 'ALL')
            query.branchId = branchId;
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { excerpt: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } },
            ];
        }
        const limit = reqLimit ? parseInt(reqLimit, 10) : 10;
        const page = reqPage ? parseInt(reqPage, 10) : 1;
        const skip = (page - 1) * limit;
        const [blogs, total] = await Promise.all([
            Blog_model_1.Blog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Blog_model_1.Blog.countDocuments(query),
        ]);
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Blogs fetched successfully',
            data: blogs,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
        });
    }
    static async createBlog(req, res) {
        const blog = await Blog_model_1.Blog.create(req.body);
        return res.status(201).json(ApiResponse_1.ApiResponse.success(blog, 'Blog created successfully'));
    }
    static async updateBlog(req, res) {
        const updated = await Blog_model_1.Blog.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
        return res.status(200).json(ApiResponse_1.ApiResponse.success(updated, 'Blog updated successfully'));
    }
    static async deleteBlog(req, res) {
        const deleted = await Blog_model_1.Blog.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
        return res.status(200).json(ApiResponse_1.ApiResponse.success(null, 'Blog deleted successfully'));
    }
}
exports.BlogController = BlogController;
