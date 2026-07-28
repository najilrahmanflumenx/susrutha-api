"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = require("../models/User.model");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const JWT_SECRET = process.env.JWT_SECRET || 'susrutha_secret_key_2026';
class AuthController {
    // POST /api/v1/admin/auth/login
    static async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            throw ApiError_1.ApiError.badRequest('Email and password are required');
        }
        const user = await User_model_1.User.findOne({ email: email.toLowerCase(), status: 'ACTIVE' }).populate('roleId');
        if (!user) {
            throw ApiError_1.ApiError.unauthorized('Invalid email or password');
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            throw ApiError_1.ApiError.unauthorized('Invalid email or password');
        }
        // Generate JWT Token
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
            name: user.name,
            email: user.email,
            role: user.roleId,
        }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json(ApiResponse_1.ApiResponse.success({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.roleId,
            },
        }, 'Admin authentication successful'));
    }
    // GET /api/v1/admin/auth/me
    static async getProfile(req, res) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token)
            throw ApiError_1.ApiError.unauthorized('No auth token provided');
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const user = await User_model_1.User.findById(decoded.userId).populate('roleId').select('-passwordHash');
            if (!user)
                throw ApiError_1.ApiError.unauthorized('User not found');
            return res.status(200).json(ApiResponse_1.ApiResponse.success(user, 'User profile fetched'));
        }
        catch (err) {
            throw ApiError_1.ApiError.unauthorized('Invalid or expired auth token');
        }
    }
}
exports.AuthController = AuthController;
