"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lead = void 0;
const mongoose_1 = require("mongoose");
const LeadSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    subject: { type: String },
    message: { type: String },
    branchId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Branch' },
    source: {
        type: String,
        enum: ['WEBSITE_CONTACT', 'HERO_CALLBACK', 'FOOTER_NEWSLETTER', 'WHATSAPP'],
        default: 'WEBSITE_CONTACT',
    },
    status: {
        type: String,
        enum: ['NEW', 'CONTACTED', 'SCHEDULED', 'CLOSED'],
        default: 'NEW',
    },
    notes: { type: String },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.Lead = (0, mongoose_1.model)('Lead', LeadSchema);
