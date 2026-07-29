"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentController = void 0;
const Department_model_1 = require("../models/Department.model");
const ApiResponse_1 = require("../utils/ApiResponse");
class DepartmentController {
    static async getAllDepartments(req, res) {
        const { q, page: reqPage, limit: reqLimit } = req.query;
        const query = { isDeleted: false };
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { code: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
            ];
        }
        const limit = reqLimit ? parseInt(reqLimit, 10) : 10;
        const page = reqPage ? parseInt(reqPage, 10) : 1;
        const skip = (page - 1) * limit;
        const [departments, total] = await Promise.all([
            Department_model_1.Department.find(query)
                .populate('assignedBranchIds', 'name code')
                .sort({ sortOrder: 1, title: 1 })
                .skip(skip)
                .limit(limit),
            Department_model_1.Department.countDocuments(query),
        ]);
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Departments fetched successfully',
            data: departments,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
        });
    }
    static async createDepartment(req, res) {
        const department = await Department_model_1.Department.create(req.body);
        return res.status(201).json(ApiResponse_1.ApiResponse.success(department, 'Department created successfully'));
    }
    static async updateDepartment(req, res) {
        const updated = await Department_model_1.Department.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
        return res.status(200).json(ApiResponse_1.ApiResponse.success(updated, 'Department updated successfully'));
    }
    static async deleteDepartment(req, res) {
        const deleted = await Department_model_1.Department.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
        return res.status(200).json(ApiResponse_1.ApiResponse.success(null, 'Department deleted successfully'));
    }
}
exports.DepartmentController = DepartmentController;
