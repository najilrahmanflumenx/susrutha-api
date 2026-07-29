"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingController = void 0;
const Setting_model_1 = require("../models/Setting.model");
const ApiResponse_1 = require("../utils/ApiResponse");
class SettingController {
    static async getAllSettings(req, res) {
        const settings = await Setting_model_1.Setting.find({});
        const settingsMap = {};
        settings.forEach((s) => {
            settingsMap[s.key] = s.value;
        });
        return res.status(200).json(ApiResponse_1.ApiResponse.success(settingsMap, 'Settings fetched successfully'));
    }
    static async updateSetting(req, res) {
        // Support bulk payload: { HERO: {...}, ABOUT: {...} } or single: { key: 'HERO', value: {...} }
        if (req.body.key && req.body.value) {
            const key = req.body.key.toUpperCase();
            const setting = await Setting_model_1.Setting.findOneAndUpdate({ key }, { value: req.body.value }, { new: true, upsert: true });
            return res.status(200).json(ApiResponse_1.ApiResponse.success(setting, 'Setting updated successfully'));
        }
        // Bulk update object keys
        const updates = [];
        for (const [key, value] of Object.entries(req.body)) {
            if (typeof value === 'object' && value !== null) {
                const uppercaseKey = key.toUpperCase();
                updates.push(Setting_model_1.Setting.findOneAndUpdate({ key: uppercaseKey }, { value }, { new: true, upsert: true }));
            }
        }
        await Promise.all(updates);
        const allSettings = await Setting_model_1.Setting.find({});
        const settingsMap = {};
        allSettings.forEach((s) => {
            settingsMap[s.key] = s.value;
        });
        return res.status(200).json(ApiResponse_1.ApiResponse.success(settingsMap, 'Settings updated successfully'));
    }
}
exports.SettingController = SettingController;
