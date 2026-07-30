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

// Vast collections of distinct high-resolution Unsplash URLs for visual diversity
const IMAGES = {
  doctors: [
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1594824813570-78a295000527?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548142813-c348350df52b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534751516642-a171e261f52c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
  ],
  hospital: [
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519494080410-f9ab7d1970b2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
  ],
  therapy: [
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512290900673-70024fe74923?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591343393582-fc4407675147?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop&q=80',
  ],
  nature: [
    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
  ],
  videos: [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
    'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
  ]
};

const getImg = (arr: string[], index: number) => arr[index % arr.length];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB database for High-Capacity Load Seed...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    console.log('Purging all existing collections for clean state...');
    await Promise.all([
      User.deleteMany({}),
      Role.deleteMany({}),
      Branch.deleteMany({}),
      Doctor.deleteMany({}),
      Department.deleteMany({}),
      Appointment.deleteMany({}),
      CarePackage.deleteMany({}),
      Infrastructure.deleteMany({}),
      Blog.deleteMany({}),
      Lead.deleteMany({}),
      Setting.deleteMany({}),
      Condition.deleteMany({}),
      Treatment.deleteMany({}),
      Ecosystem.deleteMany({}),
      NewsEvent.deleteMany({}),
      Video.deleteMany({}),
      GalleryAlbum.deleteMany({}),
      Affiliation.deleteMany({}),
      MediaFile.deleteMany({}),
      AuditLog.deleteMany({}),
      FAQ.deleteMany({}),
      Testimonial.deleteMany({}),
    ]);

    // ==========================================
    // 1. ROLES & USERS
    // ==========================================
    console.log('1. Seeding System Roles & Users...');
    const superAdminRole = await Role.create({
      name: 'SUPER_ADMIN',
      displayName: 'Super Administrator',
      description: 'Unrestricted full access across all hospital branches, CMS content, and system settings.',
      permissions: ['*'],
      isSystem: true,
      status: 'ACTIVE',
    });

    const branchAdminRole = await Role.create({
      name: 'BRANCH_ADMIN',
      displayName: 'Branch Manager',
      description: 'Full administrative access restricted to assigned hospital branches.',
      permissions: ['branch:read', 'branch:write', 'doctor:read', 'appointment:manage'],
      isSystem: true,
      status: 'ACTIVE',
    });

    const doctorRole = await Role.create({
      name: 'DOCTOR',
      displayName: 'Consultant Physician',
      description: 'Access to OPD schedules, patient appointments, and medical notes.',
      permissions: ['appointment:read', 'appointment:update', 'blog:create'],
      isSystem: true,
      status: 'ACTIVE',
    });

    const contentManagerRole = await Role.create({
      name: 'CONTENT_MANAGER',
      displayName: 'CMS Content Editor',
      description: 'Manage website blogs, press releases, gallery, and care packages.',
      permissions: ['blog:manage', 'media:manage', 'gallery:manage'],
      isSystem: true,
      status: 'ACTIVE',
    });

    const passwordHash = await bcrypt.hash('SusruthaAdmin2026!', 10);
    const adminUser = await User.create({
      name: 'Susrutha Super Admin',
      email: 'admin@susruthaayurveda.com',
      phone: '+91 96566 56736',
      passwordHash,
      roleId: superAdminRole._id,
      assignedBranchIds: [],
      status: 'ACTIVE',
    });

    // Create batch staff users
    const seedUsersData = [];
    for (let i = 1; i <= 20; i++) {
      seedUsersData.push({
        name: `Staff Member ${i}`,
        email: `staff${i}@susruthaayurveda.com`,
        phone: `+91 98470 ${10000 + i * 111}`,
        passwordHash,
        roleId: i % 3 === 0 ? branchAdminRole._id : i % 2 === 0 ? doctorRole._id : contentManagerRole._id,
        status: 'ACTIVE',
      });
    }
    await User.insertMany(seedUsersData);

    // ==========================================
    // 2. BRANCHES (50 Branches across South India)
    // ==========================================
    console.log('2. Seeding 50 Hospital Branches & Specialty Clinics...');
    const cities = [
      'Thiruvananthapuram', 'Kattakada', 'Kowdiar', 'Kollam', 'Alappuzha',
      'Kottayam', 'Kochi', 'Thrissur', 'Palakkad', 'Kozhikode',
      'Wayanad', 'Kannur', 'Kasarkod', 'Pathanamthitta', 'Idukki',
      'Varkala', 'Neyyattinkara', 'Kazhakkoottam', 'Attingal', 'Nedumangad',
      'Changanassery', 'Muvattupuzha', 'Perumbavoor', 'Angamaly', 'Guruvayur',
      'Tirur', 'Manjeri', 'Thalassery', 'Vadakara', 'Kanhangad', 'Punalur', 'Cherthala',
      'Bengaluru Indiranagar', 'Bengaluru Koramangala', 'Chennai Adyar', 'Chennai T-Nagar',
      'Coimbatore', 'Madurai', 'Mysuru', 'Mangaluru', 'Hyderabad Jubilee Hills',
      'Pondicherry', 'Salem', 'Tiruchirappalli', 'Kumbakonam', 'Kanyakumari',
      'Nagercoil', 'Vellore', 'Erode', 'Tiruppur'
    ];

    const branchSeedDocs = [];
    for (let i = 0; i < 50; i++) {
      const city = cities[i];
      const code = (city.replace(/[^A-Z]/gi, '').substring(0, 3).toUpperCase()) + (i > 0 ? (i + 1) : '');
      const isInpatient = i % 3 === 0;

      branchSeedDocs.push({
        name: `Susrutha Ayurveda ${city} ${isInpatient ? 'Inpatient Hospital Campus' : 'Specialty Clinic'}`,
        code: i === 0 ? 'KTK' : i === 1 ? 'KWR' : code,
        type: isInpatient ? 'INPATIENT_HOSPITAL' : 'CITY_CLINIC',
        tagline: isInpatient ? `${30 + (i % 5) * 10}-Bed Inpatient Panchakarma Hospital Campus` : `Executive OPD & Daycare Panchakarma Specialty Center`,
        address: {
          street: `${city} Main Hospital Avenue, Sector ${i + 1}`,
          city: city,
          state: i < 32 ? 'Kerala' : i < 40 ? 'Karnataka' : 'Tamil Nadu',
          pincode: `${695000 + i * 17}`,
          coordinates: { lat: 8.5 + i * 0.05, lng: 76.9 + i * 0.05 },
        },
        contact: {
          phone: [`+91 96566 ${56736 + i}`, `+91 471 ${2290256 + i}`],
          email: `${city.toLowerCase().replace(/[^a-z0-9]/g, '')}@susruthaayurveda.com`,
          emergencyPhone: `+91 96566 ${56736 + i}`,
        },
        opdTimings: '08:00 AM - 08:00 PM (Mon - Sun)',
        bedCapacity: isInpatient ? 30 + (i % 5) * 10 : 0,
        features: [
          'Authentic Kerala Panchakarma Detox',
          'Vaidya Consultation & Nadi Pariksha',
          'GMP Certified In-House Pharmacy',
          '24x7 Resident Doctor & Nursing Care',
          'Private Organic Diet Catering'
        ],
        coverImage: getImg(IMAGES.hospital, i),
        isMainBranch: i === 0,
        status: 'ACTIVE',
      });
    }
    const createdBranches = await Branch.insertMany(branchSeedDocs);

    // ==========================================
    // 3. DEPARTMENTS (40 Clinical Specialty Departments)
    // ==========================================
    console.log('3. Seeding 40 Clinical Specialty Departments...');
    const deptTitles = [
      'Panchakarma & Bio-Purification', 'Kayachikitsa (Internal Medicine)', 'Neurological & Stroke Rehabilitation',
      'Spine & Musculoskeletal Health', 'Prasuti Tantra (Gynaecology & Infertility)', 'Shalya Tantra (Kshara Sutra)',
      'Shalakya Tantra (ENT & Vision)', 'Twak Roga (Dermatology & Psoriasis)', 'Kaumarabhritya (Pediatrics)',
      'Rasayana & Anti-Aging', 'Vajikarana & Reproductive Health', 'Swasthavritta & Preventive Health',
      'Agada Tantra (Toxicology & Detox)', 'Marma Chikitsa (Vulnerology)', 'Manovaha (Ayurvedic Psychiatry)',
      'Cardio-Metabolic Care', 'Gastrointestinal & Liver Care', 'Renal & Urological Health',
      'Respiratory & Allergy Care', 'Onco-Supportive Ayurveda Care', 'Geriatric & Elderly Care',
      'Sports Injury & Joint Rehab', 'Immune Boosting & Post-Viral Care', 'Postnatal & Mother Care',
      'Hair Care & Alopecia Therapy', 'Dietetics & Pathya Ahara', 'Diabetic Foot & Vascular Care',
      'Weight Management & Sthoulya', 'Thyroid & Endocrine Care', 'Rheumatology & Autoimmune',
      'Sleep Medicine & Insomnia Care', 'Ayurvedic Botanical Science', 'Kshara Sutra Proctology Unit',
      'Ayurvedic Ophthalmology Care', 'Vaidya Diagnostic & Nadi Pariksha', 'Ayurvedic Dental & Mukha Roga',
      'Post-Surgical Ayurvedic Recovery', 'Stress Management & Soundarya', 'Pediatric Neuro-Developmental Care',
      'Ayurvedic Genomic & Epigenetic Health'
    ];

    const deptSeedDocs = [];
    for (let i = 0; i < 40; i++) {
      const title = deptTitles[i];
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const code = `D${i + 101}`;

      deptSeedDocs.push({
        title,
        slug,
        code,
        tagline: `Specialized Research-Backed Ayurvedic Care for ${title}`,
        overview: `Comprehensive Kerala Ayurvedic protocols, classical formulations, and purification therapies for ${title} supervised by expert senior Vaidyas.`,
        image: getImg(IMAGES.nature, i),
        status: 'ACTIVE',
      });
    }
    const createdDepts = await Department.insertMany(deptSeedDocs);

    // ==========================================
    // 4. DOCTORS (100 Expert Physicians)
    // ==========================================
    console.log('4. Seeding 100 Expert Doctors with unique profiles & availability...');
    const firstNames = ['Krishnakumar', 'Sreeja', 'Anoop', 'Lakshmi', 'Ramesh', 'Divya', 'Hari', 'Gayathri', 'Madhavan', 'Preetha', 'Anand', 'Saritha', 'Vishnu', 'Revathy', 'Jayakrishnan', 'Anupama', 'Gopakumar', 'Deepa', 'Santhosh', 'Sunitha', 'Rajeev', 'Vineetha', 'Arjun', 'Ambili', 'Gokul', 'Reshma', 'Sidharth', 'Parvathy', 'Kiran', 'Aswathy', 'Unnikrishnan', 'Devika', 'Manikandan', 'Bhavana', 'Subhash', 'Gautam', 'Kavitha', 'Nikhil', 'Pooja', 'Siddharth', 'Meera', 'Rohan', 'Swati', 'Vikram', 'Ananya', 'Tarun', 'Nandini', 'Pranav', 'Shruti', 'Aditya'];
    const lastNames = ['K.', 'Krishna', 'Varma', 'Nair', 'Nambiar', 'Chandran', 'Pillai', 'Devi', 'Kutty', 'Suresh', 'Padmanabhan', 'Namboothiri', 'Mohan', 'Unnithan', 'Menon', 'Rajan', 'Kumar', 'Panicker', 'Das', 'Thampi', 'Menon', 'Babu', 'Gopal', 'Kartha', 'Shenoy', 'Bhat', 'Hegde', 'Rao', 'Reddy', 'Choudhury'];

    const doctorSeedDocs = [];
    for (let i = 0; i < 100; i++) {
      const fname = firstNames[i % firstNames.length];
      const lname = lastNames[i % lastNames.length];
      const name = `Dr. ${fname} ${lname} ${i > 50 ? 'Vaidya' : ''}`.trim();
      const slug = `dr-${fname.toLowerCase()}-${lname.toLowerCase().replace(/[^a-z0-9]/g, '')}-${i + 1}`;
      const dept = createdDepts[i % createdDepts.length];
      const assignedBranch1 = createdBranches[i % createdBranches.length]._id;
      const assignedBranch2 = createdBranches[(i + 1) % createdBranches.length]._id;

      doctorSeedDocs.push({
        name,
        slug,
        designation: i === 0 ? 'Chief Medical Officer & Founder' : i % 5 === 0 ? 'Chief Medical Officer' : i % 3 === 0 ? 'Senior Consultant Physician' : 'Consultant Ayurvedic Physician',
        qualifications: i % 2 === 0 ? 'BAMS, MD (Ayurveda)' : 'BAMS, MS (Ayurveda), Ph.D.',
        experienceYears: 5 + (i % 30),
        registrationNumber: `TCMC/AYU/${12000 + i * 137}`,
        departmentId: dept._id,
        assignedBranchIds: [assignedBranch1, assignedBranch2],
        bio: `${name} is an esteemed Vaidya with over ${5 + (i % 30)} years of clinical excellence specializing in ${dept.title}. Recognized for pioneering integration of traditional Kerala Panchakarma with modern evidence-based clinical diagnostics.`,
        consultationFee: 400 + (i % 8) * 100,
        specialties: [dept.title, 'Panchakarma Detox', 'Nadi Pariksha', 'Chronic Pain Care'],
        languagesSpoken: ['Malayalam', 'English', i % 2 === 0 ? 'Hindi' : 'Tamil', i % 4 === 0 ? 'Kannada' : 'Sanskrit'],
        photoUrl: getImg(IMAGES.doctors, i),
        photo: getImg(IMAGES.doctors, i),
        availability: [
          {
            branchId: assignedBranch1,
            days: ['Mon', 'Wed', 'Fri', 'Sat'],
            timeSlots: ['09:00 AM - 01:00 PM', '04:00 PM - 07:00 PM'],
          },
          {
            branchId: assignedBranch2,
            days: ['Tue', 'Thu'],
            timeSlots: ['10:00 AM - 02:00 PM'],
          }
        ],
        isDirector: i < 5,
        isFeatured: i < 20,
        sortOrder: i + 1,
        status: 'ACTIVE',
      });
    }
    const createdDoctors = await Doctor.insertMany(doctorSeedDocs);

    // ==========================================
    // 5. CONDITIONS (100 Health Conditions)
    // ==========================================
    console.log('5. Seeding 100 Health Conditions with detailed clinical protocols...');
    const condTitles = [
      'Rheumatoid & Osteoarthritis', 'Cervical & Lumbar Spondylosis', 'Stroke & Hemiplegia Rehabilitation',
      'Psoriasis & Chronic Eczema', 'PCOS & Hormonal Infertility', 'Anal Fistula & Hemorrhoids',
      'Parkinsonism & Movement Disorders', 'Fatty Liver & Digestive IBS', 'Chronic Sinusitis & Rhinitis',
      'Insomnia & Severe Anxiety', 'Type-2 Diabetes & Neuropathy', 'Hypertension & Vascular Care',
      'Sciatica & Nerve Compression', 'Gouty Arthritis & Uric Acid', 'Asthma & Chronic Bronchitis',
      'Alopecia & Severe Hair Fall', 'Post-COVID Fatigue & Weakness', 'Thyroid Dysfunction & Goitre',
      'Obesity & Metabolic Syndrome', 'Migraine & Vascular Headaches', 'Ulcerative Colitis & Gastritis',
      'Kidney Stones & Dysuria', 'Varicose Veins & Venous Ulcers', 'Bell Palsy & Facial Paralysis',
      'Fibromyalgia & Chronic Muscle Pain', 'Ankylosing Spondylitis', 'Uterine Fibroids & Menorrhagia',
      'Allergic Dermatitis & Hives', 'Calcaneal Spur & Heel Pain', 'Frozen Shoulder & Bursitis',
      'Vertigo & Meniere Disease', 'Kidney Failure (Early Stage Support)', 'Autoimmune Lupus Care',
      'Chronic Fatigue Syndrome', 'Erectile Dysfunction & Low Vitality', 'Degenerative Disc Disease',
      'Carpal Tunnel Syndrome', 'Trigeminal Neuralgia', 'Acid Peptic Disorder & GERD',
      'Psoriatic Arthritis', 'Scoliosis & Spinal Curvature', 'Multiple Sclerosis Support Care',
      'Chronic Prostatitis & BPH', 'Male Factor Infertility & Oligospermia', 'Endometriosis Pain Management',
      'Eczematous Dermatitis', 'Tinnitus & Hearing Decline', 'Post-Herpetic Neuralgia',
      'Peripheral Arterial Disease', 'Metabolic Non-Alcoholic Fatty Liver'
    ];

    const conditionSeedDocs = [];
    for (let i = 0; i < 100; i++) {
      const baseTitle = condTitles[i % condTitles.length];
      const title = i >= 50 ? `${baseTitle} (Advanced Protocol #${i - 49})` : baseTitle;
      const slug = `condition-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${i + 1}`;

      conditionSeedDocs.push({
        title,
        slug,
        category: i % 5 === 0 ? 'Spine & Joint' : i % 4 === 0 ? 'Neurological' : i % 3 === 0 ? 'Skin & Immunity' : 'Metabolic & Chronic',
        shortDescription: `Non-surgical Kerala Ayurvedic recovery protocol and herbal detox remedies for ${title}.`,
        fullDescription: `Comprehensive inpatient and outpatient Ayurvedic treatment strategy for ${title}. Integrates classical Panchakarma, custom Kashayams, lifestyle modifications, and Pathya Ahara dietary plans under senior doctor supervision.`,
        ayurvedicRootCause: `Agni Manya and aggravated Vata-Pitta-Kapha Doshas disturbing Dhatu Agni and causing Srotorodha (micro-channel blockages).`,
        symptoms: ['Localized & Generalized Pain', 'Stiffness & Reduced Mobility', 'Chronic Fatigue & Inflammation', 'Digestive Impairment'],
        coverImage: getImg(IMAGES.therapy, i),
        assignedBranchIds: [createdBranches[i % createdBranches.length]._id, createdBranches[(i + 1) % createdBranches.length]._id],
        faqs: [
          { question: `What is the expected treatment duration for ${title}?`, answer: `Standard inpatient Panchakarma programs range from 14 to 28 days depending on severity.` },
          { question: `Are medicines safe for long-term usage?`, answer: `All prescribed herbal Kashayams and Arishtams are 100% GMP certified and safe.` }
        ],
        isFeatured: i < 30,
        status: 'published',
      });
    }
    const createdConditions = await Condition.insertMany(conditionSeedDocs);

    // ==========================================
    // 6. TREATMENTS (100 Classical Treatments)
    // ==========================================
    console.log('6. Seeding 100 Classical & Specialty Panchakarma Treatments...');
    const treatNames = [
      'Abhyangam (Warm Oil Therapy)', 'Shirodhara (Oil Stream Therapy)', 'Elakizhi (Herbal Leaf Poultice)',
      'Kadi Vasthi (Lumbar Spine Pool)', 'Njavarakizhi (Rice Bolus Steam)', 'Pizhichil (Royal Medicated Oil Bath)',
      'Takradhara (Buttermilk Stream)', 'Nasyam (Therapeutic Nasal Drops)', 'Kshara Sutra Ligation',
      'Janu Vasthi (Knee Joint Pool)', 'Griva Vasthi (Neck Spine Pool)', 'Kashaya Vasthi (Herbal Enema)',
      'Sneha Vasthi (Oil Enema)', 'Vamana (Therapeutic Emesis)', 'Virechana (Therapeutic Purgation)',
      'Raktamokshana (Leech Therapy)', 'Udwarthanam (Dry Herbal Powder Scrub)', 'Ksheeradradhara (Medicated Milk Pour)',
      'Netra Tarpana (Eye Rejuvenation Bath)', 'Karnapoorana (Ear Oil Drip)', 'Sirovasthi (Cranial Oil Retention Pool)',
      'Podikizhi (Powder Bolus Fomentation)', 'Mutthakizhi (Egg Bolus Massage)', 'Dhanyamladhara (Warm Herbal Liquid Bath)',
      'Kizhi (Specialized Bolus Fomentation)', 'Thalam (Scalp Herbal Paste Coating)', 'Lepam (Herbal Medicinal Paste Application)',
      'Pichu (Oil Soaked Sponge Placement)', 'Avagaha Swedam (Medicated Tub Bath)', 'Ksheeradhoopam (Medicated Milk Steam)',
      'Yoni Prakshalanam (Douche Therapy)', 'Shiroabhyangam (Head Massage)', 'Padabhyangam (Foot Massage)',
      'Kaya Sekam (Full Body Pouring)', 'Tarpana (Tissue Nourishing Bath)'
    ];

    const treatmentSeedDocs = [];
    for (let i = 0; i < 100; i++) {
      const baseTitle = treatNames[i % treatNames.length];
      const title = i >= 35 ? `${baseTitle} — Specialty Variant #${i + 1}` : baseTitle;
      const slug = `treatment-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${i + 1}`;
      const doc1 = createdDoctors[i % createdDoctors.length]._id;
      const doc2 = createdDoctors[(i + 1) % createdDoctors.length]._id;

      treatmentSeedDocs.push({
        title,
        slug,
        category: i % 4 === 0 ? 'Panchakarma' : i % 3 === 0 ? 'Kizhi & Fomentation' : i % 2 === 0 ? 'Vasthi' : 'Dhara',
        malayalam: 'ആയൂർവേദ ചികിത്സാ രീതി',
        shortDescription: `Classical Kerala Ayurvedic ${title} therapy conducted by experienced male/female Panchakarma therapists.`,
        fullDescription: `Traditional ${title} utilizing authentic herbal oils formulated in-house. Helps restore Dosha equilibrium, eliminate metabolic toxins (Ama), and improve cellular immunity.`,
        coverImage: getImg(IMAGES.therapy, i),
        galleryImages: [getImg(IMAGES.therapy, i), getImg(IMAGES.hospital, i)],
        durationMinutes: 45 + (i % 4) * 15,
        recommendedDays: 7 + (i % 4) * 7,
        indications: ['Dosha Imbalance', 'Chronic Pain', 'Joint Stiffness', 'Stress & Burnout'],
        benefits: ['Eliminates toxins', 'Improves blood circulation', 'Deep tissue rejuvenation', 'Relieves nerve tension'],
        preparation: ['Light warm bath prior to session', 'Avoid heavy meals 2 hours prior'],
        aftercare: ['Sip warm herbal water', 'Avoid direct exposure to cold wind'],
        doctorIds: [doc1, doc2],
        assignedBranchIds: [createdBranches[i % createdBranches.length]._id],
        isFeatured: i < 30,
        status: 'published',
      });
    }
    const createdTreatments = await Treatment.insertMany(treatmentSeedDocs);

    // Link conditions with treatments
    console.log('Linking conditions to recommended treatments...');
    for (let i = 0; i < createdConditions.length; i++) {
      const t1 = createdTreatments[i % createdTreatments.length]._id;
      const t2 = createdTreatments[(i + 2) % createdTreatments.length]._id;
      const d1 = createdDoctors[i % createdDoctors.length]._id;
      await Condition.findByIdAndUpdate(createdConditions[i]._id, {
        recommendedTreatmentIds: [t1, t2],
        specialistDoctorIds: [d1],
      });
    }

    // ==========================================
    // 7. CARE PACKAGES (60 Care Packages)
    // ==========================================
    console.log('7. Seeding 60 Care Packages with pricing & inclusions...');
    const packageSeedDocs = [];
    for (let i = 0; i < 60; i++) {
      const title = `Ayurvedic Package #${i + 1}: ${deptTitles[i % deptTitles.length]} Inpatient Program`;
      const slug = `package-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${i + 1}`;
      const price = 25000 + i * 1200;

      packageSeedDocs.push({
        title,
        slug,
        subtitle: `${7 + (i % 3) * 7}-Day Complete Inpatient Recovery & Detox Suite`,
        durationDays: 7 + (i % 3) * 7,
        assignedBranchIds: [createdBranches[i % createdBranches.length]._id, createdBranches[(i + 1) % createdBranches.length]._id],
        overview: `All-inclusive ${7 + (i % 3) * 7}-day inpatient holistic treatment program covering daily Panchakarma therapies, doctor consultations, organic diet, room stay, and herbal medicines.`,
        inclusions: ['Daily Physician Consultations', '2x Daily Panchakarma Therapies', 'Custom Organic Pathya Diet', 'Accommodation & Room Stay', 'Internal Herbal Medicines'],
        exclusions: ['Diagnostic Scans & MRI', 'Personal Airport Transfers', 'Attendant Extra Meals'],
        targetAilments: ['Stress Relief', 'Full Body Detoxification', 'Spine & Joint Care', 'Weight Management'],
        image: getImg(IMAGES.hospital, i),
        galleryImages: [getImg(IMAGES.hospital, i), getImg(IMAGES.therapy, i)],
        price,
        isFeatured: i < 20,
        sortOrder: i + 1,
        status: 'ACTIVE',
      });
    }
    await CarePackage.insertMany(packageSeedDocs);

    // ==========================================
    // 8. INFRASTRUCTURE & FACILITIES (80 Wings)
    // ==========================================
    console.log('8. Seeding 80 Infrastructure Wings & Facility Rooms...');
    const facCats = ['ROOMS', 'PANCHAKARMA_SUITES', 'OPERATING_THEATRE', 'PHYSIOTHERAPY', 'YOGA_HALL', 'AYUR_VILLAGE', 'OTHER'];
    const infraSeedDocs = [];
    for (let i = 0; i < 80; i++) {
      const title = `Facility Wing #${i + 1} — ${facCats[i % facCats.length]} Block ${String.fromCharCode(65 + (i % 4))}`;
      infraSeedDocs.push({
        title,
        category: facCats[i % facCats.length] as any,
        branchId: createdBranches[i % createdBranches.length]._id,
        description: `Modern hospital wing equipped with traditional teak wood Droni therapy tables, AC suites, attached hygienic washrooms, and 24/7 nursing call buttons.`,
        capacity: 5 + i * 2,
        image: getImg(IMAGES.hospital, i),
        coverImage: getImg(IMAGES.hospital, i),
        galleryImages: [getImg(IMAGES.hospital, i), getImg(IMAGES.therapy, i)],
        status: 'ACTIVE',
      });
    }
    await Infrastructure.insertMany(infraSeedDocs);

    // ==========================================
    // 9. BLOGS & HEALTH ARTICLES (150 Articles)
    // ==========================================
    console.log('9. Seeding 150 Health Blogs & Medical Articles...');
    const blogSeedDocs = [];
    for (let i = 0; i < 150; i++) {
      const doc = createdDoctors[i % createdDoctors.length];
      const title = `Ayurvedic Health Guide #${i + 1}: ${condTitles[i % condTitles.length]} Management`;
      const slug = `blog-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${i + 1}`;

      blogSeedDocs.push({
        title,
        slug,
        category: deptTitles[i % deptTitles.length],
        tags: ['Ayurveda', 'Panchakarma', 'Kerala Medicine', 'Wellness'],
        authorName: doc.name,
        authorTitle: doc.designation,
        readTimeMinutes: 4 + (i % 6),
        excerpt: `Discover authentic Kerala Ayurvedic dietary guidelines, panchakarma treatments, and preventive lifestyle advice for ${condTitles[i % condTitles.length]}.`,
        content: `### Understanding ${condTitles[i % condTitles.length]} in Ayurveda\n\nAyurveda views body wellness through the harmony of the three Vata, Pitta, and Kapha doshas. When Agni (digestive fire) weakens, metabolic toxins termed Ama accumulate in tissue micro-channels (Srotas).\n\n#### Classical Remedies & Therapies\n1. **Panchakarma Bio-Purification**: Eliminates deep-seated toxins.\n2. **Herbal Formulations**: Kashayams and Arishtams prescribed by qualified Vaidyas.\n3. **Dietary Discipline (Pathya)**: Freshly prepared warm sattvic food.`,
        coverImage: getImg(IMAGES.nature, i),
        isFeatured: i < 25,
        status: 'PUBLISHED',
      });
    }
    await Blog.insertMany(blogSeedDocs);

    // ==========================================
    // 10. PATIENT TESTIMONIALS (120 Reviews)
    // ==========================================
    console.log('10. Seeding 120 Patient Reviews & Video Testimonials...');
    const patientLocations = ['Trivandrum', 'Kochi', 'Kozhikode', 'Dubai, UAE', 'London, UK', 'New York, USA', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Abu Dhabi', 'Singapore', 'Melbourne, Australia', 'Doha, Qatar'];
    const testimonialSeedDocs = [];
    for (let i = 0; i < 120; i++) {
      const doc = createdDoctors[i % createdDoctors.length];
      testimonialSeedDocs.push({
        patientName: `Patient ${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
        patientLocation: patientLocations[i % patientLocations.length],
        treatmentReceived: treatNames[i % treatNames.length],
        branchId: createdBranches[i % createdBranches.length]._id,
        rating: 5,
        reviewText: `I underwent 14 days of inpatient treatment under ${doc.name} at Susrutha Ayurvedhik Hospital. My chronic pain is completely cured, and overall energy is restored! Staff and doctors provided exceptional care.`,
        patientPhoto: getImg(IMAGES.doctors, i),
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        isFeatured: i < 35,
        status: 'ACTIVE',
      });
    }
    await Testimonial.insertMany(testimonialSeedDocs);

    // ==========================================
    // 11. ECOSYSTEM PILLARS (50 Pillars)
    // ==========================================
    console.log('11. Seeding 50 Ecosystem Pillars...');
    const pTypes = ['herbal_garden', 'pharmacy_unit', 'research_center', 'academy'];
    const ecosystemSeedDocs = [];
    for (let i = 0; i < 50; i++) {
      const title = `Ecosystem Division #${i + 1} — ${pTypes[i % pTypes.length].replace('_', ' ').toUpperCase()}`;
      const slug = `ecosystem-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${i + 1}`;
      ecosystemSeedDocs.push({
        title,
        slug,
        pillarType: pTypes[i % pTypes.length],
        tagline: `Pioneering Division for ${pTypes[i % pTypes.length].replace('_', ' ')} Excellence`,
        description: `Dedicated department focusing on clinical research, organic botanical cultivation, GMP medicine manufacturing, and Vaidya training.`,
        coverImage: getImg(IMAGES.nature, i),
        status: 'published',
      });
    }
    await Ecosystem.insertMany(ecosystemSeedDocs);

    // ==========================================
    // 12. VIDEOS & TOURS (100 Videos)
    // ==========================================
    console.log('12. Seeding 100 Video Features & Tours...');
    const vCats = ['patient_story', 'doctor_talk', 'facility_tour', 'treatment_demo'];
    const videoSeedDocs = [];
    for (let i = 0; i < 100; i++) {
      const title = `Video Feature #${i + 1}: ${vCats[i % vCats.length].replace('_', ' ').toUpperCase()} (${deptTitles[i % deptTitles.length]})`;
      const slug = `video-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${i + 1}`;
      videoSeedDocs.push({
        title,
        slug,
        category: vCats[i % vCats.length],
        youtubeUrl: IMAGES.videos[i % IMAGES.videos.length],
        videoHost: 'youtube',
        thumbnailUrl: getImg(IMAGES.hospital, i),
        duration: `${3 + (i % 8)}:${(10 + (i * 7) % 50).toString().padStart(2, '0')}`,
        description: `Watch this detailed video presentation introducing ${deptTitles[i % deptTitles.length]} protocols at Susrutha Hospital.`,
        doctorId: createdDoctors[i % createdDoctors.length]._id,
        treatmentId: createdTreatments[i % createdTreatments.length]._id,
        isFeatured: i < 25,
        sortOrder: i + 1,
        status: 'published',
      });
    }
    await Video.insertMany(videoSeedDocs);

    // ==========================================
    // 13. GALLERY ALBUMS (80 Albums)
    // ==========================================
    console.log('13. Seeding 80 Photo & Video Gallery Albums...');
    const gCats = ['infrastructure', 'ayur_village', 'kowdiar_op', 'herbal_garden', 'events', 'treatments'];
    const gallerySeedDocs = [];
    for (let i = 0; i < 80; i++) {
      const title = `Photo Album #${i + 1}: ${gCats[i % gCats.length].replace('_', ' ').toUpperCase()} Showcase`;
      const slug = `album-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${i + 1}`;
      gallerySeedDocs.push({
        title,
        slug,
        category: gCats[i % gCats.length] as any,
        coverImage: getImg(IMAGES.hospital, i),
        description: `High-resolution gallery depicting ${gCats[i % gCats.length]} facilities, therapy rooms, and herbal greenery.`,
        mediaItems: [
          { url: getImg(IMAGES.hospital, i), caption: 'Main Campus View', mediaType: 'image', sortOrder: 1 },
          { url: getImg(IMAGES.therapy, i), caption: 'Therapy Suite View', mediaType: 'image', sortOrder: 2 },
          { url: getImg(IMAGES.nature, i), caption: 'Herbal Garden View', mediaType: 'image', sortOrder: 3 },
        ],
        isFeatured: i < 25,
        status: 'published',
      });
    }
    await GalleryAlbum.insertMany(gallerySeedDocs);

    // ==========================================
    // 14. MEDIA FILES (150 Entries)
    // ==========================================
    console.log('14. Seeding 150 Media Library Files...');
    const mediaFileSeedDocs = [];
    for (let i = 0; i < 150; i++) {
      mediaFileSeedDocs.push({
        filename: `susrutha_asset_${i + 100}.jpg`,
        originalName: `hospital_photo_${i + 1}.jpg`,
        mimeType: 'image/jpeg',
        size: 150000 + i * 4500,
        url: getImg(IMAGES.hospital, i),
        publicId: `susrutha/uploads/asset_${i + 100}`,
        folder: i % 3 === 0 ? 'doctors' : i % 2 === 0 ? 'facilities' : 'treatments',
        altText: `Susrutha Ayurveda Hospital Asset ${i + 1}`,
        tags: ['hospital', 'ayurveda', 'kerala', 'panchakarma'],
        dimensions: { width: 1200, height: 800 },
        uploadedBy: adminUser._id,
      });
    }
    await MediaFile.insertMany(mediaFileSeedDocs);

    // ==========================================
    // 15. ACCREDITATIONS & AFFILIATIONS (50)
    // ==========================================
    console.log('15. Seeding 50 Official Accreditations & Certifications...');
    const aCats = ['accreditation', 'certification', 'research_partner', 'university'];
    const affiliationSeedDocs = [];
    for (let i = 0; i < 50; i++) {
      affiliationSeedDocs.push({
        title: `Official Accreditation #${i + 1}: NABH / AYUSH Standard`,
        category: aCats[i % aCats.length],
        type: 'Government Accreditation',
        logoUrl: getImg(IMAGES.nature, i),
        issuingBody: `Government AYUSH Accreditation Board #${i + 1}`,
        validityYear: '2026',
        description: `Official hospital accreditation certifying compliance with NABH Panchakarma hospital clinical safety standards.`,
        status: 'published',
      });
    }
    await Affiliation.insertMany(affiliationSeedDocs);

    // ==========================================
    // 16. PRESS RELEASES & NEWS (80 Events)
    // ==========================================
    console.log('16. Seeding 80 Press Releases & News Clippings...');
    const pTypes2 = ['press_release', 'newspaper_clipping', 'tv_feature', 'event', 'award'];
    const newsSeedDocs = [];
    for (let i = 0; i < 80; i++) {
      const title = `Media Feature #${i + 1}: Susrutha Ayurveda Expands Inpatient Services`;
      const slug = `news-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${i + 1}`;
      newsSeedDocs.push({
        title,
        slug,
        type: pTypes2[i % pTypes2.length],
        publicationType: 'newspaper',
        publisherName: i % 2 === 0 ? 'Malayala Manorama' : 'The Hindu Medical Special',
        articleUrl: 'https://thehindu.com',
        summary: `Susrutha Ayurveda Hospital introduces advanced research-backed Panchakarma clinical protocols.`,
        content: `Detailed media report highlighting patient outcomes and international panchakarma admissions at Susrutha Hospital...`,
        coverImage: getImg(IMAGES.hospital, i),
        isFeatured: i < 20,
        status: 'published',
      });
    }
    await NewsEvent.insertMany(newsSeedDocs);

    // ==========================================
    // 17. FAQS (120 FAQs)
    // ==========================================
    console.log('17. Seeding 120 Categorized FAQs...');
    const faqSeedDocs = [];
    for (let i = 0; i < 120; i++) {
      faqSeedDocs.push({
        question: `Question #${i + 1}: What should I expect during a ${deptTitles[i % deptTitles.length]} consultation?`,
        answer: `Our senior Vaidya will perform Nadi Pariksha (pulse diagnosis), assess your Prakriti (body constitution), review past medical records, and prescribe customized Panchakarma therapies.`,
        category: i % 3 === 0 ? 'PANCHAKARMA' : i % 2 === 0 ? 'ADMISSION' : 'INSURANCE',
        sortOrder: i + 1,
        status: 'ACTIVE',
      });
    }
    await FAQ.insertMany(faqSeedDocs);

    // ==========================================
    // 18. APPOINTMENTS (150 Appointments)
    // ==========================================
    console.log('18. Seeding 150 Patient Appointment Records...');
    const appointmentSeedDocs = [];
    for (let i = 0; i < 150; i++) {
      const doc = createdDoctors[i % createdDoctors.length];
      const branch = createdBranches[i % createdBranches.length];
      appointmentSeedDocs.push({
        appointmentNumber: `APT-2026-${1000 + i}`,
        patientName: `Patient ${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
        patientPhone: `+91 94471 ${10000 + i * 137}`,
        patientEmail: `patient${i + 1}@gmail.com`,
        branchId: branch._id,
        doctorId: doc._id,
        consultationType: i % 2 === 0 ? 'OPD_INPERSON' : 'IPD_ADMISSION',
        preferredDate: new Date(Date.now() + (i % 15) * 86400000),
        preferredTimeSlot: i % 2 === 0 ? '10:30 AM' : '04:30 PM',
        symptomsNote: `Consultation request for chronic pain and Panchakarma treatment package.`,
        status: i % 4 === 0 ? 'COMPLETED' : i % 2 === 0 ? 'CONFIRMED' : 'PENDING',
      });
    }
    await Appointment.insertMany(appointmentSeedDocs);

    // ==========================================
    // 19. LEADS & INQUIRIES (150 Leads)
    // ==========================================
    console.log('19. Seeding 150 Inquiries & Package Leads...');
    const leadSeedDocs = [];
    const leadSources = ['WEBSITE_CONTACT', 'HERO_CALLBACK', 'FOOTER_NEWSLETTER', 'WHATSAPP', 'BOOKING_WIZARD', 'FEEDBACK_FORM'] as const;
    const leadStatuses = ['NEW', 'CONTACTED', 'SCHEDULED', 'CLOSED'] as const;
    const leadTypes = ['PACKAGE_BOOKING', 'SINGLE_TREATMENT', 'GENERAL_INQUIRY', 'FEEDBACK_RATING'] as const;

    for (let i = 0; i < 150; i++) {
      const branch = createdBranches[i % createdBranches.length];
      leadSeedDocs.push({
        name: `Inquirer ${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
        phone: `+91 96566 ${10000 + i * 239}`,
        email: `enquiry${i + 1}@gmail.com`,
        subject: `Enquiry regarding ${deptTitles[i % deptTitles.length]} inpatient admission`,
        message: `Looking for room availability and panchakarma treatment package options at ${branch.name}.`,
        branchId: branch._id,
        leadType: leadTypes[i % leadTypes.length],
        source: leadSources[i % leadSources.length],
        status: leadStatuses[i % leadStatuses.length],
      });
    }
    await Lead.insertMany(leadSeedDocs);

    // ==========================================
    // 20. AUDIT LOGS (200 Logs)
    // ==========================================
    console.log('20. Seeding 200 System Audit Log Entries...');
    const auditSeedDocs = [];
    for (let i = 0; i < 200; i++) {
      auditSeedDocs.push({
        user: adminUser._id,
        userName: adminUser.name,
        userEmail: adminUser.email,
        action: i % 3 === 0 ? 'CONTENT_UPDATE' : i % 2 === 0 ? 'APPOINTMENT_SCHEDULED' : 'SYSTEM_CONFIG',
        module: i % 3 === 0 ? 'CMS' : i % 2 === 0 ? 'APPOINTMENTS' : 'SYSTEM',
        entityId: `ENTITY_${1000 + i}`,
        ipAddress: '127.0.0.1',
        userAgent: 'Susrutha API Engine / Seeder',
        details: { message: `Automated test execution log #${i + 1}` },
        timestamp: new Date(Date.now() - i * 3600000),
      });
    }
    await AuditLog.insertMany(auditSeedDocs);

    // ==========================================
    // 21. GLOBAL SETTINGS
    // ==========================================
    console.log('21. Seeding Global Site Settings...');
    await Setting.create([
      {
        key: 'GENERAL_SETTINGS',
        value: {
          hospitalName: 'SUSRUTHA Ayurvedhik Hospital',
          tagline: 'Research-backed 50+ Branches authentic Kerala Ayurveda hospital campus network',
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
          text: 'Authentic Kerala Panchakarma Admissions Open Across 50+ Branches in South India',
          link: '/packages',
          isEnabled: true,
        },
        description: 'Top header announcement banner text and link',
        isSystem: true,
      },
    ]);

    console.log('=====================================================');
    console.log('HIGH-CAPACITY LOAD SEEDING COMPLETED SUCCESSFULLY!');
    console.log('• 50 Hospital Branches & Specialty Clinics');
    console.log('• 40 Clinical Specialty Departments');
    console.log('• 100 Doctors with Photos, Schedules, & Fees');
    console.log('• 100 Health Conditions with FAQs & Symptoms');
    console.log('• 100 Classical Treatments with Indications & Steps');
    console.log('• 60 Care Packages with Pricing & Gallery Images');
    console.log('• 80 Infrastructure Wings & Facility Rooms');
    console.log('• 150 Health Blogs & Medical Articles');
    console.log('• 120 Patient Reviews & Testimonials');
    console.log('• 50 Ecosystem Pillars');
    console.log('• 100 Videos & Patient Stories');
    console.log('• 80 Photo & Video Gallery Albums');
    console.log('• 150 Media Library Files');
    console.log('• 50 Accreditations & Certifications');
    console.log('• 80 Press Releases & News Clippings');
    console.log('• 120 Categorized FAQs');
    console.log('• 150 Appointments & 150 Patient Leads');
    console.log('• 200 Audit Log Entries & System Settings');
    console.log('=====================================================');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
