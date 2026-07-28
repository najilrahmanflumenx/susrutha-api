"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Infrastructure = void 0;
const mongoose_1 = require("mongoose");
const InfrastructureSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    category: {
        type: String,
        enum: ['ROOMS', 'PANCHAKARMA_SUITES', 'OPERATING_THEATRE', 'PHYSIOTHERAPY', 'YOGA_HALL', 'AYUR_VILLAGE', 'OTHER'],
        required: true,
    },
    branchId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Branch', required: true },
    description: { type: String, required: true },
    specifications: [{ type: String }],
    capacity: { type: Number },
    coverImage: { type: String },
    galleryImages: [{ type: String }],
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
InfrastructureSchema.index({ branchId: 1, category: 1 });
exports.Infrastructure = (0, mongoose_1.model)('Infrastructure', InfrastructureSchema);
