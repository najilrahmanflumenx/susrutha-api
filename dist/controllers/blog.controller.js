"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const Blog_model_1 = require("../models/Blog.model");
const ApiResponse_1 = require("../utils/ApiResponse");
class BlogController {
    static async getAllBlogs(req, res) {
        const blogs = await Blog_model_1.Blog.find({ isDeleted: false });
        return res.status(200).json(ApiResponse_1.ApiResponse.success(blogs, 'Blogs fetched successfully'));
    }
    static async createBlog(req, res) {
        const blog = await Blog_model_1.Blog.create(req.body);
        return res.status(201).json(ApiResponse_1.ApiResponse.success(blog, 'Blog created successfully'));
    }
}
exports.BlogController = BlogController;
