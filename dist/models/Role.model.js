"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const mongoose_1 = require("mongoose");
const RoleSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, uppercase: true, trim: true },
    displayName: { type: String, required: true },
    description: { type: String },
    permissions: [{ type: String, required: true }],
    isSystem: { type: Boolean, default: false },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
}, { timestamps: true });
exports.Role = (0, mongoose_1.model)('Role', RoleSchema);
