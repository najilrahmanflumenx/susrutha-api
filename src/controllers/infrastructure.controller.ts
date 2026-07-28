import { Request, Response } from 'express';
import { Infrastructure } from '../models/Infrastructure.model';
import { ApiResponse } from '../utils/ApiResponse';

export class InfrastructureController {
  static async getAllInfrastructure(req: Request, res: Response) {
    const facilities = await Infrastructure.find({ isDeleted: false }).populate('branchId', 'name code');
    return res.status(200).json(ApiResponse.success(facilities, 'Infrastructure facilities fetched successfully'));
  }

  static async createFacility(req: Request, res: Response) {
    const facility = await Infrastructure.create(req.body);
    return res.status(201).json(ApiResponse.success(facility, 'Facility created successfully'));
  }
}
