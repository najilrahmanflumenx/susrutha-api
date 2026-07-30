import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import { Role } from '../models/Role.model';
import { Setting } from '../models/Setting.model';
import { logger } from '../utils/logger';

import AuditLog from '../models/AuditLog.model';

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
        isDeleted: false,
        status: 'ACTIVE',
      });
      logger.info('Created default SUPER_ADMIN system role.');
    }

    // 2. Ensure Super Admin User exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@susruthaayurveda.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'SusruthaAdmin2026!';
    let adminUser = await User.findOne({ email: adminEmail, isDeleted: { $ne: true } });

    if (!adminUser) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      adminUser = await User.create({
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
    const heroSetting = await Setting.findOne({ key: 'HERO' });
    if (!heroSetting) {
      await Setting.create({
        key: 'HERO',
        value: {
          badgeText: 'AUTHENTIC KERALA AYURVEDA HOSPITAL & SANCTUARY',
          headline: 'Centuries of Classical Healing, Mastered for Modern Wellness',
          highlightTitle: 'Susrutha Ayurvedhik',
          subtitle: 'Experience research-backed 40-bed inpatient Panchakarma retreats and specialized clinical care at our serene hospital campus in Kattakada.',
          bgImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80',
          ctaText: 'BOOK CONSULTATION',
          ctaLink: '/booking',
          secondaryCtaText: 'EXPLORE SANCTUARY',
          secondaryCtaLink: '/locations',
        },
        description: 'Homepage Hero section content and banner settings',
        isSystem: true,
      });
    }

    const generalSetting = await Setting.findOne({ key: 'GENERAL' });
    if (!generalSetting) {
      await Setting.create({
        key: 'GENERAL',
        value: {
          brandTitle: 'SUSRUTHA Ayurvedhik Hospital',
          hospitalName: 'SUSRUTHA Ayurvedhik Hospital',
          tagline: 'Research-backed 40-bed authentic Kerala Ayurveda hospital campus',
          phone: '+91 96566 56736',
          emergencyHotline: '+91 96566 56736',
          email: 'info@susruthaayurveda.com',
          mainEmail: 'info@susruthaayurveda.com',
          whatsappNumber: '+91 96566 56736',
          foundedYear: 1986,
          lineageYear: 1970,
        },
        description: 'Hospital name, tagline, hotline, and contact info',
        isSystem: true,
      });
    }

    const announcementSetting = await Setting.findOne({ key: 'ANNOUNCEMENT' });
    if (!announcementSetting) {
      await Setting.create({
        key: 'ANNOUNCEMENT',
        value: {
          text: 'Authentic Kerala Panchakarma Admissions Open — 40-Bed Campus at Kattakada',
          link: '/packages',
          isEnabled: true,
        },
        description: 'Top header announcement banner text and link',
        isSystem: true,
      });
    }

    const socialSetting = await Setting.findOne({ key: 'SOCIAL' });
    if (!socialSetting) {
      await Setting.create({
        key: 'SOCIAL',
        value: {
          facebook: 'https://facebook.com/susruthaayurveda',
          instagram: 'https://instagram.com/susruthaayurveda',
          youtube: 'https://youtube.com/@susruthaayurveda',
          twitter: 'https://twitter.com/susruthaayurveda',
          linkedin: 'https://linkedin.com/company/susruthaayurveda',
        },
        description: 'Official social media handles and channel URLs',
        isSystem: true,
      });
    }

    const seoSetting = await Setting.findOne({ key: 'SEO' });
    if (!seoSetting) {
      await Setting.create({
        key: 'SEO',
        value: {
          metaTitle: 'Susrutha Ayurveda — Authentic Kerala Ayurveda Hospital & Panchakarma Centre',
          metaDescription: 'Research-backed 40-bed inpatient Ayurveda hospital at Kattakada with city OP at Kowdiar. Classical healing treatments & expert doctors.',
          metaKeywords: 'Ayurveda hospital, Panchakarma Kerala, Susrutha Ayurveda, Kerala wellness retreat, Ayurvedic clinical treatments',
        },
        description: 'Default search engine optimization meta tags',
        isSystem: true,
      });
    }

    // 4. Seed initial audit log entries if empty
    const auditCount = await AuditLog.countDocuments({});
    if (auditCount === 0) {
      await AuditLog.create([
        {
          user: adminUser._id,
          userName: adminUser.name || 'Susrutha Super Admin',
          userEmail: adminEmail,
          action: 'SYSTEM_BOOTSTRAP',
          module: 'SYSTEM',
          entityId: 'ROOT',
          ipAddress: '127.0.0.1',
          userAgent: 'Susrutha API Engine',
          details: { message: 'Database bootstrapped and immutable RBAC audit logging initialized.' },
          timestamp: new Date(),
        },
        {
          user: adminUser._id,
          userName: adminUser.name || 'Susrutha Super Admin',
          userEmail: adminEmail,
          action: 'ROLE_CONFIGURED',
          module: 'RBAC',
          entityId: superAdminRole._id.toString(),
          ipAddress: '127.0.0.1',
          userAgent: 'Susrutha API Engine',
          details: { roleName: 'SUPER_ADMIN', permissions: ['*'] },
          timestamp: new Date(Date.now() - 3600000),
        },
      ]);
      logger.info('Seeded initial audit activity log entries successfully.');
    }

    logger.info('Auto-seed super admin check completed successfully.');
  } catch (error: any) {
    logger.error(`Auto-seed system data error: ${error.message}`);
  }
}
