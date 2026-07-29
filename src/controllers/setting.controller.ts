import { Request, Response } from 'express';
import { Setting } from '../models/Setting.model';
import { ApiResponse } from '../utils/ApiResponse';

export class SettingController {
  static async getAllSettings(req: Request, res: Response) {
    const settings = await Setting.find({});
    const settingsMap: Record<string, any> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    return res.status(200).json(ApiResponse.success(settingsMap, 'Settings fetched successfully'));
  }

  static async updateSetting(req: Request, res: Response) {
    // Support bulk payload: { HERO: {...}, ABOUT: {...} } or single: { key: 'HERO', value: {...} }
    if (req.body.key && req.body.value) {
      const key = req.body.key.toUpperCase();
      const setting = await Setting.findOneAndUpdate({ key }, { value: req.body.value }, { new: true, upsert: true });
      return res.status(200).json(ApiResponse.success(setting, 'Setting updated successfully'));
    }

    // Bulk update object keys
    const updates = [];
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'object' && value !== null) {
        const uppercaseKey = key.toUpperCase();
        updates.push(
          Setting.findOneAndUpdate(
            { key: uppercaseKey },
            { value },
            { new: true, upsert: true }
          )
        );
      }
    }
    await Promise.all(updates);

    const allSettings = await Setting.find({});
    const settingsMap: Record<string, any> = {};
    allSettings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    return res.status(200).json(ApiResponse.success(settingsMap, 'Settings updated successfully'));
  }
}

