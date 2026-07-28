"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Department = void 0;
const mongoose_1 = require("mongoose");
const DepartmentSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    code: { type: String, uppercase: true, trim: true },
    tagline: { type: String },
    overview: { type: String, required: true },
    headDoctorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Doctor' },
    assignedBranchIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Branch' }],
    icon: { type: String },
    coverImage: { type: String },
    sortOrder: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
DepartmentSchema.index({ slug: 1 });
DepartmentSchema.index({ assignedBranchIds: 1 });
exports.Department = (0, mongoose_1.model)('Department', DepartmentSchema);
