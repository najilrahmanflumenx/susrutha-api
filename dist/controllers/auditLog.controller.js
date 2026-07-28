"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = void 0;
const AuditLog_model_1 = __importDefault(require("../models/AuditLog.model"));
const getAuditLogs = async (req, res) => {
    try {
        const { module, action, page = 1, limit = 50 } = req.query;
        const filter = {};
        if (module)
            filter.module = module;
        if (action)
            filter.action = action;
        const skip = (Number(page) - 1) * Number(limit);
        const [logs, total] = await Promise.all([
            AuditLog_model_1.default.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            AuditLog_model_1.default.countDocuments(filter),
        ]);
        res.status(200).json({
            success: true,
            data: logs,
            meta: { total, page: Number(page), limit: Number(limit) },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAuditLogs = getAuditLogs;
