"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadController = void 0;
const Lead_model_1 = require("../models/Lead.model");
const ApiResponse_1 = require("../utils/ApiResponse");
class LeadController {
    static async getAllLeads(req, res) {
        const leads = await Lead_model_1.Lead.find({ isDeleted: false }).populate('branchId', 'name code');
        return res.status(200).json(ApiResponse_1.ApiResponse.success(leads, 'Patient leads fetched successfully'));
    }
    static async createLead(req, res) {
        const lead = await Lead_model_1.Lead.create(req.body);
        return res.status(201).json(ApiResponse_1.ApiResponse.success(lead, 'Lead created successfully'));
    }
}
exports.LeadController = LeadController;
