"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarePackageController = void 0;
const CarePackage_model_1 = require("../models/CarePackage.model");
const ApiResponse_1 = require("../utils/ApiResponse");
class CarePackageController {
    static async getAllPackages(req, res) {
        const packages = await CarePackage_model_1.CarePackage.find({ isDeleted: false }).populate('assignedBranchIds', 'name code');
        return res.status(200).json(ApiResponse_1.ApiResponse.success(packages, 'Care packages fetched successfully'));
    }
    static async createPackage(req, res) {
        const pkg = await CarePackage_model_1.CarePackage.create(req.body);
        return res.status(201).json(ApiResponse_1.ApiResponse.success(pkg, 'Care package created successfully'));
    }
}
exports.CarePackageController = CarePackageController;
