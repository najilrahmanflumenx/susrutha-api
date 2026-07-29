"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarePackageController = void 0;
const CarePackage_model_1 = require("../models/CarePackage.model");
const ApiResponse_1 = require("../utils/ApiResponse");
class CarePackageController {
    static async getAllPackages(req, res) {
        const { branchId, q, page: reqPage, limit: reqLimit } = req.query;
        const query = { isDeleted: false };
        if (branchId && branchId !== 'ALL')
            query.assignedBranchIds = branchId;
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { subtitle: { $regex: q, $options: 'i' } },
                { overview: { $regex: q, $options: 'i' } },
            ];
        }
        const limit = reqLimit ? parseInt(reqLimit, 10) : 10;
        const page = reqPage ? parseInt(reqPage, 10) : 1;
        const skip = (page - 1) * limit;
        const [packages, total] = await Promise.all([
            CarePackage_model_1.CarePackage.find(query)
                .populate('assignedBranchIds', 'name code')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            CarePackage_model_1.CarePackage.countDocuments(query),
        ]);
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Care packages fetched successfully',
            data: packages,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
        });
    }
    static async createPackage(req, res) {
        const pkg = await CarePackage_model_1.CarePackage.create(req.body);
        return res.status(201).json(ApiResponse_1.ApiResponse.success(pkg, 'Care package created successfully'));
    }
    static async updatePackage(req, res) {
        const updated = await CarePackage_model_1.CarePackage.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
        return res.status(200).json(ApiResponse_1.ApiResponse.success(updated, 'Care package updated successfully'));
    }
    static async deletePackage(req, res) {
        const deleted = await CarePackage_model_1.CarePackage.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
        return res.status(200).json(ApiResponse_1.ApiResponse.success(null, 'Care package deleted successfully'));
    }
}
exports.CarePackageController = CarePackageController;
