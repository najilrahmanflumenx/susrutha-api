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

async function seedProductionDatabase() {
  try {
    console.log('Connecting to MongoDB for Authentic Production Seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    console.log('Purging all existing database collections...');
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
    // 1. ROLES & ADMIN USER
    // ==========================================
    console.log('1. Seeding System Roles & Super Admin...');
    const superAdminRole = await Role.create({
      name: 'SUPER_ADMIN',
      displayName: 'Super Administrator',
      description: 'Unrestricted full access across hospital branches, CMS, and system configuration.',
      permissions: ['*'],
      isSystem: true,
      status: 'ACTIVE',
    });

    await Role.create([
      {
        name: 'BRANCH_ADMIN',
        displayName: 'Branch Manager',
        description: 'Administrative access restricted to assigned hospital branches.',
        permissions: ['branch:read', 'branch:write', 'doctor:read', 'appointment:manage'],
        isSystem: true,
        status: 'ACTIVE',
      },
      {
        name: 'DOCTOR',
        displayName: 'Consultant Physician',
        description: 'Access to OPD schedules, patient appointments, and medical notes.',
        permissions: ['appointment:read', 'appointment:update', 'blog:create'],
        isSystem: true,
        status: 'ACTIVE',
      },
      {
        name: 'CONTENT_MANAGER',
        displayName: 'CMS Content Editor',
        description: 'Manage website content, press releases, gallery, and care packages.',
        permissions: ['blog:manage', 'media:manage', 'gallery:manage'],
        isSystem: true,
        status: 'ACTIVE',
      }
    ]);

    const passwordHash = await bcrypt.hash('SusruthaAdmin2026!', 10);
    const adminUser = await User.create({
      name: 'Susrutha Super Admin',
      email: 'admin@susruthaayurveda.com',
      phone: '+91 9656656736',
      passwordHash,
      roleId: superAdminRole._id,
      assignedBranchIds: [],
      status: 'ACTIVE',
    });

    // ==========================================
    // 2. AUTHENTIC BRANCHES
    // ==========================================
    console.log('2. Seeding Authentic Susrutha Hospital Branches (Kattakada & Kowdiar)...');
    const kattakadaBranch = await Branch.create({
      name: 'Susrutha Institute of Ayurvedic Sciences (Research) and Panchakarma Hospital',
      code: 'KTK',
      type: 'INPATIENT_HOSPITAL',
      tagline: '30-Bed Inpatient Panchakarma Hospital Campus & Research Institute',
      address: {
        street: 'Opposite Christian College, Kattakada',
        city: 'Kattakada, Thiruvananthapuram',
        state: 'Kerala',
        pincode: '695572',
        coordinates: { lat: 8.50749, lng: 77.08346 },
      },
      contact: {
        phone: ['0471-2291027', '+91 9656656736', '+91 9446583803', '+91 9447892399'],
        email: 'kattakada@susruthaayurveda.com',
        emergencyPhone: '+91 9656656736',
      },
      opdTimings: '09:00 AM - 07:00 PM (OPD) | 24x7 Inpatient & Emergency Service',
      bedCapacity: 30,
      features: [
        '24x7 Hospital Service & Resident Vaidya Monitoring',
        'Panchakarma Treatment Suites & Teak Droni Tables',
        'Susrutha Medi Tech Lab & Home Sampling Services',
        'Ayurvedic Proctology & Kshara Sutra OT',
        'In-House GMP Certified Pharmacy',
        'Organic Pathya Diet Catering Service',
        'Physiotherapy Unit & Yoga Hall'
      ],
      coverImage: '/images/old_site/kattakada-hospital.jpg',
      isMainBranch: true,
      status: 'ACTIVE',
    });

    const kowdiarBranch = await Branch.create({
      name: 'Susrutha Panchakarma Hospital OP Outlet',
      code: 'KWR',
      type: 'CITY_CLINIC',
      tagline: 'Executive OPD & Daycare Panchakarma Specialty Outlet',
      address: {
        street: 'Ground Floor, Urbon Heights, Opposite Income Tax Office, Pipelane Road, Kowdiar',
        city: 'Thiruvananthapuram',
        state: 'Kerala',
        pincode: '695003',
        coordinates: { lat: 8.52629, lng: 76.95845 },
      },
      contact: {
        phone: ['+91 8075433728', '+91 8075483770'],
        email: 'kowdiar@susruthaayurveda.com',
        emergencyPhone: '+91 8075433728',
      },
      opdTimings: '09:00 AM - 07:00 PM (Mon - Sun)',
      bedCapacity: 0,
      features: [
        'Senior Vaidya & Specialist OPD Consultation',
        'Daycare Panchakarma & Shirodhara Rooms',
        'Nadi Pariksha & Pulse Diagnosis',
        'Ayurvedic Medicine Counter & Delivery',
        'Convenient City Location with Dedicated Parking'
      ],
      coverImage: '/images/old_site/kowdiar-branch.jpg',
      isMainBranch: false,
      status: 'ACTIVE',
    });

    // ==========================================
    // 3. CLINICAL DEPARTMENTS
    // ==========================================
    console.log('3. Seeding Authentic Clinical Departments...');
    const createdDepts = await Department.create([
      {
        title: 'Panchakarma & Bio-Purification',
        slug: 'panchakarma-bio-purification',
        code: 'D101',
        tagline: 'Classical 5-Fold Detoxification & Body Purification',
        overview: 'Classical Kerala Panchakarma therapies designed to eliminate metabolic toxins (Ama) and restore Vata-Pitta-Kapha equilibrium.',
        image: '/images/old_site/dept-panchakarma.jpg',
        status: 'ACTIVE',
      },
      {
        title: 'Kayachikitsa (Internal Medicine)',
        slug: 'kayachikitsa-internal-medicine',
        code: 'D102',
        tagline: 'Ayurvedic General Medicine & Metabolism Care',
        overview: 'Specialized treatment for chronic metabolic, gastrointestinal, and systemic disorders.',
        image: '/images/old_site/dept-kayachikitsa.jpg',
        status: 'ACTIVE',
      },
      {
        title: 'Neck, Back & Joint Problems',
        slug: 'neck-back-joint-problems',
        code: 'D103',
        tagline: 'Spine & Musculoskeletal Rehabilitation',
        overview: 'Comprehensive care for Spondylosis, Disc Prolapse, Sciatica, and Joint Degeneration.',
        image: '/images/old_site/dept-joint.jpg',
        status: 'ACTIVE',
      },
      {
        title: 'Stroke & Neurological Rehabilitation',
        slug: 'stroke-neurological-rehabilitation',
        code: 'D104',
        tagline: 'Neurological Recovery & Post-Stroke Care',
        overview: 'Post-stroke palliative care protocols to regenerate damaged nerve functions and restore motor mobility.',
        image: '/images/old_site/dept-stroke.jpg',
        status: 'ACTIVE',
      },
      {
        title: 'Rheumatology',
        slug: 'rheumatology',
        code: 'D105',
        tagline: 'Autoimmune & Connective Tissue Disorder Care',
        overview: 'Ayurvedic management of Rheumatoid Arthritis, Ankylosing Spondylitis, and Gout.',
        image: '/images/old_site/dept-rheumatology.jpg',
        status: 'ACTIVE',
      },
      {
        title: 'Prasooti Tantra & Stree Roga (Women Health & Fertility)',
        slug: 'prasooti-tantra-stree-roga',
        code: 'D106',
        tagline: 'Ayurvedic Gynaecology, Infertility & Postnatal Care',
        overview: 'Specialized care for PCOS, Hormonal Infertility, Uterine Fibroids, and Postnatal Mother & Baby Care.',
        image: '/images/old_site/dept-women-fertility.jpg',
        status: 'ACTIVE',
      },
      {
        title: 'Susrutha Proctology Unit (Ano Rectal Care)',
        slug: 'susrutha-proctology-unit',
        code: 'D107',
        tagline: 'Kshara Sutra Non-Surgical Anorectal Surgery',
        overview: 'Pioneering Kshara Sutra ligation procedure for permanent cure of Piles, Anal Fistula, and Fissures.',
        image: '/images/old_site/dept-proctology.jpg',
        status: 'ACTIVE',
      },
      {
        title: 'Preventive Medicine & Rejuvenation',
        slug: 'preventive-medicine-rejuvenation',
        code: 'D108',
        tagline: 'Swasthavritta & Rasayana Immunity Care',
        overview: 'Lifestyle consultation, anti-aging Rasayana regimens, and immune-boosting therapies.',
        image: '/images/old_site/dept-general-medicine.jpg',
        status: 'ACTIVE',
      },
      {
        title: 'Susrutha Medi Tech Lab Services',
        slug: 'susrutha-medi-tech-lab-services',
        code: 'D109',
        tagline: 'Full-Fledged Diagnostic Investigations',
        overview: 'Blood and body fluid diagnostic facility supporting outpatient and inpatient care with 5km home sampling.',
        image: '/images/old_site/ayurveda-health1.jpg',
        status: 'ACTIVE',
      }
    ]);

    // Map department IDs
    const deptMap: Record<string, mongoose.Types.ObjectId> = {};
    createdDepts.forEach((d) => { deptMap[d.slug] = d._id; });

    // ==========================================
    // 4. AUTHENTIC DOCTORS
    // ==========================================
    console.log('4. Seeding 9 Authentic Susrutha Physicians...');
    const doctorsData = [
      {
        name: 'Dr. Krishnakumar K.',
        slug: 'dr-krishnakumar-k',
        designation: 'Managing Director & Chief Physician',
        qualifications: 'MD (Ayurveda)',
        experienceYears: 28,
        registrationNumber: 'TCMC/AYU/8942',
        departmentId: deptMap['neck-back-joint-problems'],
        assignedBranchIds: [kattakadaBranch._id],
        bio: 'Dr. Krishnakumar K. is the Managing Director and Chief Physician of Susrutha Institute of Ayurvedic Sciences. Son of legendary Prof. Dr. Krishnankutty Nair, he has nearly 3 decades of clinical experience in Panchakarma, Spine & Joint Care, and chronic disease management.',
        consultationFee: 500,
        specialties: ['Spine Care', 'Joint Problems', 'Panchakarma', 'Chronic Diseases'],
        languagesSpoken: ['Malayalam', 'English', 'Hindi', 'Tamil'],
        photoUrl: '/images/old_site/dr-krishnakumar.jpg',
        photo: '/images/old_site/dr-krishnakumar.jpg',
        availability: [
          { branchId: kattakadaBranch._id, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], timeSlots: ['On Prior Appointment'] }
        ],
        isDirector: true,
        isFeatured: true,
        sortOrder: 1,
        status: 'ACTIVE',
      },
      {
        name: 'Dr. Sreeja Krishna S.',
        slug: 'dr-sreeja-krishna-s',
        designation: 'Director & Senior Consultant Physician',
        qualifications: 'BAMS, MBA Hospital Management',
        experienceYears: 22,
        registrationNumber: 'TCMC/AYU/10412',
        departmentId: deptMap['preventive-medicine-rejuvenation'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        bio: 'Dr. Sreeja Krishna S. is Director and Senior Consultant Physician at Susrutha Ayurveda. She specializes in Women’s Health, General Medicine, and Hospital Administration, upholding the legacy of clinical excellence.',
        consultationFee: 450,
        specialties: ['Women’s Health & Fertility', 'Panchakarma', 'General Medicine', 'Preventive Care'],
        languagesSpoken: ['Malayalam', 'English', 'Tamil'],
        photoUrl: '/images/old_site/dr-sreejakrishna.jpg',
        photo: '/images/old_site/dr-sreejakrishna.jpg',
        availability: [
          { branchId: kattakadaBranch._id, days: ['Tue', 'Thu', 'Sat'], timeSlots: ['09:00 AM - 04:00 PM'] },
          { branchId: kowdiarBranch._id, days: ['Wed'], timeSlots: ['09:00 AM - 05:00 PM'] }
        ],
        isDirector: true,
        isFeatured: true,
        sortOrder: 2,
        status: 'ACTIVE',
      },
      {
        name: 'Dr. Priyanka R.',
        slug: 'dr-priyanka-r',
        designation: 'Ayurvedic Gynaecologist & Obstetrician',
        qualifications: 'BAMS, MS (Ayurveda)',
        experienceYears: 15,
        registrationNumber: 'TCMC/AYU/14230',
        departmentId: deptMap['prasooti-tantra-stree-roga'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        bio: 'Dr. Priyanka R. is a renowned specialist in Prasooti & Stree Roga (Ayurvedic Gynaecology & Obstetrics) and Postnatal Care. She leads Susrutha’s Post Natal & Mother Care unit.',
        consultationFee: 400,
        specialties: ['Women’s Health & Fertility', 'Post Natal Care', 'Gynecological Disorders', 'PCOS Care'],
        languagesSpoken: ['Malayalam', 'English', 'Hindi'],
        photoUrl: '/images/old_site/dr-priyanka.jpg',
        photo: '/images/old_site/dr-priyanka.jpg',
        availability: [
          { branchId: kattakadaBranch._id, days: ['Sun', 'Mon', 'Wed', 'Fri'], timeSlots: ['09:00 AM - 05:00 PM'] },
          { branchId: kowdiarBranch._id, days: ['Tue'], timeSlots: ['09:00 AM - 05:00 PM'] }
        ],
        isDirector: false,
        isFeatured: true,
        sortOrder: 3,
        status: 'ACTIVE',
      },
      {
        name: 'Dr. M. K. Sasidharan',
        slug: 'dr-m-k-sasidharan',
        designation: 'Visiting Senior Professor & Panchakarma Consultant',
        qualifications: 'BAMS, MD (Ayurveda)',
        experienceYears: 42,
        registrationNumber: 'TCMC/AYU/4102',
        departmentId: deptMap['panchakarma-bio-purification'],
        assignedBranchIds: [kowdiarBranch._id],
        bio: 'Dr. M. K. Sasidharan is Former Professor at Govt. Ayurveda College Trivandrum and Former Head of Govt. Panchakarma Hospital Poojappura. He provides expert clinical consultations at Kowdiar Center.',
        consultationFee: 600,
        specialties: ['Panchakarma Bio-Purification', 'Neurological Rehab', 'Complex Musculoskeletal Diseases'],
        languagesSpoken: ['Malayalam', 'English', 'Sanskrit'],
        photoUrl: '/images/old_site/doctor-avatar.jpg',
        photo: '/images/old_site/doctor-avatar.jpg',
        availability: [
          { branchId: kowdiarBranch._id, days: ['Sat'], timeSlots: ['09:00 AM - 01:00 PM'] }
        ],
        isDirector: false,
        isFeatured: true,
        sortOrder: 4,
        status: 'ACTIVE',
      },
      {
        name: 'Dr. Vinaya Babu B.',
        slug: 'dr-vinaya-babu-b',
        designation: 'Senior Consultant Physician (Chief Medical Officer Rtd Govt. of Kerala)',
        qualifications: 'BSc, BAMS',
        experienceYears: 38,
        registrationNumber: 'TCMC/AYU/5290',
        departmentId: deptMap['kayachikitsa-internal-medicine'],
        assignedBranchIds: [kowdiarBranch._id],
        bio: 'Dr. Vinaya Babu B. served as Chief Medical Officer in the Govt. of Kerala. He brings 38+ years of expertise in clinical diagnosis and chronic disease care.',
        consultationFee: 500,
        specialties: ['Kayachikitsa General Medicine', 'Rheumatology', 'Preventive Healthcare'],
        languagesSpoken: ['Malayalam', 'English'],
        photoUrl: '/images/old_site/dr-vinaya-babu.jpg',
        photo: '/images/old_site/dr-vinaya-babu.jpg',
        availability: [
          { branchId: kowdiarBranch._id, days: ['Mon', 'Thu'], timeSlots: ['09:00 AM - 01:00 PM'] }
        ],
        isDirector: false,
        isFeatured: true,
        sortOrder: 5,
        status: 'ACTIVE',
      },
      {
        name: 'Dr. Dipu Sukumar',
        slug: 'dr-dipu-sukumar',
        designation: 'Ayurveda Proctologist & Kshara Sutra Specialist',
        qualifications: 'BAMS, MS (Ayurveda Shalya)',
        experienceYears: 14,
        registrationNumber: 'TCMC/AYU/15102',
        departmentId: deptMap['susrutha-proctology-unit'],
        assignedBranchIds: [kattakadaBranch._id],
        bio: 'Dr. Dipu Sukumar leads the Susrutha Proctology Unit, specializing in non-surgical Kshara Sutra ligation for Piles, Anal Fistula, and Fissures.',
        consultationFee: 450,
        specialties: ['Proctology & Kshara Sutra', 'Piles & Fistula Care', 'Anorectal Surgery Recovery'],
        languagesSpoken: ['Malayalam', 'English', 'Tamil'],
        photoUrl: '/images/old_site/doctor-avatar.jpg',
        photo: '/images/old_site/doctor-avatar.jpg',
        availability: [
          { branchId: kattakadaBranch._id, days: ['Mon', 'Wed', 'Fri'], timeSlots: ['On Prior Appointment'] }
        ],
        isDirector: false,
        isFeatured: true,
        sortOrder: 6,
        status: 'ACTIVE',
      },
      {
        name: 'Dr. Nithya P.',
        slug: 'dr-nithya-p',
        designation: 'Consultant Ayurvedic Physician',
        qualifications: 'BAMS',
        experienceYears: 9,
        registrationNumber: 'TCMC/AYU/18204',
        departmentId: deptMap['kayachikitsa-internal-medicine'],
        assignedBranchIds: [kowdiarBranch._id],
        bio: 'Dr. Nithya P. is a dedicated consultant Vaidya providing OPD consultations and panchakarma care planning at Susrutha Kowdiar Center.',
        consultationFee: 350,
        specialties: ['General Medicine', 'Stress & Insomnia', 'Dermatology & Skin Care'],
        languagesSpoken: ['Malayalam', 'English'],
        photoUrl: '/images/old_site/dr-nithya.jpg',
        photo: '/images/old_site/dr-nithya.jpg',
        availability: [
          { branchId: kowdiarBranch._id, days: ['Sat'], timeSlots: ['09:00 AM - 03:00 PM'] }
        ],
        isDirector: false,
        isFeatured: true,
        sortOrder: 7,
        status: 'ACTIVE',
      },
      {
        name: 'Dr. Roopasree',
        slug: 'dr-roopasree',
        designation: 'Resident Medical Officer (RMO)',
        qualifications: 'BAMS',
        experienceYears: 7,
        registrationNumber: 'TCMC/AYU/19310',
        departmentId: deptMap['panchakarma-bio-purification'],
        assignedBranchIds: [kattakadaBranch._id],
        bio: 'Dr. Roopasree serves as Resident Medical Officer at Kattakada 30-bed Inpatient Hospital, ensuring 24x7 emergency and inpatient patient monitoring.',
        consultationFee: 300,
        specialties: ['Inpatient Care & Monitoring', 'Panchakarma Management', 'Emergency Ayurveda'],
        languagesSpoken: ['Malayalam', 'English', 'Tamil'],
        photoUrl: '/images/old_site/dr-roopasree.jpg',
        photo: '/images/old_site/dr-roopasree.jpg',
        availability: [
          { branchId: kattakadaBranch._id, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], timeSlots: ['24X7 Resident Duty'] }
        ],
        isDirector: false,
        isFeatured: true,
        sortOrder: 8,
        status: 'ACTIVE',
      },
      {
        name: 'Dr. K. Kaveri',
        slug: 'dr-k-kaveri',
        designation: 'Consultant Medical Officer',
        qualifications: 'BAMS',
        experienceYears: 8,
        registrationNumber: 'TCMC/AYU/18902',
        departmentId: deptMap['preventive-medicine-rejuvenation'],
        assignedBranchIds: [kattakadaBranch._id],
        bio: 'Dr. K. Kaveri is an experienced Vaidya focusing on preventive medicine, dietetics, and panchakarma bio-purification therapies.',
        consultationFee: 350,
        specialties: ['Preventive Medicine', 'Kayachikitsa', 'Dietetics & Lifestyle'],
        languagesSpoken: ['Malayalam', 'English'],
        photoUrl: '/images/old_site/dr-k-kaveri.jpg',
        photo: '/images/old_site/dr-k-kaveri.jpg',
        availability: [
          { branchId: kattakadaBranch._id, days: ['Mon', 'Wed', 'Fri'], timeSlots: ['09:00 AM - 04:00 PM'] }
        ],
        isDirector: false,
        isFeatured: true,
        sortOrder: 9,
        status: 'ACTIVE',
      }
    ];

    const createdDoctors = await Doctor.create(doctorsData);

    // ==========================================
    // 5. AUTHENTIC CARE PACKAGES
    // ==========================================
    console.log('5. Seeding 12 Authentic Susrutha Care Packages...');
    const packagesData = [
      {
        title: 'Ano Rectal Care Package (Piles & Fistula)',
        slug: 'ano-rectal-care-package',
        subtitle: 'Kshara Sutra & Non-Surgical Anorectal Healing',
        durationDays: 7,
        overview: 'Specialized Ayurvedic treatment for Hemorrhoids (Piles), Anal Fistula, and Fissures using classical Kshara Sutra ligation, Kashaya Parisheka, and soothing herbal medicines.',
        inclusions: ['Specialist Proctologist Consultations', 'Kshara Sutra Ligation Procedure', 'Daily Anorectal Sitz Baths & Dressing', 'Pain Relief Herbal Formulations', 'Post-Procedure Pathya Diet Plan'],
        targetAilments: ['Piles', 'Fistula-in-Ano', 'Anal Fissures', 'Rectal Prolapse'],
        price: 18000,
        image: '/images/old_site/dept-proctology.jpg',
        coverImage: '/images/old_site/dept-proctology.jpg',
        galleryImages: ['/images/old_site/dept-proctology.jpg', '/images/old_site/kattakada-hospital.jpg'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        sortOrder: 1,
        status: 'ACTIVE',
      },
      {
        title: 'Rejuvenation Package',
        slug: 'rejuvenation-package',
        subtitle: 'Authentic Kerala Rasayana & Detox Program',
        durationDays: 7,
        overview: 'Revitalize your body, mind, and spirit through authentic Kerala Rasayana Chikitsa, Abhyangam, Shirodhara, and Herbal Steam baths to enhance vitality and cellular longevity.',
        inclusions: ['Daily Vaidya Consultations', 'Abhyangam 4-Hand Synchronization Massage', 'Shirodhara Stream Therapy', 'Swedanam Steam Bath', 'Rasayana Internal Medicines'],
        targetAilments: ['Premature Aging', 'Fatigue & Burnout', 'Low Immunity', 'General Debility'],
        price: 22000,
        image: '/images/old_site/dept-panchakarma.jpg',
        coverImage: '/images/old_site/dept-panchakarma.jpg',
        galleryImages: ['/images/old_site/dept-panchakarma.jpg', '/images/old_site/ayurveda-health1.jpg'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        sortOrder: 2,
        status: 'ACTIVE',
      },
      {
        title: 'Post Natal Care Package (OP/IP)',
        slug: 'post-natal-care-package',
        subtitle: 'Prasooti & Stree Roga Mother & Baby Recovery Care',
        durationDays: 14,
        overview: 'Comprehensive post-partum Ayurvedic care for new mothers to restore pelvic strength, promote lactation, relieve physical strain, and enhance newborn immunity under female specialist Vaidyas.',
        inclusions: ['Obstetric Vaidya Supervision', 'Postnatal Abhyangam & Belly Wrapping (Stanya Janana)', 'Medicated Herbal Baths (Vethu)', 'Lactation Enhancing Kashayams', 'Newborn Oil Massage Guidance'],
        targetAilments: ['Postpartum Fatigue', 'Uterine Involution Support', 'Lactation Deficit', 'Pelvic Instability'],
        price: 35000,
        image: '/images/old_site/dept-prasooti.jpg',
        coverImage: '/images/old_site/dept-prasooti.jpg',
        galleryImages: ['/images/old_site/dept-prasooti.jpg', '/images/old_site/dept-women-fertility.jpg'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        sortOrder: 3,
        status: 'ACTIVE',
      },
      {
        title: 'Low Back Pain Care Package',
        slug: 'low-back-pain-care-package',
        subtitle: 'Kadi Vasthi & Lumbar Spine Rehabilitation',
        durationDays: 7,
        overview: 'Focused treatment program for Lumbar Spondylosis, Sciatica, and Intervertebral Disc Prolapse using Kadi Vasthi, Elakizhi, and nerve-strengthening herbal oils.',
        inclusions: ['Senior Spine Doctor Consultations', 'Daily Kadi Vasthi (Lumbar Oil Retention Pool)', 'Elakizhi Leaf Poultice Massage', 'Sneha Vasthi Medicated Enema', 'Spine Ergonomic Advice'],
        targetAilments: ['Lumbar Spondylosis', 'Sciatica', 'Disc Herniation', 'Low Back Muscular Spasm'],
        price: 24000,
        image: '/images/old_site/dept-joint.jpg',
        coverImage: '/images/old_site/dept-joint.jpg',
        galleryImages: ['/images/old_site/dept-joint.jpg', '/images/old_site/kattakada-hospital.jpg'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        sortOrder: 4,
        status: 'ACTIVE',
      },
      {
        title: 'Neck Pain Care Package',
        slug: 'neck-pain-care-package',
        subtitle: 'Griva Vasthi & Cervical Spine Therapy',
        durationDays: 7,
        overview: 'Specialized therapy targeted at Cervical Spondylosis, Trapezitis, and upper back stiffness using warm medicated Griva Vasthi oil pools and Nasyam.',
        inclusions: ['Spine Specialist Consultation', 'Daily Griva Vasthi (Cervical Oil Retention Pool)', 'Podikizhi Herbal Fomentation', 'Therapeutic Nasyam Drops', 'Neck Mobility Exercises'],
        targetAilments: ['Cervical Spondylosis', 'Trapezitis', 'Numbness in Arms', 'Cervical Radiculopathy'],
        price: 22000,
        image: '/images/old_site/dept-joint.jpg',
        coverImage: '/images/old_site/dept-joint.jpg',
        galleryImages: ['/images/old_site/dept-joint.jpg', '/images/old_site/kowdiar-branch.jpg'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        sortOrder: 5,
        status: 'ACTIVE',
      },
      {
        title: '3 Days Ayurveda Package',
        slug: '3-days-ayurveda-package',
        subtitle: 'Quick Express Detox & Stress Relief',
        durationDays: 3,
        overview: 'An express 3-day wellness getaway designed for busy professionals to relieve stress, unblock fatigue, and experience signature Abhyangam and Shirodhara therapies.',
        inclusions: ['Physician Health Assessment', 'Daily Full Body Abhyangam', 'Shirodhara Session', 'Herbal Steam Bath', 'Herbal Wellness Drinks'],
        targetAilments: ['Workplace Stress', 'Jet Lag', 'Mild Insomnia', 'Muscle Tension'],
        price: 9500,
        image: '/images/old_site/ayurveda-health1.jpg',
        coverImage: '/images/old_site/ayurveda-health1.jpg',
        galleryImages: ['/images/old_site/ayurveda-health1.jpg', '/images/old_site/slider-1.jpg'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        sortOrder: 6,
        status: 'ACTIVE',
      },
      {
        title: '5 Days Ayurveda Package',
        slug: '5-days-ayurveda-package',
        subtitle: 'Short Renewal & Body Purifying Program',
        durationDays: 5,
        overview: 'A 5-day short-stay panchakarma program providing deep tissue relaxation, skin rejuvenation, and digestive fire (Agni) correction.',
        inclusions: ['Vaidya Pulse Diagnosis', '2x Daily Panchakarma Therapies', 'Takradhara or Shirodhara', 'Pathya Ayurvedic Meals', 'Personalized Herbal Prescriptions'],
        targetAilments: ['Stress & Anxiety', 'Digestive Sluggishness', 'Body Stiffness', 'Skin Dullness'],
        price: 16000,
        image: '/images/old_site/ayurveda-health2.jpg',
        coverImage: '/images/old_site/ayurveda-health2.jpg',
        galleryImages: ['/images/old_site/ayurveda-health2.jpg', '/images/old_site/slider-2.jpg'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        sortOrder: 7,
        status: 'ACTIVE',
      },
      {
        title: '7 Days Ayurveda Care Package',
        slug: '7-days-ayurveda-care-package',
        subtitle: 'Full Panchakarma Detox & Bio-Purification',
        durationDays: 7,
        overview: 'The golden standard 7-day inpatient detox program following classic Purvakarma (Snehana & Swedana) and Shodhana bio-purification techniques.',
        inclusions: ['Daily Senior Doctor Visits', 'Customized 7-Day Panchakarma Schedule', 'Virechana or Vasthi Therapy', 'Private Room Accommodation', 'Organic Ayurvedic Diet Plan'],
        targetAilments: ['Dosha Imbalance', 'Chronic Pain', 'Metabolic Toxins', 'Hypertension'],
        price: 26000,
        image: '/images/old_site/dept-panchakarma.jpg',
        coverImage: '/images/old_site/dept-panchakarma.jpg',
        galleryImages: ['/images/old_site/dept-panchakarma.jpg', '/images/old_site/kattakada-hospital.jpg'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        sortOrder: 8,
        status: 'ACTIVE',
      },
      {
        title: '16 Days Ayurveda Care Package',
        slug: '16-days-ayurveda-care-package',
        subtitle: 'Deep Tissue Purification & Chronic Disease Recovery',
        durationDays: 16,
        overview: 'Comprehensive 16-day inpatient medical recovery course for severe arthritis, neurological deficits, stroke rehabilitation, and chronic autoimmune disorders.',
        inclusions: ['Comprehensive Vaidya Team Supervision', 'Full 5-Fold Panchakarma Therapies', 'Pizhichil & Njavarakizhi Courses', 'Deluxe Room Accommodation', 'Post-Discharge Medicine Kit'],
        targetAilments: ['Stroke Recovery', 'Rheumatoid Arthritis', 'Paraplegia', 'Severe Psoriasis'],
        price: 58000,
        image: '/images/old_site/kattakada-hospital.jpg',
        coverImage: '/images/old_site/kattakada-hospital.jpg',
        galleryImages: ['/images/old_site/kattakada-hospital.jpg', '/images/old_site/dept-stroke.jpg'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        sortOrder: 9,
        status: 'ACTIVE',
      },
      {
        title: 'Psoriasis & Other Skin Disease Care',
        slug: 'psoriasis-other-skin-disease-care',
        subtitle: 'Takradhara & Raktamokshana Skin Healing',
        durationDays: 14,
        overview: 'Specialized clinical protocol for Psoriasis, Eczema, and Allergic Dermatitis incorporating Takradhara (buttermilk pour), Lepam, and Raktamokshana blood purification.',
        inclusions: ['Dermatological Vaidya Consultations', 'Daily Takradhara (Medicated Buttermilk Pour)', 'Herbal Medicinal Paste (Lepam)', 'Blood Purifying Kashayams', 'Strict Dietary Guidance'],
        targetAilments: ['Psoriasis', 'Eczema', 'Chronic Hives', 'Allergic Dermatitis'],
        price: 38000,
        image: '/images/old_site/dept-kayachikitsa.jpg',
        coverImage: '/images/old_site/dept-kayachikitsa.jpg',
        galleryImages: ['/images/old_site/dept-kayachikitsa.jpg', '/images/old_site/ayurveda-health1.jpg'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        sortOrder: 10,
        status: 'ACTIVE',
      },
      {
        title: 'Stress Care Package',
        slug: 'stress-care-package',
        subtitle: 'Mind Relaxation & Insomnia Relief Program',
        durationDays: 7,
        overview: 'Holistic mind-body relaxation package combining Shirodhara, Thalam, Sirovasthi, and Medicated Milk Pouring (Ksheeradhara) for sleep and anxiety disorders.',
        inclusions: ['Ayurvedic Psychiatrist / Vaidya Consultation', 'Daily Shirodhara or Takradhara', 'Thalam Scalp Application', 'Pranayama & Meditation Sessions', 'Nervine Tonic Formulations'],
        targetAilments: ['Insomnia', 'Chronic Stress', 'Anxiety & Panic', 'Burnout'],
        price: 23000,
        image: '/images/old_site/slider-1.jpg',
        coverImage: '/images/old_site/slider-1.jpg',
        galleryImages: ['/images/old_site/slider-1.jpg', '/images/old_site/slider-6.jpg'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        sortOrder: 11,
        status: 'ACTIVE',
      },
      {
        title: 'Tekky Package (Occupational Disorder Care)',
        slug: 'tekky-package-occupational-disorder-care',
        subtitle: 'Specialized Care for IT & Corporate Professionals',
        durationDays: 7,
        overview: 'Tailored for software engineers, desk professionals, and corporate workers suffering from Tech Neck, Carpal Tunnel Syndrome, Computer Vision Syndrome, and sedentary spinal compression.',
        inclusions: ['Occupational Health Vaidya Consultation', 'Ergonomic Body Alignment Massage', 'Netra Tarpana Eye Rejuvenation', 'Griva & Kadi Vasthi Sessions', 'Desk Posture Guidance'],
        targetAilments: ['Tech Neck Strain', 'Carpal Tunnel Syndrome', 'Computer Vision Strain', 'Lumbar Stiffness'],
        price: 21000,
        image: '/images/old_site/slider-5.jpg',
        coverImage: '/images/old_site/slider-5.jpg',
        galleryImages: ['/images/old_site/slider-5.jpg', '/images/old_site/dept-joint.jpg'],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        sortOrder: 12,
        status: 'ACTIVE',
      }
    ];

    await CarePackage.create(packagesData);

    // ==========================================
    // 6. AUTHENTIC CLASSICAL TREATMENTS
    // ==========================================
    console.log('6. Seeding Authentic Panchakarma & Dhara Treatments...');
    const createdTreatments = await Treatment.create([
      {
        title: 'Shirodhara (Medicated Oil Stream)',
        slug: 'shirodhara-medicated-oil-stream',
        category: 'Dhara',
        malayalam: 'ശിരോധാര',
        shortDescription: 'Continuous pouring of warm medicated oil onto the forehead to relieve stress, insomnia, and nervous tension.',
        fullDescription: 'Shirodhara is a classical Ayurvedic therapy where a continuous stream of warm herbal oil is poured on the forehead (Uttama Anga). It regulates central nervous system impulses, corrects hormonal imbalances, and provides profound mental clarity.',
        coverImage: '/images/old_site/slider-1.jpg',
        durationMinutes: 45,
        recommendedDays: 14,
        indications: ['Chronic Headache', 'Insomnia', 'Mental Stress & Anxiety', 'Hypertension'],
        benefits: ['Calms central nervous system', 'Improves sleep quality', 'Reduces mental fatigue'],
        doctorIds: [createdDoctors[0]._id, createdDoctors[1]._id],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        status: 'published',
      },
      {
        title: 'Takradhara (Medicated Buttermilk Pour)',
        slug: 'takradhara-medicated-buttermilk-pour',
        category: 'Dhara',
        malayalam: 'തക്രധാര',
        shortDescription: 'Pouring of medicated buttermilk over head to treat Psoriasis, Hypertension, and Heat-related Doshas.',
        fullDescription: 'Takradhara involves pouring specially prepared herbal buttermilk over the forehead. Highly effective in Psoriasis, Eczema, burning sensation in Diabetes Mellitus, and stress-induced cardiac disorders.',
        coverImage: '/images/old_site/dept-kayachikitsa.jpg',
        durationMinutes: 45,
        recommendedDays: 14,
        indications: ['Psoriasis & Eczema', 'Hypertension', 'Burning Sensation in Feet', 'Loss of Memory'],
        benefits: ['Cools aggravated Pitta', 'Relieves skin scaling', 'Improves concentration'],
        doctorIds: [createdDoctors[1]._id, createdDoctors[6]._id],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        status: 'published',
      },
      {
        title: 'Amla Dhara',
        slug: 'amla-dhara',
        category: 'Dhara',
        malayalam: 'ആമ്ലധാര',
        shortDescription: 'Warm fermented herbal liquid pour for spinal deformities, paralysis, and strain disorders.',
        fullDescription: 'Amla Dhara yields satisfactory results in Hemiplegia, Paraplegia, Lordosis, Scoliosis, and stressful disorders of the spine.',
        coverImage: '/images/old_site/dept-stroke.jpg',
        durationMinutes: 45,
        recommendedDays: 14,
        indications: ['Hemiplegia & Paraplegia', 'Lordosis & Scoliosis', 'Spinal Strain'],
        benefits: ['Relieves spinal nerve stiffness', 'Promotes nerve regeneration'],
        doctorIds: [createdDoctors[0]._id, createdDoctors[3]._id],
        assignedBranchIds: [kattakadaBranch._id],
        isFeatured: true,
        status: 'published',
      },
      {
        title: 'Ksheera Dhara',
        slug: 'ksheera-dhara',
        category: 'Dhara',
        malayalam: 'ക്ഷീരധാര',
        shortDescription: 'Pouring of herbal medicated milk for headache, eye strain, and premature hair graying.',
        fullDescription: 'Ksheera Dhara uses pure milk decoctions infused with Ayurvedic herbs to soothe headaches, eye ailments, and strain-induced insomnia.',
        coverImage: '/images/old_site/ayurveda-health1.jpg',
        durationMinutes: 45,
        recommendedDays: 7,
        indications: ['Headache of All Types', 'Eye Ailments', 'Premature Hair Graying', 'Insomnia'],
        benefits: ['Nourishes sensory organs', 'Reduces cranial inflammation'],
        doctorIds: [createdDoctors[1]._id, createdDoctors[2]._id],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        status: 'published',
      },
      {
        title: 'Kshara Sutra Ligation',
        slug: 'kshara-sutra-ligation',
        category: 'Proctology',
        malayalam: 'ക്ഷാരസൂത്ര ചികിത്സ',
        shortDescription: 'Pioneering Ayurvedic non-surgical surgical technique for permanent cure of Fistula-in-Ano and Piles.',
        fullDescription: 'Kshara Sutra is a minimally invasive parasurgical procedure utilizing medicated linen threads coated with alkaline plant extracts for excision of fistula tracks and piles without surgical cutting.',
        coverImage: '/images/old_site/dept-proctology.jpg',
        durationMinutes: 30,
        recommendedDays: 7,
        indications: ['Anal Fistula (Bhagandara)', 'Piles (Arshas)', 'Anal Fissure (Parikartika)'],
        benefits: ['Zero recurrence rate', 'No surgical scars', 'Daycare procedure'],
        doctorIds: [createdDoctors[5]._id],
        assignedBranchIds: [kattakadaBranch._id],
        isFeatured: true,
        status: 'published',
      },
      {
        title: 'Abhyangam (Warm Oil Sync Massage)',
        slug: 'abhyangam-warm-oil-sync-massage',
        category: 'Panchakarma',
        malayalam: 'അഭ്യംഗം',
        shortDescription: 'Rhythmic 4-hand synchronization body massage using warm dosha-specific oils.',
        fullDescription: 'Classical full-body warm oil massage performed in 7 postural positions to liquefy toxins, lubricate joints, and slow degenerative aging.',
        coverImage: '/images/old_site/dept-panchakarma.jpg',
        durationMinutes: 60,
        recommendedDays: 7,
        indications: ['Body Pain', 'Vata Imbalance', 'Skin Dryness', 'Fatigue'],
        benefits: ['Enhances lymphatic drainage', 'Improves muscle tone'],
        doctorIds: [createdDoctors[0]._id, createdDoctors[1]._id],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        status: 'published',
      },
      {
        title: 'Kadi Vasthi (Lumbar Spine Pool)',
        slug: 'kadi-vasthi-lumbar-spine-pool',
        category: 'Vasthi',
        malayalam: 'കടിവസ്തി',
        shortDescription: 'Retention of warm medicated oil over the lumbar spine for disc herniation and low back pain.',
        fullDescription: 'A herbal dough ring is placed on the lower back and filled with warm medicated oils to nourish intervertebral discs and relieve nerve compression.',
        coverImage: '/images/old_site/dept-joint.jpg',
        durationMinutes: 45,
        recommendedDays: 7,
        indications: ['Lumbar Spondylosis', 'Sciatica', 'Slip Disc', 'Lower Back Stiffness'],
        benefits: ['Strengthens lumbar vertebrae', 'Relieves sciatic nerve pain'],
        doctorIds: [createdDoctors[0]._id, createdDoctors[4]._id],
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        status: 'published',
      }
    ]);

    // ==========================================
    // 7. AUTHENTIC HEALTH CONDITIONS
    // ==========================================
    console.log('7. Seeding Authentic Health Conditions...');
    await Condition.create([
      {
        title: 'Back, Neck & Joint Problems',
        slug: 'back-neck-joint-problems',
        category: 'Spine & Joint',
        shortDescription: 'Degenerative joint and spine problems caused by diet, posture, lifestyle, and stress.',
        fullDescription: 'Neck, Back & Joint Problems are caused by degeneration resulting from modern sedentary lifestyle, poor ergonomic posture, dietary errors, and aggravated Vata dosha.',
        ayurvedicRootCause: 'Vata Aggravation and Asthi-Majja Dhatu Kshaya.',
        symptoms: ['Lower back stiffness', 'Radiating neck pain', 'Joint swelling & crepitus', 'Restricted mobility'],
        recommendedTreatmentIds: [createdTreatments[5]._id, createdTreatments[6]._id],
        specialistDoctorIds: [createdDoctors[0]._id, createdDoctors[4]._id],
        coverImage: '/images/old_site/dept-joint.jpg',
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        status: 'published',
      },
      {
        title: 'Stroke & Post-Stroke Rehabilitation',
        slug: 'stroke-post-stroke-rehabilitation',
        category: 'Neurological',
        shortDescription: 'Comprehensive Ayurvedic rehabilitation for hemiplegia and motor paralysis after stroke.',
        fullDescription: 'Stroke patients in India are typically left under home care post-acute hospitalization. Susrutha provides specialized inpatient panchakarma and motor rehabilitation.',
        ayurvedicRootCause: 'Pakshaghata due to acute Vata obstruction in cerebral Srotas.',
        symptoms: ['One-sided limb weakness', 'Loss of speech clarity', 'Facial asymmetry', 'Muscle atrophy'],
        recommendedTreatmentIds: [createdTreatments[2]._id, createdTreatments[5]._id],
        specialistDoctorIds: [createdDoctors[0]._id, createdDoctors[3]._id],
        coverImage: '/images/old_site/dept-stroke.jpg',
        assignedBranchIds: [kattakadaBranch._id],
        isFeatured: true,
        status: 'published',
      },
      {
        title: 'Rheumatoid Arthritis (Amavata)',
        slug: 'rheumatoid-arthritis-amavata',
        category: 'Rheumatology',
        shortDescription: 'Autoimmune joint disease characterized by systemic inflammation and morning stiffness.',
        fullDescription: 'Amavata occurs when impaired digestive fire (Agni) creates Ama (toxic residue) which circulates and lodges in joint synovial membranes.',
        ayurvedicRootCause: 'Ama accumulation circulating with aggravated Vata.',
        symptoms: ['Morning joint stiffness > 1 hour', 'Symmetrical joint swelling', 'Fatigue and low-grade fever'],
        recommendedTreatmentIds: [createdTreatments[1]._id, createdTreatments[5]._id],
        specialistDoctorIds: [createdDoctors[4]._id],
        coverImage: '/images/old_site/dept-rheumatology.jpg',
        assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
        isFeatured: true,
        status: 'published',
      },
      {
        title: 'Piles & Anal Fistula (Anorectal Care)',
        slug: 'piles-anal-fistula-anorectal-care',
        category: 'Proctology',
        shortDescription: 'Non-surgical Kshara Sutra therapy for permanent cure of hemorrhoids and fistula.',
        fullDescription: 'Anorectal conditions like Piles and Fistula are treated with high efficacy using Kshara Sutra ligation and internal Kashayams without surgical cutting.',
        ayurvedicRootCause: 'Mandagni causing chronic constipation and Apana Vayu disturbance.',
        symptoms: ['Bleeding during defecation', 'Painful anal swelling', 'Pus discharge from fistula tract'],
        recommendedTreatmentIds: [createdTreatments[4]._id],
        specialistDoctorIds: [createdDoctors[5]._id],
        coverImage: '/images/old_site/dept-proctology.jpg',
        assignedBranchIds: [kattakadaBranch._id],
        isFeatured: true,
        status: 'published',
      }
    ]);

    // ==========================================
    // 8. HOSPITAL INFRASTRUCTURE & FACILITIES
    // ==========================================
    console.log('8. Seeding Authentic Hospital Infrastructure & Facilities...');
    await Infrastructure.create([
      {
        title: '30-Bed Inpatient Rooms & Deluxe Suites',
        category: 'ROOMS',
        branchId: kattakadaBranch._id,
        description: 'Clean, well-ventilated inpatient rooms equipped with attached washrooms, 24x7 nursing call system, and attendant accommodation.',
        capacity: 30,
        image: '/images/old_site/kattakada-hospital.jpg',
        coverImage: '/images/old_site/kattakada-hospital.jpg',
        status: 'ACTIVE',
      },
      {
        title: 'Panchakarma Treatment Rooms & Teak Droni',
        category: 'PANCHAKARMA_SUITES',
        branchId: kattakadaBranch._id,
        description: 'Authentic Kerala panchakarma therapy rooms equipped with traditional carved teak wood Droni tables, oil heating stations, and steam cabinets.',
        capacity: 12,
        image: '/images/old_site/dept-panchakarma.jpg',
        coverImage: '/images/old_site/dept-panchakarma.jpg',
        status: 'ACTIVE',
      },
      {
        title: 'Kshara Sutra Operation Theater',
        category: 'OPERATING_THEATRE',
        branchId: kattakadaBranch._id,
        description: 'Sterile parasurgical operating theatre dedicated to Kshara Sutra anorectal procedures and minor surgical interventions.',
        capacity: 4,
        image: '/images/old_site/dept-proctology.jpg',
        coverImage: '/images/old_site/dept-proctology.jpg',
        status: 'ACTIVE',
      },
      {
        title: 'Physiotherapy & Neuro Rehab Unit',
        category: 'PHYSIOTHERAPY',
        branchId: kattakadaBranch._id,
        description: 'Complementary physiotherapy and neuro-rehabilitation unit supporting post-stroke and spinal injury recovery.',
        capacity: 8,
        image: '/images/old_site/dept-stroke.jpg',
        coverImage: '/images/old_site/dept-stroke.jpg',
        status: 'ACTIVE',
      },
      {
        title: 'Yoga & Meditation Hall',
        category: 'YOGA_HALL',
        branchId: kattakadaBranch._id,
        description: 'Peaceful indoor yoga hall for guided daily morning Pranayama, posture exercises, and mental relaxation.',
        capacity: 25,
        image: '/images/old_site/ayurveda-health1.jpg',
        coverImage: '/images/old_site/ayurveda-health1.jpg',
        status: 'ACTIVE',
      },
      {
        title: 'Kowdiar Executive Daycare Therapy Suite',
        category: 'PANCHAKARMA_SUITES',
        branchId: kowdiarBranch._id,
        description: 'Executive daycare Panchakarma and Shirodhara suites at Kowdiar satellite OPD outlet.',
        capacity: 6,
        image: '/images/old_site/kowdiar-branch.jpg',
        coverImage: '/images/old_site/kowdiar-branch.jpg',
        status: 'ACTIVE',
      }
    ]);

    // ==========================================
    // 9. AFFILIATIONS
    // ==========================================
    console.log('9. Seeding Official Affiliations...');
    await Affiliation.create([
      {
        title: 'Asotra Healthcare Inc (Connecting Mind, Body & Soul)',
        category: 'research_partner',
        type: 'International Healthcare Collaboration',
        logoUrl: '/images/old_site/affiliation-asotra.jpg',
        issuingBody: 'Dr. Satish Asotra (Ayurvedic Practitioner & Physiologist)',
        validityYear: '2026',
        description: 'Collaboration with Dr. Satish Asotra (over 30 years experience in Western Medicine & Healthcare) connecting ancient Ayurvedic wisdom with modern physiological sciences.',
        status: 'published',
      }
    ]);

    // ==========================================
    // 10. AUTHENTIC PHOTO GALLERY ALBUM
    // ==========================================
    console.log('10. Seeding Authentic Kowdiar Inauguration Photo Gallery Album...');
    const kowdiarPhotos = [];
    for (let i = 1; i <= 36; i++) {
      const num = String(i).padStart(2, '0');
      kowdiarPhotos.push({
        title: `Kowdiar Center Inauguration Photo #${i}`,
        imageUrl: `/images/old_site/kowdiar/${num}-large.jpg`,
        thumbnailUrl: `/images/old_site/kowdiar/${num}-small.jpg`,
        caption: `Highlights from the inaugural ceremony of Susrutha Panchakarma Hospital Kowdiar OP Outlet (#${i}).`,
      });
    }

    await GalleryAlbum.create({
      title: 'Kowdiar Center Inauguration',
      slug: 'kowdiar-center-inauguration',
      description: 'Official inauguration ceremony of Susrutha Panchakarma Hospital OP Outlet at Pipelane Road, Kowdiar, Trivandrum.',
      coverImage: '/images/old_site/kowdiar/06-large.jpg',
      photos: kowdiarPhotos,
      branchId: kowdiarBranch._id,
      eventDate: new Date('2022-06-01'),
      status: 'published',
    });

    // ==========================================
    // 11. AUTHENTIC VIDEOS
    // ==========================================
    console.log('11. Seeding Authentic Video Gallery...');
    await Video.create([
      {
        title: 'Susrutha Panchakarma Hospital Introduction & Clinical Overview',
        slug: 'susrutha-panchakarma-hospital-introduction',
        youtubeId: 'RB_zH0kH9xs',
        youtubeUrl: 'https://www.youtube.com/embed/RB_zH0kH9xs',
        videoUrl: 'https://www.youtube.com/watch?v=RB_zH0kH9xs',
        thumbnailUrl: '/images/old_site/kowdiar/video-poster.jpg',
        description: 'Comprehensive overview of Susrutha Panchakarma Hospital facilities, expert physician care, and classical Kerala bio-purification treatments.',
        duration: '03:45',
        category: 'HOSPITAL_OVERVIEW',
        isFeatured: true,
        status: 'published',
      }
    ]);

    // ==========================================
    // 12. AUTHENTIC PATIENT TESTIMONIALS
    // ==========================================
    console.log('12. Seeding Authentic Patient Testimonials...');
    await Testimonial.create([
      {
        patientName: 'Arun',
        patientLocation: 'Kollam, Kerala',
        rating: 5,
        reviewText: "I'd been avoiding treatment for chronic Neck Pain for years due to bad past experiences. I made an emergency appointment at Susrutha Panchakarma Hospital and the relief was remarkable.",
        treatmentReceived: 'Neck Pain Care Package & Griva Vasthi',
        branchId: kattakadaBranch._id,
        isFeatured: true,
        status: 'ACTIVE',
      },
      {
        patientName: 'Arun Kumar',
        patientLocation: 'Kochi, Kerala',
        rating: 5,
        reviewText: 'I am so grateful for the opportunity to come to Susrutha Panchakarma Hospital. The prices are more than fair and my skin condition is already doing much better after Takradhara. Everyone is helpful.',
        treatmentReceived: 'Psoriasis & Skin Care Package (Takradhara)',
        branchId: kattakadaBranch._id,
        isFeatured: true,
        status: 'ACTIVE',
      }
    ]);

    // ==========================================
    // 13. GLOBAL SITE SETTINGS & HERITAGE
    // ==========================================
    console.log('13. Seeding Global Site Settings & Heritage Data...');
    await Setting.create([
      {
        key: 'GENERAL_SETTINGS',
        value: {
          hospitalName: 'Susrutha Institute of Ayurvedic Sciences (Research) and Panchakarma Hospital',
          tagline: 'The Way To Healthy Life Is Through Ayurveda',
          foundedYear: 1970,
          founders: ['Sri P. Krishna Pillai (Late)', 'Sri P.K. Pillai (Late)', 'Prof. Dr. Krishnankutty Nair (Late)'],
          managingDirectors: ['Dr. Krishnakumar K.', 'Dr. Sreeja Krishna S.'],
          emergencyHotline: '+91 9656656736',
          mainPhone: '0471-2291027',
          mainEmail: 'info@susruthaayurveda.com',
          kattakadaAddress: 'Opposite Christian College, Kattakada, Thiruvananthapuram, Kerala - 695572',
          kowdiarAddress: 'Ground Floor, Urbon Heights, Opposite Income Tax Office, Pipelane Road, Kowdiar, Thiruvananthapuram - 695003',
        },
        description: 'Hospital name, lineage history, key leadership, hotline and contact details',
        isSystem: true,
      },
      {
        key: 'ANNOUNCEMENT_BAR',
        value: {
          text: 'Authentic Kerala Panchakarma Admissions & OPD Consultations Open at Kattakada & Kowdiar',
          link: '/packages',
          isEnabled: true,
        },
        description: 'Top header announcement banner text and link',
        isSystem: true,
      },
    ]);

    console.log('=====================================================');
    console.log('AUTHENTIC PRODUCTION SEEDING COMPLETED SUCCESSFULLY!');
    console.log('• 2 Authentic Hospital Branches (Kattakada & Kowdiar)');
    console.log('• 9 Authentic Susrutha Vaidyas with Timetables');
    console.log('• 9 Authentic Clinical Departments');
    console.log('• 12 Authentic Care Packages');
    console.log('• 7 Authentic Classical Panchakarma & Dhara Treatments');
    console.log('• 4 Authentic Health Conditions');
    console.log('• 6 Authentic Hospital Infrastructure Wings');
    console.log('• 1 Official International Affiliation (Asotra Healthcare)');
    console.log('• Complete Global Heritage Settings & Emergency Hotlines');
    console.log('=====================================================');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding production database:', error);
    process.exit(1);
  }
}

seedProductionDatabase();
