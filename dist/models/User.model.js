"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, trim: true },
    roleId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Role', required: true },
    assignedBranchIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Branch' }],
    avatar: { type: String },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
    lastLoginAt: { type: Date },
    refreshToken: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
}, { timestamps: true });
UserSchema.index({ email: 1, isDeleted: 1 });
exports.User = (0, mongoose_1.model)('User', UserSchema);
