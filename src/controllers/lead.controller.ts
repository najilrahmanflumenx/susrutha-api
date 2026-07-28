import { Request, Response } from 'express';
import { Lead } from '../models/Lead.model';
import { ApiResponse } from '../utils/ApiResponse';

export class LeadController {
  static async getAllLeads(req: Request, res: Response) {
    const leads = await Lead.find({ isDeleted: false }).populate('branchId', 'name code');
    return res.status(200).json(ApiResponse.success(leads, 'Patient leads fetched successfully'));
  }

  static async createLead(req: Request, res: Response) {
    const lead = await Lead.create(req.body);
    return res.status(201).json(ApiResponse.success(lead, 'Lead created successfully'));
  }
}
