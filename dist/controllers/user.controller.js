"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_model_1 = require("../models/User.model");
const ApiResponse_1 = require("../utils/ApiResponse");
class UserController {
    static async getAllUsers(req, res) {
        const users = await User_model_1.User.find({ isDeleted: false }).populate('roleId', 'name displayName').select('-passwordHash');
        return res.status(200).json(ApiResponse_1.ApiResponse.success(users, 'Users fetched successfully'));
    }
    static async createUser(req, res) {
        const user = await User_model_1.User.create(req.body);
        return res.status(201).json(ApiResponse_1.ApiResponse.success(user, 'User created successfully'));
    }
}
exports.UserController = UserController;
