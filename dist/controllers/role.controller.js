"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const Role_model_1 = require("../models/Role.model");
const ApiResponse_1 = require("../utils/ApiResponse");
class RoleController {
    static async getAllRoles(req, res) {
        const roles = await Role_model_1.Role.find({ isDeleted: false });
        return res.status(200).json(ApiResponse_1.ApiResponse.success(roles, 'Roles fetched successfully'));
    }
    static async createRole(req, res) {
        const role = await Role_model_1.Role.create(req.body);
        return res.status(201).json(ApiResponse_1.ApiResponse.success(role, 'Role created successfully'));
    }
    static async updateRole(req, res) {
        const updated = await Role_model_1.Role.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
        return res.status(200).json(ApiResponse_1.ApiResponse.success(updated, 'Role updated successfully'));
    }
    static async deleteRole(req, res) {
        const deleted = await Role_model_1.Role.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
        return res.status(200).json(ApiResponse_1.ApiResponse.success(null, 'Role deleted successfully'));
    }
}
exports.RoleController = RoleController;
