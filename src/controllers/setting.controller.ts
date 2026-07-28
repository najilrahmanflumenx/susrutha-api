import { Request, Response } from 'express';
import { Setting } from '../models/Setting.model';
import { ApiResponse } from '../utils/ApiResponse';

export class SettingController {
  static async getAllSettings(req: Request, res: Response) {
    const settings = await Setting.find({});
    return res.status(200).json(ApiResponse.success(settings, 'Settings fetched successfully'));
  }

  static async updateSetting(req: Request, res: Response) {
    const { key, value } = req.body;
    const setting = await Setting.findOneAndUpdate({ key }, { value }, { new: true, upsert: true });
    return res.status(200).json(ApiResponse.success(setting, 'Setting updated successfully'));
  }
}
