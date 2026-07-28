"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setting = void 0;
const mongoose_1 = require("mongoose");
const SettingSchema = new mongoose_1.Schema({
    key: { type: String, required: true, unique: true, uppercase: true, trim: true },
    value: { type: mongoose_1.Schema.Types.Mixed, required: true },
    description: { type: String },
    isSystem: { type: Boolean, default: false },
}, { timestamps: true });
exports.Setting = (0, mongoose_1.model)('Setting', SettingSchema);
