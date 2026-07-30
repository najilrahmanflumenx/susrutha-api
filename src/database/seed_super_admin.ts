import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User.model';
import { Role } from '../models/Role.model';
import { Branch } from '../models/Branch.model';
import { Doctor } from '../models/Doctor.model';
import { Department } from '../models/Department.model';
import { Appointment } from '../models/Appointment.model';
import { CarePackage } from '../models/CarePackage.model';
import { Infrastructure } from '../models/Infrastructure.model';
import { Blog } from '../models/Blog.model';
import { Lead } from '../models/Lead.model';
import { Setting } from '../models/Setting.model';
import Condition from '../models/Condition.model';
import Treatment from '../models/Treatment.model';
import Ecosystem from '../models/Ecosystem.model';
import NewsEvent from '../models/NewsEvent.model';
import Video from '../models/Video.model';
import GalleryAlbum from '../models/GalleryAlbum.model';
import Affiliation from '../models/Affiliation.model';
import MediaFile from '../models/MediaFile.model';
import AuditLog from '../models/AuditLog.model';
import { FAQ } from '../models/FAQ.model';
import { Testimonial } from '../models/Testimonial.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/susrutha_db';

async function seedSuperAdminOnly() {
  try {
    console.log('Connecting to MongoDB database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    console.log('Purging all existing collections in database...');
    await User.deleteMany({});
    await Role.deleteMany({});
    await Branch.deleteMany({});
    await Doctor.deleteMany({});
    await Department.deleteMany({});
    await Appointment.deleteMany({});
    await CarePackage.deleteMany({});
    await Infrastructure.deleteMany({});
    await Blog.deleteMany({});
    await Lead.deleteMany({});
    await Setting.deleteMany({});
    await Condition.deleteMany({});
    await Treatment.deleteMany({});
    await Ecosystem.deleteMany({});
    await NewsEvent.deleteMany({});
    await Video.deleteMany({});
    await GalleryAlbum.deleteMany({});
    await Affiliation.deleteMany({});
    await MediaFile.deleteMany({});
    await AuditLog.deleteMany({});
    await FAQ.deleteMany({});
    await Testimonial.deleteMany({});

    console.log('Seeding Super Admin Role...');
    const superAdminRole = await Role.create({
      name: 'SUPER_ADMIN',
      displayName: 'Super Administrator',
      description: 'Unrestricted full access across all hospital branches, CMS content, and system settings.',
      permissions: ['*'],
      isSystem: true,
      status: 'ACTIVE',
    });

    console.log('Seeding Super Admin User...');
    const passwordHash = await bcrypt.hash('SusruthaAdmin2026!', 10);
    await User.create({
      name: 'Susrutha Super Admin',
      email: 'admin@susruthaayurveda.com',
      phone: '+91 96566 56736',
      passwordHash,
      roleId: superAdminRole._id,
      branchScope: 'GLOBAL',
      assignedBranchIds: [],
      status: 'ACTIVE',
    });

    console.log('Seeding Default Global Settings...');
    await Setting.create([
      {
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
      },
      {
        key: 'ANNOUNCEMENT_BAR',
        value: {
          text: 'Authentic Kerala Panchakarma Admissions Open',
          link: '/packages',
          isEnabled: true,
        },
        description: 'Top header announcement banner text and link',
        isSystem: true,
      },
    ]);

    console.log('=====================================================');
    console.log('DATABASE WIPED AND ONLY SUPER ADMIN DATA SEEDED!');
    console.log('Super Admin Email: admin@susruthaayurveda.com');
    console.log('Super Admin Password: SusruthaAdmin2026!');
    console.log('=====================================================');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding super admin database:', error);
    process.exit(1);
  }
}

seedSuperAdminOnly();
