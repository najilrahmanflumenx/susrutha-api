import { Request, Response, NextFunction } from 'express';
import { Appointment } from '../models/Appointment.model';
import { Branch } from '../models/Branch.model';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export class AppointmentController {
  public static async getAllAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const { branchId, branchCode, doctorId, status, date } = req.query;
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

      const appointments = await Appointment.find(query)
        .populate('branchId', 'name code type')
        .populate('departmentId', 'title slug')
        .populate('doctorId', 'name designation photo')
        .sort({ preferredDate: -1, createdAt: -1 });

      res.status(200).json(new ApiResponse(200, 'Appointments list fetched', appointments));
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
      const { status, adminNotes } = req.body;
      const updated = await Appointment.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        { status, adminNotes },
        { new: true }
      );
      if (!updated) throw new ApiError(404, 'Appointment not found');
      res.status(200).json(new ApiResponse(200, 'Appointment status updated', updated));
    } catch (error) {
      next(error);
    }
  }
}
