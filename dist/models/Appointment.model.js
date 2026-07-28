"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const mongoose_1 = require("mongoose");
const AppointmentSchema = new mongoose_1.Schema({
    appointmentNumber: { type: String, required: true, unique: true },
    patientName: { type: String, required: true, trim: true },
    patientPhone: { type: String, required: true, trim: true },
    patientEmail: { type: String, lowercase: true, trim: true },
    patientAge: { type: Number },
    patientGender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'] },
    branchId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Branch', required: true },
    departmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Department' },
    doctorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Doctor' },
    consultationType: {
        type: String,
        enum: ['OPD_INPERSON', 'IPD_ADMISSION', 'TELE_CONSULTATION'],
        default: 'OPD_INPERSON',
    },
    preferredDate: { type: Date, required: true },
    preferredTimeSlot: { type: String, required: true },
    symptomsNote: { type: String },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
        default: 'PENDING',
    },
    adminNotes: { type: String },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
AppointmentSchema.index({ branchId: 1, preferredDate: 1 });
AppointmentSchema.index({ doctorId: 1, preferredDate: 1 });
exports.Appointment = (0, mongoose_1.model)('Appointment', AppointmentSchema);
