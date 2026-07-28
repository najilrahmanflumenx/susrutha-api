"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingController = void 0;
const Setting_model_1 = require("../models/Setting.model");
const ApiResponse_1 = require("../utils/ApiResponse");
class SettingController {
    static async getAllSettings(req, res) {
        const settings = await Setting_model_1.Setting.find({});
        return res.status(200).json(ApiResponse_1.ApiResponse.success(settings, 'Settings fetched successfully'));
    }
    static async updateSetting(req, res) {
        const { key, value } = req.body;
        const setting = await Setting_model_1.Setting.findOneAndUpdate({ key }, { value }, { new: true, upsert: true });
        return res.status(200).json(ApiResponse_1.ApiResponse.success(setting, 'Setting updated successfully'));
    }
}
exports.SettingController = SettingController;
