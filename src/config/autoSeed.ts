import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import { Role } from '../models/Role.model';
import { Branch } from '../models/Branch.model';
import { Setting } from '../models/Setting.model';
import { logger } from '../utils/logger';

export async function autoSeedSystemData(): Promise<void> {
  try {
    // 1. Ensure Super Admin Role exists
    let superAdminRole = await Role.findOne({ name: 'SUPER_ADMIN', isDeleted: false });
    if (!superAdminRole) {
      superAdminRole = await Role.create({
        name: 'SUPER_ADMIN',
        displayName: 'Super Administrator',
        description: 'Unrestricted full access across all hospital branches, CMS content, and system settings.',
        permissions: ['*'],
        isSystem: true,
      });
      logger.info('Created default SUPER_ADMIN system role.');
    }

    // 2. Ensure Main Hospital Branches exist
    let kattakadaBranch = await Branch.findOne({ code: 'KTK', isDeleted: false });
    if (!kattakadaBranch) {
      kattakadaBranch = await Branch.create({
        name: 'Kattakada Inpatient Hospital & Research Center',
        code: 'KTK',
        type: 'INPATIENT_HOSPITAL',
        tagline: '40-Bed Inpatient Panchakarma Hospital Campus & Research Institute',
        address: {
          street: 'Kattakada-Killi Main Road',
          city: 'Thiruvananthapuram',
          state: 'Kerala',
          pincode: '695572',
          coordinates: { lat: 8.5085, lng: 77.0805 },
        },
        contact: {
          phone: ['+91 96566 56736', '+91 471 229 0256'],
          email: 'kattakada@susruthaayurveda.com',
          emergencyPhone: '+91 96566 56736',
        },
        opdTimings: '09:00 AM - 07:00 PM (Mon - Sun)',
        bedCapacity: 40,
        features: ['40 Inpatient Beds', 'Private Panchakarma Cottages', 'Herbal Species Botanical Garden', 'Organic Pure Vegetarian Kitchen'],
        isMainBranch: true,
        status: 'ACTIVE',
      });
      logger.info('Created default Kattakada hospital branch.');
    }

    let kowdiarBranch = await Branch.findOne({ code: 'KWR', isDeleted: false });
    if (!kowdiarBranch) {
      kowdiarBranch = await Branch.create({
        name: 'Kowdiar City Outpatient Clinic',
        code: 'KWR',
        type: 'CITY_CLINIC',
        tagline: 'Premium City Outpatient Consultation & Specialty Care Center',
        address: {
          street: 'Kowdiar Palace Road',
          city: 'Thiruvananthapuram',
          state: 'Kerala',
          pincode: '695003',
          coordinates: { lat: 8.5241, lng: 76.9637 },
        },
        contact: {
          phone: ['+91 96566 56736'],
          email: 'kowdiar@susruthaayurveda.com',
          emergencyPhone: '+91 96566 56736',
        },
        opdTimings: '09:00 AM - 07:00 PM (Mon - Sat)',
        bedCapacity: 0,
        features: ['Executive OPD Consultation', 'Daycare Panchakarma & Kizhi Therapy', 'In-house GMP Medicine Pharmacy'],
        isMainBranch: false,
        status: 'ACTIVE',
      });
      logger.info('Created default Kowdiar city clinic branch.');
    }

    // 3. Ensure Super Admin User exists
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
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        status: 'ACTIVE',
      });
      logger.info(`Seeded Super Admin User (${adminEmail}) successfully.`);
    }

    // 4. Ensure Essential Global Site Settings exist
    const generalSetting = await Setting.findOne({ key: 'GENERAL_SETTINGS' });
    if (!generalSetting) {
      await Setting.create({
        key: 'GENERAL_SETTINGS',
        value: {
          hospitalName: 'SUSRUTHA Ayurvedhik Hospital',
          tagline: 'Research-backed 40-bed authentic Kerala Ayurveda hospital campus',
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
          text: 'Authentic Kerala Panchakarma Admissions Open — 40-Bed Hospital Campus at Kattakada',
          link: '/packages',
          isEnabled: true,
        },
        description: 'Top header announcement banner text and link',
        isSystem: true,
      });
    }

    const socialSetting = await Setting.findOne({ key: 'SOCIAL_LINKS' });
    if (!socialSetting) {
      await Setting.create({
        key: 'SOCIAL_LINKS',
        value: {
          facebook: 'https://facebook.com/susruthaayurveda',
          instagram: 'https://instagram.com/susruthaayurveda',
          youtube: 'https://youtube.com/@susruthaayurveda',
          whatsapp: 'https://wa.me/919656656736',
        },
        description: 'Official social media links',
        isSystem: true,
      });
    }
  } catch (error: any) {
    logger.error(`Auto-seed system data error: ${error.message}`);
  }
}
