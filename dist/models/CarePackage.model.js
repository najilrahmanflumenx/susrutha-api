"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarePackage = void 0;
const mongoose_1 = require("mongoose");
const CarePackageSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subtitle: { type: String },
    durationDays: { type: Number, required: true, default: 7 },
    assignedBranchIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Branch' }],
    overview: { type: String, required: true },
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    targetAilments: [{ type: String }],
    image: { type: String },
    price: { type: Number },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.CarePackage = (0, mongoose_1.model)('CarePackage', CarePackageSchema);
