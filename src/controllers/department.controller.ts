import { Request, Response } from 'express';
import { Department } from '../models/Department.model';
import { Branch } from '../models/Branch.model';
import { ApiResponse } from '../utils/ApiResponse';

async function processDepartmentBody(body: any) {
  if (!body.slug && body.title) {
    body.slug = body.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  const img = body.image || body.coverImage;
  if (img) {
    body.image = img;
    body.coverImage = img;
  }

  // Handle branch assignment mapping
  if (body.branchCode || (body.assignedBranchIds && body.assignedBranchIds.length > 0)) {
    const rawBranchRef = body.branchCode || (Array.isArray(body.assignedBranchIds) ? body.assignedBranchIds[0] : body.assignedBranchIds);

    if (rawBranchRef && rawBranchRef !== 'ALL') {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(rawBranchRef.toString());
      const branchDoc = await Branch.findOne({
        $or: [
          ...(isObjectId ? [{ _id: rawBranchRef }] : []),
          { code: rawBranchRef.toString().toUpperCase() },
        ],
        isDeleted: false,
      });

      if (branchDoc) {
        body.assignedBranchIds = [branchDoc._id];
        body.branchCode = branchDoc.code;
      }
    } else if (rawBranchRef === 'ALL') {
      const allBranches = await Branch.find({ isDeleted: false, status: 'ACTIVE' }).select('_id code');
      body.assignedBranchIds = allBranches.map((b) => b._id);
      body.branchCode = 'ALL';
    }
  }
}

export class DepartmentController {
  static async getAllDepartments(req: Request, res: Response) {
    const { q, page: reqPage, limit: reqLimit } = req.query;
    const query: any = { isDeleted: false };
    if (q) {
      query.$or = [
        { title: { $regex: q as string, $options: 'i' } },
        { code: { $regex: q as string, $options: 'i' } },
        { description: { $regex: q as string, $options: 'i' } },
      ];
    }

    const limit = reqLimit ? parseInt(reqLimit as string, 10) : 10;
    const page = reqPage ? parseInt(reqPage as string, 10) : 1;
    const skip = (page - 1) * limit;

    const [departments, total] = await Promise.all([
      Department.find(query)
        .populate('assignedBranchIds', 'name code')
        .sort({ sortOrder: 1, title: 1 })
        .skip(skip)
        .limit(limit),
      Department.countDocuments(query),
    ]);

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: 'Departments fetched successfully',
      data: departments,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  }

  static async createDepartment(req: Request, res: Response) {
    await processDepartmentBody(req.body);
    const department = await Department.create(req.body);
    return res.status(201).json(ApiResponse.success(department, 'Department created successfully'));
  }

  static async updateDepartment(req: Request, res: Response) {
    await processDepartmentBody(req.body);
    const updated = await Department.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
    return res.status(200).json(ApiResponse.success(updated, 'Department updated successfully'));
  }

  static async deleteDepartment(req: Request, res: Response) {
    const deleted = await Department.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    return res.status(200).json(ApiResponse.success(null, 'Department deleted successfully'));
  }
}
