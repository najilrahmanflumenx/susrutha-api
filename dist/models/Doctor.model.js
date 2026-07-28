"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doctor = void 0;
const mongoose_1 = require("mongoose");
const DoctorSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    designation: { type: String, required: true },
    qualifications: { type: String, required: true },
    registrationNumber: { type: String },
    experienceYears: { type: Number, default: 0 },
    departmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Department', required: true },
    assignedBranchIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Branch', required: true }],
    bio: { type: String, required: true },
    photo: { type: String },
    consultationFee: { type: Number, default: 0 },
    availability: [
        {
            branchId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Branch', required: true },
            days: [{ type: String }],
            timeSlots: [{ type: String }],
        },
    ],
    specialties: [{ type: String }],
    languagesSpoken: [{ type: String }],
    sortOrder: { type: Number, default: 0 },
    isDirector: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['ACTIVE', 'ON_LEAVE', 'INACTIVE'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
DoctorSchema.index({ assignedBranchIds: 1 });
DoctorSchema.index({ departmentId: 1 });
exports.Doctor = (0, mongoose_1.model)('Doctor', DoctorSchema);
