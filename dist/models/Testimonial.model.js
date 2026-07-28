"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Testimonial = void 0;
const mongoose_1 = require("mongoose");
const TestimonialSchema = new mongoose_1.Schema({
    patientName: { type: String, required: true, trim: true },
    patientLocation: { type: String, default: 'Thiruvananthapuram' },
    treatmentReceived: { type: String },
    branchId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Branch' },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    reviewText: { type: String, required: true },
    patientPhoto: { type: String },
    videoUrl: { type: String },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.Testimonial = (0, mongoose_1.model)('Testimonial', TestimonialSchema);
