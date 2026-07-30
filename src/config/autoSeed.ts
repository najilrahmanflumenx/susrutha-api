import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import { Role } from '../models/Role.model';
import { Setting } from '../models/Setting.model';
import { logger } from '../utils/logger';

export async function autoSeedSystemData(): Promise<void> {
  try {
    // 1. Ensure Super Admin Role exists
    let superAdminRole = await Role.findOne({ name: 'SUPER_ADMIN' });
    if (!superAdminRole) {
      superAdminRole = await Role.create({
        name: 'SUPER_ADMIN',
        displayName: 'Super Administrator',
        description: 'Unrestricted full access across all hospital branches, CMS content, and system settings.',
        permissions: ['*'],
        isSystem: true,
        status: 'ACTIVE',
      });
      logger.info('Created default SUPER_ADMIN system role.');
    }

    // 2. Ensure Super Admin User exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@susruthaayurveda.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'SusruthaAdmin2026!';
    let adminUser = await User.findOne({ email: adminEmail, isDeleted: false });

    if (!adminUser) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: 'Susrutha Super Admin',
        email: adminEmail,
        phone: '+91 96566 56736',
        passwordHash,
        roleId: superAdminRole._id,
        assignedBranchIds: [],
        status: 'ACTIVE',
      });
      logger.info(`Seeded Super Admin User (${adminEmail}) successfully.`);
    }

    // 3. Ensure Global Site Settings exist
    const generalSetting = await Setting.findOne({ key: 'GENERAL_SETTINGS' });
    if (!generalSetting) {
      await Setting.create({
        key: 'GENERAL_SETTINGS',
        value: {
          hospitalName: 'SUSRUTHA Ayurvedhik Hospital',
          tagline: 'Research-backed authentic Kerala Ayurveda hospital campus',
          foundedYear: 1986,
          lineageYear: 1970,
          emergencyHotline: '+91 96566 56736',
          whatsappNumber: '+91 96566 56736',
          mainEmail: 'info@susruthaayurveda.com',
        },
        description: 'Hospital name, tagline, hotline, and contact info',
        isSystem: true,
      });
    }

    const announcementSetting = await Setting.findOne({ key: 'ANNOUNCEMENT_BAR' });
    if (!announcementSetting) {
      await Setting.create({
        key: 'ANNOUNCEMENT_BAR',
        value: {
          text: 'Authentic Kerala Panchakarma Admissions Open',
          link: '/packages',
          isEnabled: true,
        },
        description: 'Top header announcement banner text and link',
        isSystem: true,
      });
    }

    logger.info('Auto-seed super admin check completed successfully.');
  } catch (error: any) {
    logger.error(`Auto-seed system data error: ${error.message}`);
  }
}
