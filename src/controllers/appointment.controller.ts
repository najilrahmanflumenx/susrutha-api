import { Request, Response, NextFunction } from 'express';
import { Appointment } from '../models/Appointment.model';
import { Branch } from '../models/Branch.model';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export class AppointmentController {
  public static async getAllAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const { branchId, branchCode, doctorId, status, date, q, page: reqPage, limit: reqLimit } = req.query;
      const query: any = { isDeleted: false };

      if (branchId && branchId !== 'ALL') {
        query.branchId = branchId;
      } else if (branchCode && branchCode !== 'ALL') {
        const branchObj = await Branch.findOne({ code: branchCode, isDeleted: false });
        if (branchObj) {
          query.branchId = branchObj._id;
        }
      }
      if (doctorId) query.doctorId = doctorId;
      if (status) query.status = status;
      if (date) {
        const startDate = new Date(date as string);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date as string);
        endDate.setHours(23, 59, 59, 999);
        query.preferredDate = { $gte: startDate, $lte: endDate };
      }
      if (q) {
        query.$or = [
          { patientName: { $regex: q as string, $options: 'i' } },
          { patientPhone: { $regex: q as string, $options: 'i' } },
          { patientEmail: { $regex: q as string, $options: 'i' } },
          { appointmentNumber: { $regex: q as string, $options: 'i' } },
        ];
      }

      const limit = reqLimit ? parseInt(reqLimit as string, 10) : 10;
      const page = reqPage ? parseInt(reqPage as string, 10) : 1;
      const skip = (page - 1) * limit;

      const [appointments, total] = await Promise.all([
        Appointment.find(query)
          .populate('branchId', 'name code type')
          .populate('departmentId', 'title slug')
          .populate('doctorId', 'name designation photo')
          .sort({ preferredDate: -1, createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Appointment.countDocuments(query),
      ]);

      res.status(200).json({
        statusCode: 200,
        success: true,
        message: 'Appointments list fetched',
        data: appointments,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const apptNum = `SUS-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`;
      const appointment = await Appointment.create({
        ...req.body,
        appointmentNumber: apptNum,
      });
      res.status(201).json(new ApiResponse(201, 'Appointment booked successfully', appointment));
    } catch (error) {
      next(error);
    }
  }

  public static async updateAppointmentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await Appointment.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated) throw new ApiError(404, 'Appointment not found');
      res.status(200).json(new ApiResponse(200, 'Appointment status updated', updated));
    } catch (error) {
      next(error);
    }
  }

  public static async updateAppointment(req: Request, res: Response, next: NextFunction) {
    return AppointmentController.updateAppointmentStatus(req, res, next);
  }

  public static async deleteAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await Appointment.findOneAndUpdate(
        { _id: req.params.id },
        { isDeleted: true },
        { new: true }
      );
      if (!deleted) throw new ApiError(404, 'Appointment not found');
      res.status(200).json(new ApiResponse(200, 'Appointment deleted successfully', null));
    } catch (error) {
      next(error);
    }
  }
}
