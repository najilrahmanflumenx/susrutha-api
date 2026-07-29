"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadController = void 0;
const Lead_model_1 = require("../models/Lead.model");
const ApiResponse_1 = require("../utils/ApiResponse");
class LeadController {
    static async getAllLeads(req, res) {
        const { branchId, status, q, page: reqPage, limit: reqLimit } = req.query;
        const query = { isDeleted: false };
        if (branchId && branchId !== 'ALL')
            query.branchId = branchId;
        if (status)
            query.status = status;
        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { phone: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } },
                { subject: { $regex: q, $options: 'i' } },
            ];
        }
        const limit = reqLimit ? parseInt(reqLimit, 10) : 10;
        const page = reqPage ? parseInt(reqPage, 10) : 1;
        const skip = (page - 1) * limit;
        const [leads, total] = await Promise.all([
            Lead_model_1.Lead.find(query).populate('branchId', 'name code').sort({ createdAt: -1 }).skip(skip).limit(limit),
            Lead_model_1.Lead.countDocuments(query),
        ]);
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Patient leads fetched successfully',
            data: leads,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    }
    static async createLead(req, res) {
        const lead = await Lead_model_1.Lead.create(req.body);
        return res.status(201).json(ApiResponse_1.ApiResponse.success(lead, 'Lead created successfully'));
    }
    static async updateLead(req, res) {
        const updated = await Lead_model_1.Lead.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
        return res.status(200).json(ApiResponse_1.ApiResponse.success(updated, 'Lead updated successfully'));
    }
    static async deleteLead(req, res) {
        const deleted = await Lead_model_1.Lead.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
        return res.status(200).json(ApiResponse_1.ApiResponse.success(null, 'Lead deleted successfully'));
    }
}
exports.LeadController = LeadController;
