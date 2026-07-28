"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = require("../models/User.model");
const ApiError_1 = require("../utils/ApiError");
const JWT_SECRET = process.env.JWT_SECRET || 'susrutha_secret_key_2026';
// 1. Verify JWT Authentication Middleware
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(ApiError_1.ApiError.unauthorized('Access denied. Authentication token required.'));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_model_1.User.findById(decoded.userId).populate('roleId');
        if (!user || user.status !== 'ACTIVE') {
            return next(ApiError_1.ApiError.unauthorized('User account is inactive or no longer exists.'));
        }
        req.user = user;
        next();
    }
    catch (err) {
        return next(ApiError_1.ApiError.unauthorized('Invalid or expired authentication token. Please log in again.'));
    }
};
exports.authenticateJWT = authenticateJWT;
// 2. Granular RBAC Permission Check Middleware
const requirePermission = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(ApiError_1.ApiError.unauthorized('User authentication required.'));
        }
        const userPermissions = req.user.roleId?.permissions || [];
        // Super Admin wildcard check or explicit permission check
        const hasPermission = userPermissions.includes('*') ||
            userPermissions.includes('ALL_PERMISSIONS') ||
            userPermissions.includes(requiredPermission);
        if (!hasPermission) {
            return next(ApiError_1.ApiError.forbidden(`Permission denied. Required privilege: '${requiredPermission}'`));
        }
        next();
    };
};
exports.requirePermission = requirePermission;
