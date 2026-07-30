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

    if (settingsMap['GENERAL_SETTINGS'] && !settingsMap['GENERAL']) {
      settingsMap['GENERAL'] = {
        brandTitle: settingsMap['GENERAL_SETTINGS'].hospitalName || 'SUSRUTHA Ayurvedhik Hospital',
        hospitalName: settingsMap['GENERAL_SETTINGS'].hospitalName || 'SUSRUTHA Ayurvedhik Hospital',
        tagline: settingsMap['GENERAL_SETTINGS'].tagline || 'Research-backed 40-bed authentic Kerala Ayurveda hospital campus',
        phone: settingsMap['GENERAL_SETTINGS'].emergencyHotline || '+91 96566 56736',
        emergencyHotline: settingsMap['GENERAL_SETTINGS'].emergencyHotline || '+91 96566 56736',
        email: settingsMap['GENERAL_SETTINGS'].mainEmail || 'info@susruthaayurveda.com',
        mainEmail: settingsMap['GENERAL_SETTINGS'].mainEmail || 'info@susruthaayurveda.com',
        whatsappNumber: settingsMap['GENERAL_SETTINGS'].whatsappNumber || '+91 96566 56736',
        foundedYear: settingsMap['GENERAL_SETTINGS'].foundedYear || 1986,
        lineageYear: settingsMap['GENERAL_SETTINGS'].lineageYear || 1970,
      };
    }

    if (settingsMap['ANNOUNCEMENT_BAR'] && !settingsMap['ANNOUNCEMENT']) {
      settingsMap['ANNOUNCEMENT'] = {
        text: settingsMap['ANNOUNCEMENT_BAR'].text || '',
        link: settingsMap['ANNOUNCEMENT_BAR'].link || '',
        isEnabled: settingsMap['ANNOUNCEMENT_BAR'].isEnabled ?? true,
      };
    }

    return res.status(200).json(ApiResponse.success(settingsMap, 'Settings fetched successfully'));
  }

  static async updateSetting(req: Request, res: Response) {
    const keyParam = req.params.key;
    if (keyParam) {
      const uppercaseKey = keyParam.toUpperCase();
      const value = req.body.value !== undefined ? req.body.value : req.body;
      const setting = await Setting.findOneAndUpdate(
        { key: uppercaseKey },
        { value },
        { new: true, upsert: true }
      );
      return res.status(200).json(ApiResponse.success(setting, 'Setting updated successfully'));
    }

    // Support single item in body: { key: 'HERO', value: {...} }
    if (req.body.key && req.body.value !== undefined) {
      const key = req.body.key.toUpperCase();
      const setting = await Setting.findOneAndUpdate({ key }, { value: req.body.value }, { new: true, upsert: true });
      return res.status(200).json(ApiResponse.success(setting, 'Setting updated successfully'));
    }

    // Bulk update object keys: { HERO: {...}, GENERAL: {...} }
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

    if (settingsMap['GENERAL_SETTINGS'] && !settingsMap['GENERAL']) {
      settingsMap['GENERAL'] = settingsMap['GENERAL_SETTINGS'];
    }
    if (settingsMap['ANNOUNCEMENT_BAR'] && !settingsMap['ANNOUNCEMENT']) {
      settingsMap['ANNOUNCEMENT'] = settingsMap['ANNOUNCEMENT_BAR'];
    }

    return res.status(200).json(ApiResponse.success(settingsMap, 'Settings updated successfully'));
  }
}
