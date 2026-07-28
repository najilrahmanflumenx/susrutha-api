"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Branch = void 0;
const mongoose_1 = require("mongoose");
const BranchSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: {
        type: String,
        enum: ['INPATIENT_HOSPITAL', 'CITY_CLINIC', 'DIAGNOSTIC_CENTER'],
        default: 'INPATIENT_HOSPITAL',
    },
    tagline: { type: String },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, default: 'Kerala' },
        pincode: { type: String, required: true },
        coordinates: { lat: Number, lng: Number },
    },
    contact: {
        phone: [{ type: String, required: true }],
        email: { type: String, required: true, lowercase: true },
        emergencyPhone: { type: String },
    },
    opdTimings: { type: String, default: '09:00 AM - 07:00 PM' },
    bedCapacity: { type: Number, default: 0 },
    features: [{ type: String }],
    coverImage: { type: String },
    galleryImages: [{ type: String }],
    isMainBranch: { type: Boolean, default: false },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
BranchSchema.index({ code: 1, isDeleted: 1 });
BranchSchema.index({ status: 1 });
exports.Branch = (0, mongoose_1.model)('Branch', BranchSchema);
