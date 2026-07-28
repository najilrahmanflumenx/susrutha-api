"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorController = void 0;
const Doctor_model_1 = require("../models/Doctor.model");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
class DoctorController {
    static async getAllDoctors(req, res, next) {
        try {
            const { branchId, departmentId, isDirector } = req.query;
            const query = { isDeleted: false };
            if (branchId) {
                query.assignedBranchIds = branchId;
            }
            if (departmentId) {
                query.departmentId = departmentId;
            }
            if (isDirector !== undefined) {
                query.isDirector = isDirector === 'true';
            }
            const doctors = await Doctor_model_1.Doctor.find(query)
                .populate('departmentId', 'title slug code')
                .populate('assignedBranchIds', 'name code type')
                .sort({ sortOrder: 1, name: 1 });
            res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Doctors fetched successfully', doctors));
        }
        catch (error) {
            next(error);
        }
    }
    static async getDoctorBySlug(req, res, next) {
        try {
            const doctor = await Doctor_model_1.Doctor.findOne({ slug: req.params.slug, isDeleted: false })
                .populate('departmentId', 'title slug code')
                .populate('assignedBranchIds', 'name code type address');
            if (!doctor)
                throw new ApiError_1.ApiError(404, 'Doctor not found');
            res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Doctor details fetched', doctor));
        }
        catch (error) {
            next(error);
        }
    }
    static async createDoctor(req, res, next) {
        try {
            const doctor = await Doctor_model_1.Doctor.create(req.body);
            res.status(201).json(new ApiResponse_1.ApiResponse(201, 'Doctor profile created', doctor));
        }
        catch (error) {
            next(error);
        }
    }
    static async updateDoctor(req, res, next) {
        try {
            const updated = await Doctor_model_1.Doctor.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
            if (!updated)
                throw new ApiError_1.ApiError(404, 'Doctor not found');
            res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Doctor profile updated', updated));
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteDoctor(req, res, next) {
        try {
            const deleted = await Doctor_model_1.Doctor.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
            if (!deleted)
                throw new ApiError_1.ApiError(404, 'Doctor not found');
            res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Doctor deleted successfully', null));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DoctorController = DoctorController;
