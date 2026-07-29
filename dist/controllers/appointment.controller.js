"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const Appointment_model_1 = require("../models/Appointment.model");
const Branch_model_1 = require("../models/Branch.model");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
class AppointmentController {
    static async getAllAppointments(req, res, next) {
        try {
            const { branchId, branchCode, doctorId, status, date, q, page: reqPage, limit: reqLimit } = req.query;
            const query = { isDeleted: false };
            if (branchId && branchId !== 'ALL') {
                query.branchId = branchId;
            }
            else if (branchCode && branchCode !== 'ALL') {
                const branchObj = await Branch_model_1.Branch.findOne({ code: branchCode, isDeleted: false });
                if (branchObj) {
                    query.branchId = branchObj._id;
                }
            }
            if (doctorId)
                query.doctorId = doctorId;
            if (status)
                query.status = status;
            if (date) {
                const startDate = new Date(date);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(date);
                endDate.setHours(23, 59, 59, 999);
                query.preferredDate = { $gte: startDate, $lte: endDate };
            }
            if (q) {
                query.$or = [
                    { patientName: { $regex: q, $options: 'i' } },
                    { patientPhone: { $regex: q, $options: 'i' } },
                    { patientEmail: { $regex: q, $options: 'i' } },
                    { appointmentNumber: { $regex: q, $options: 'i' } },
                ];
            }
            const limit = reqLimit ? parseInt(reqLimit, 10) : 10;
            const page = reqPage ? parseInt(reqPage, 10) : 1;
            const skip = (page - 1) * limit;
            const [appointments, total] = await Promise.all([
                Appointment_model_1.Appointment.find(query)
                    .populate('branchId', 'name code type')
                    .populate('departmentId', 'title slug')
                    .populate('doctorId', 'name designation photo')
                    .sort({ preferredDate: -1, createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Appointment_model_1.Appointment.countDocuments(query),
            ]);
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: 'Appointments list fetched',
                data: appointments,
                meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async createAppointment(req, res, next) {
        try {
            const apptNum = `SUS-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`;
            const appointment = await Appointment_model_1.Appointment.create({
                ...req.body,
                appointmentNumber: apptNum,
            });
            res.status(201).json(new ApiResponse_1.ApiResponse(201, 'Appointment booked successfully', appointment));
        }
        catch (error) {
            next(error);
        }
    }
    static async updateAppointmentStatus(req, res, next) {
        try {
            const { status, adminNotes } = req.body;
            const updated = await Appointment_model_1.Appointment.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { status, adminNotes }, { new: true });
            if (!updated)
                throw new ApiError_1.ApiError(404, 'Appointment not found');
            res.status(200).json(new ApiResponse_1.ApiResponse(200, 'Appointment status updated', updated));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AppointmentController = AppointmentController;
