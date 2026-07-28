"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentController = void 0;
const Department_model_1 = require("../models/Department.model");
const ApiResponse_1 = require("../utils/ApiResponse");
class DepartmentController {
    static async getAllDepartments(req, res) {
        const departments = await Department_model_1.Department.find({ isDeleted: false }).populate('assignedBranchIds', 'name code');
        return res.status(200).json(ApiResponse_1.ApiResponse.success(departments, 'Departments fetched successfully'));
    }
    static async createDepartment(req, res) {
        const department = await Department_model_1.Department.create(req.body);
        return res.status(201).json(ApiResponse_1.ApiResponse.success(department, 'Department created successfully'));
    }
}
exports.DepartmentController = DepartmentController;
