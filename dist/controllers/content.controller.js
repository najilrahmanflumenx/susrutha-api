"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentController = void 0;
const CarePackage_model_1 = require("../models/CarePackage.model");
const Infrastructure_model_1 = require("../models/Infrastructure.model");
const Blog_model_1 = require("../models/Blog.model");
const Testimonial_model_1 = require("../models/Testimonial.model");
const FAQ_model_1 = require("../models/FAQ.model");
const Lead_model_1 = require("../models/Lead.model");
const ApiResponse_1 = require("../utils/ApiResponse");
class ContentController {
    static async getPackages(req, res, next) {
        try {
            const { branchId } = req.query;
            const query = { isDeleted: false, status: 'ACTIVE' };
            if (branchId)
                query.assignedBranchIds = branchId;
            const packages = await CarePackage_model_1.CarePackage.find(query).sort({ sortOrder: 1 });
            res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Care packages fetched', packages));
        }
        catch (error) {
            next(error);
        }
    }
    static async getInfrastructure(req, res, next) {
        try {
            const { branchId, category } = req.query;
            const query = { isDeleted: false, status: 'ACTIVE' };
            if (branchId)
                query.branchId = branchId;
            if (category)
                query.category = category;
            const items = await Infrastructure_model_1.Infrastructure.find(query).sort({ sortOrder: 1 });
            res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Infrastructure items fetched', items));
        }
        catch (error) {
            next(error);
        }
    }
    static async getBlogs(_req, res, next) {
        try {
            const blogs = await Blog_model_1.Blog.find({ isDeleted: false, status: 'PUBLISHED' }).sort({ publishedAt: -1 });
            res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Blogs fetched', blogs));
        }
        catch (error) {
            next(error);
        }
    }
    static async getTestimonials(_req, res, next) {
        try {
            const testimonials = await Testimonial_model_1.Testimonial.find({ isDeleted: false, status: 'ACTIVE' }).sort({ rating: -1, createdAt: -1 });
            res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Testimonials fetched', testimonials));
        }
        catch (error) {
            next(error);
        }
    }
    static async getFAQs(_req, res, next) {
        try {
            const faqs = await FAQ_model_1.FAQ.find({ isDeleted: false, status: 'ACTIVE' }).sort({ sortOrder: 1 });
            res.status(200).json(new ApiResponse_1.ApiResponse(200, 'FAQs fetched', faqs));
        }
        catch (error) {
            next(error);
        }
    }
    static async createLead(req, res, next) {
        try {
            const lead = await Lead_model_1.Lead.create(req.body);
            res.status(201).json(new ApiResponse_1.ApiResponse(201, 'Lead submitted successfully', lead));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ContentController = ContentController;
