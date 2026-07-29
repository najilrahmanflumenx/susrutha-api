"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfrastructureController = void 0;
const Infrastructure_model_1 = require("../models/Infrastructure.model");
const ApiResponse_1 = require("../utils/ApiResponse");
class InfrastructureController {
    static async getAllInfrastructure(req, res) {
        const facilities = await Infrastructure_model_1.Infrastructure.find({ isDeleted: false }).populate('branchId', 'name code');
        return res.status(200).json(ApiResponse_1.ApiResponse.success(facilities, 'Infrastructure facilities fetched successfully'));
    }
    static async createFacility(req, res) {
        const facility = await Infrastructure_model_1.Infrastructure.create(req.body);
        return res.status(201).json(ApiResponse_1.ApiResponse.success(facility, 'Facility created successfully'));
    }
    static async updateFacility(req, res) {
        const updated = await Infrastructure_model_1.Infrastructure.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
        return res.status(200).json(ApiResponse_1.ApiResponse.success(updated, 'Facility updated successfully'));
    }
    static async deleteFacility(req, res) {
        const deleted = await Infrastructure_model_1.Infrastructure.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
        return res.status(200).json(ApiResponse_1.ApiResponse.success(null, 'Facility deleted successfully'));
    }
}
exports.InfrastructureController = InfrastructureController;
