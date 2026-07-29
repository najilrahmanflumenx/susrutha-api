"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchController = void 0;
const Branch_model_1 = require("../models/Branch.model");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
class BranchController {
    static async getAllBranches(req, res, next) {
        try {
            const { q, type, page: reqPage, limit: reqLimit } = req.query;
            const query = { isDeleted: false };
            if (type && type !== 'ALL')
                query.type = type;
            if (q) {
                query.$or = [
                    { name: { $regex: q, $options: 'i' } },
                    { code: { $regex: q, $options: 'i' } },
                    { 'address.city': { $regex: q, $options: 'i' } },
                ];
            }
            const limit = reqLimit ? parseInt(reqLimit, 10) : 10;
            const page = reqPage ? parseInt(reqPage, 10) : 1;
            const skip = (page - 1) * limit;
            const [branches, total] = await Promise.all([
                Branch_model_1.Branch.find(query).sort({ isMainBranch: -1, name: 1 }).skip(skip).limit(limit),
                Branch_model_1.Branch.countDocuments(query),
            ]);
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: 'Branches fetched successfully',
                data: branches,
                meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getBranchById(req, res, next) {
        try {
            const branch = await Branch_model_1.Branch.findOne({ _id: req.params.id, isDeleted: false });
            if (!branch)
                throw new ApiError_1.ApiError(404, 'Branch not found');
            res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Branch fetched successfully', branch));
        }
        catch (error) {
            next(error);
        }
    }
    static async createBranch(req, res, next) {
        try {
            const newBranch = await Branch_model_1.Branch.create(req.body);
            res.status(201).json(new ApiResponse_1.ApiResponse(201, 'Branch created successfully', newBranch));
        }
        catch (error) {
            next(error);
        }
    }
    static async updateBranch(req, res, next) {
        try {
            const updated = await Branch_model_1.Branch.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
            if (!updated)
                throw new ApiError_1.ApiError(404, 'Branch not found');
            res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Branch updated successfully', updated));
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteBranch(req, res, next) {
        try {
            const deleted = await Branch_model_1.Branch.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true, deletedAt: new Date() }, { new: true });
            if (!deleted)
                throw new ApiError_1.ApiError(404, 'Branch not found');
            res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Branch deleted successfully', null));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BranchController = BranchController;
