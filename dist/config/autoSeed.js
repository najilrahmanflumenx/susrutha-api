"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoSeedSystemData = autoSeedSystemData;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_model_1 = require("../models/User.model");
const Role_model_1 = require("../models/Role.model");
const Branch_model_1 = require("../models/Branch.model");
const Doctor_model_1 = require("../models/Doctor.model");
const Department_model_1 = require("../models/Department.model");
const CarePackage_model_1 = require("../models/CarePackage.model");
const Setting_model_1 = require("../models/Setting.model");
const Condition_model_1 = __importDefault(require("../models/Condition.model"));
const Treatment_model_1 = __importDefault(require("../models/Treatment.model"));
const FAQ_model_1 = require("../models/FAQ.model");
const Testimonial_model_1 = require("../models/Testimonial.model");
const logger_1 = require("../utils/logger");
async function autoSeedSystemData() {
    try {
        // 1. Ensure Super Admin Role exists
        let superAdminRole = await Role_model_1.Role.findOne({ name: 'SUPER_ADMIN', isDeleted: false });
        if (!superAdminRole) {
            superAdminRole = await Role_model_1.Role.create({
                name: 'SUPER_ADMIN',
                displayName: 'Super Administrator',
                description: 'Unrestricted full access across all hospital branches, CMS content, and system settings.',
                permissions: ['*'],
                isSystem: true,
            });
            logger_1.logger.info('Created default SUPER_ADMIN system role.');
        }
        // 2. Ensure Main Hospital Branches exist
        let kattakadaBranch = await Branch_model_1.Branch.findOne({ code: 'KTK', isDeleted: false });
        if (!kattakadaBranch) {
            kattakadaBranch = await Branch_model_1.Branch.create({
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
            logger_1.logger.info('Created default Kattakada hospital branch.');
        }
        let kowdiarBranch = await Branch_model_1.Branch.findOne({ code: 'KWR', isDeleted: false });
        if (!kowdiarBranch) {
            kowdiarBranch = await Branch_model_1.Branch.create({
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
            logger_1.logger.info('Created default Kowdiar city clinic branch.');
        }
        // 3. Ensure Super Admin User exists
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@susruthaayurveda.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'SusruthaAdmin2026!';
        let adminUser = await User_model_1.User.findOne({ email: adminEmail, isDeleted: false });
        if (!adminUser) {
            const passwordHash = await bcryptjs_1.default.hash(adminPassword, 10);
            await User_model_1.User.create({
                name: 'Susrutha Super Admin',
                email: adminEmail,
                phone: '+91 96566 56736',
                passwordHash,
                roleId: superAdminRole._id,
                assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
                status: 'ACTIVE',
            });
            logger_1.logger.info(`Seeded Super Admin User (${adminEmail}) successfully.`);
        }
        // 4. Ensure Clinical Departments exist
        let panchakarmaDept = await Department_model_1.Department.findOne({ code: 'PKM' });
        if (!panchakarmaDept) {
            panchakarmaDept = await Department_model_1.Department.create({
                title: 'Panchakarma & Bio-Purification',
                slug: 'panchakarma-bio-purification',
                code: 'PKM',
                tagline: 'Authentic 5-Fold Classical Purification & Detoxification Therapy',
                overview: 'Classical Panchakarma treatments (Vamana, Virechana, Nasyam, Vasthi, Raktamokshana) under senior Kerala Vaidyas.',
                status: 'ACTIVE',
            });
        }
        let kayachikitsaDept = await Department_model_1.Department.findOne({ code: 'KCY' });
        if (!kayachikitsaDept) {
            kayachikitsaDept = await Department_model_1.Department.create({
                title: 'Kayachikitsa (General Internal Medicine)',
                slug: 'kayachikitsa-general-internal-medicine',
                code: 'KCY',
                tagline: 'Comprehensive Internal Medicine, Metabolic & Chronic Illness Care',
                overview: 'Holistic management of diabetes, hypertension, digestive ailments, fatty liver, and metabolic disorders.',
                status: 'ACTIVE',
            });
        }
        let neuroRehabDept = await Department_model_1.Department.findOne({ code: 'NEU' });
        if (!neuroRehabDept) {
            neuroRehabDept = await Department_model_1.Department.create({
                title: 'Neurological & Stroke Rehabilitation',
                slug: 'neurological-stroke-rehabilitation',
                code: 'NEU',
                tagline: 'Post-Stroke Recovery, Motor Paralysis & Movement Disorder Care',
                overview: 'Integrated Ayurvedic neuro-rehabilitation protocols combining Shirodhara, Pizhichil, and intensive physical rehabilitation.',
                status: 'ACTIVE',
            });
        }
        // 5. Ensure Doctors exist
        const doctorCount = await Doctor_model_1.Doctor.countDocuments({ isDeleted: false });
        if (doctorCount === 0) {
            await Doctor_model_1.Doctor.create([
                {
                    name: 'Dr. Krishnakumar K.',
                    slug: 'dr-krishnakumar-k',
                    designation: 'Chief Medical Officer & Senior Physician',
                    qualifications: 'BAMS, MD (Ayurveda)',
                    experienceYears: 24,
                    departmentId: panchakarmaDept._id,
                    assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
                    bio: 'Renowned Ayurvedic physician with over 24 years of clinical experience in classical Panchakarma, severe degenerative spine disorders, and chronic arthritis.',
                    consultationFee: 500,
                    specialties: ['Panchakarma Detoxification', 'Spine Disc Herniation', 'Rheumatoid Arthritis'],
                    languagesSpoken: ['Malayalam', 'English', 'Hindi'],
                    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d',
                    isDirector: true,
                    isFeatured: true,
                    status: 'ACTIVE',
                },
                {
                    name: 'Dr. Sreeja Krishna S.',
                    slug: 'dr-sreeja-krishna-s',
                    designation: 'Senior Consultant Physician',
                    qualifications: 'BAMS, MS (Ayurveda)',
                    experienceYears: 18,
                    departmentId: kayachikitsaDept._id,
                    assignedBranchIds: [kattakadaBranch._id],
                    bio: 'Expert in Gynaecology, Infertility, PCOS management, Chronic Psoriasis, and Lifestyle Metabolic Disorders.',
                    consultationFee: 400,
                    specialties: ['PCOS & Women Health', 'Psoriasis & Skin Care', 'Metabolic Disorders'],
                    languagesSpoken: ['Malayalam', 'English'],
                    photoUrl: 'https://images.unsplash.com/photo-1594824813570-78a295000527',
                    isDirector: false,
                    isFeatured: true,
                    status: 'ACTIVE',
                },
                {
                    name: 'Dr. Anoop Varma',
                    slug: 'dr-anoop-varma',
                    designation: 'Senior Neuro-Ayurvedic Specialist',
                    qualifications: 'BAMS, MD (Neuro-Ayurveda)',
                    experienceYears: 15,
                    departmentId: neuroRehabDept._id,
                    assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
                    bio: 'Specialist in post-stroke hemiplegia recovery, Parkinsonism, motor neuron disorders, and nerve compression management.',
                    consultationFee: 550,
                    specialties: ['Stroke Rehabilitation', 'Parkinsonism', 'Nerve Palsy'],
                    languagesSpoken: ['Malayalam', 'English', 'Tamil'],
                    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7',
                    isDirector: false,
                    isFeatured: true,
                    status: 'ACTIVE',
                },
            ]);
            logger_1.logger.info('Seeded default medical doctors.');
        }
        // 6. Ensure Conditions & Treatments exist
        const conditionCount = await Condition_model_1.default.countDocuments();
        if (conditionCount === 0) {
            await Condition_model_1.default.create([
                {
                    title: 'Rheumatoid & Osteoarthritis',
                    slug: 'rheumatoid-osteoarthritis',
                    category: 'Joint & Spine',
                    shortDescription: 'Ayurvedic non-surgical management of joint pain, swelling, and cartilage degeneration.',
                    fullDescription: 'Comprehensive treatment protocols including Abhyanga, Podikizhi, and Janu Vasthi for lasting joint flexibility and pain relief.',
                    ayurvedicRootCause: 'Vata-Kapha & Amavata Dosha Accumulation',
                    symptoms: ['Joint swelling and warmth', 'Morning stiffness lasting over 30 mins', 'Reduced range of motion', 'Grinding joint pain'],
                    assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
                    isFeatured: true,
                    status: 'published',
                },
                {
                    title: 'Cervical & Lumbar Spondylosis (Disc Bulge)',
                    slug: 'cervical-lumbar-spondylosis-disc-bulge',
                    category: 'Spine Care',
                    shortDescription: 'Targeted spine therapies for compressed nerve roots, sciatica, and chronic neck & back stiffness.',
                    fullDescription: 'Specialized Kadi Vasthi and Griva Vasthi procedures with medicated herbal oils to nourish spinal discs and relieve sciatica.',
                    ayurvedicRootCause: 'Vata Dosha Imbalance & Asthi-Majja Dhatu Kshaya',
                    symptoms: ['Radiating leg or arm pain', 'Numbness in fingers and toes', 'Lower back stiffness', 'Neck stiffness'],
                    assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
                    isFeatured: true,
                    status: 'published',
                },
            ]);
            logger_1.logger.info('Seeded default clinical conditions.');
        }
        const treatmentCount = await Treatment_model_1.default.countDocuments();
        if (treatmentCount === 0) {
            await Treatment_model_1.default.create([
                {
                    title: 'Abhyangam (Warm Medicated Oil Massage)',
                    slug: 'abhyangam-warm-oil-massage',
                    category: 'Panchakarma',
                    shortDescription: 'Full-body synchronized herbal oil massage to nourish tissues and improve lymphatic drainage.',
                    fullDescription: 'Classic Kerala Ayurvedic body massage using dosha-specific medicated oils applied by two trained therapists simultaneously.',
                    durationMinutes: 60,
                    recommendedDays: 7,
                    indications: ['Vata disorders', 'Muscle stiffness', 'General fatigue', 'Insomnia'],
                    benefits: ['Improves blood circulation', 'Relieves muscular tension', 'Deeply tones body tissues'],
                    assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
                    isFeatured: true,
                    status: 'published',
                },
                {
                    title: 'Shirodhara (Mind Calming Oil Stream Therapy)',
                    slug: 'shirodhara-mind-calming-therapy',
                    category: 'Panchakarma',
                    shortDescription: 'Continuous rhythm pour of warm medicated oil across forehead for nerve relaxation.',
                    fullDescription: 'Profound nervous system relaxation procedure highly recommended for anxiety, insomnia, hypertension, and stress.',
                    durationMinutes: 45,
                    recommendedDays: 7,
                    indications: ['Insomnia', 'Anxiety & Depression', 'Hypertension', 'Migraine'],
                    benefits: ['Calms the central nervous system', 'Improves sleep quality', 'Relieves chronic headaches'],
                    assignedBranchIds: [kattakadaBranch._id, kowdiarBranch._id],
                    isFeatured: true,
                    status: 'published',
                },
            ]);
            logger_1.logger.info('Seeded default classical treatments.');
        }
        // 7. Ensure Care Packages exist
        const packageCount = await CarePackage_model_1.CarePackage.countDocuments();
        if (packageCount === 0) {
            await CarePackage_model_1.CarePackage.create([
                {
                    title: 'Panchakarma Rejuvenation Package',
                    slug: 'panchakarma-rejuvenation-package',
                    subtitle: '7 to 28 Days Deep Body Purification & Tissue Rejuvenation',
                    durationDays: 14,
                    assignedBranchIds: [kattakadaBranch._id],
                    overview: 'Comprehensive 14-day inpatient detox package including daily doctor consultations, custom organic diet, full Panchakarma therapies, and stay in serene cottages.',
                    inclusions: ['Daily Physician Consultations', '2 Classical Panchakarma Procedures Daily', 'Pure Organic Meals', 'Cottage Accommodation'],
                    exclusions: ['Personal Laundry', 'External Scans'],
                    targetAilments: ['General Body Detox', 'Chronic Fatigue', 'Immunity Boost'],
                    price: 35000,
                    isFeatured: true,
                    status: 'ACTIVE',
                },
            ]);
            logger_1.logger.info('Seeded default care packages.');
        }
        // 8. Ensure Global Site Settings exist
        const generalSetting = await Setting_model_1.Setting.findOne({ key: 'GENERAL_SETTINGS' });
        if (!generalSetting) {
            await Setting_model_1.Setting.create({
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
        const announcementSetting = await Setting_model_1.Setting.findOne({ key: 'ANNOUNCEMENT_BAR' });
        if (!announcementSetting) {
            await Setting_model_1.Setting.create({
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
        const socialSetting = await Setting_model_1.Setting.findOne({ key: 'SOCIAL_LINKS' });
        if (!socialSetting) {
            await Setting_model_1.Setting.create({
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
        // 9. Ensure FAQs and Testimonials exist
        const faqCount = await FAQ_model_1.FAQ.countDocuments();
        if (faqCount === 0) {
            await FAQ_model_1.FAQ.create([
                {
                    question: 'What is the recommended stay duration for inpatient Panchakarma?',
                    answer: 'Classical Panchakarma programs typically range from 7, 14, to 21 days depending on individual health evaluation by our chief physicians.',
                    category: 'PANCHAKARMA',
                    sortOrder: 1,
                    status: 'ACTIVE',
                },
                {
                    question: 'Can I claim health insurance for Ayurvedic hospitalization?',
                    answer: 'Yes, as an NABH-accredited hospital, inpatient treatments at Susrutha are eligible for health insurance reimbursement and cashless TPA approval.',
                    category: 'INSURANCE',
                    sortOrder: 2,
                    status: 'ACTIVE',
                },
            ]);
        }
        const testimonialCount = await Testimonial_model_1.Testimonial.countDocuments();
        if (testimonialCount === 0) {
            await Testimonial_model_1.Testimonial.create([
                {
                    patientName: 'K. R. Radhakrishnan',
                    patientLocation: 'Trivandrum',
                    treatmentReceived: 'Spine Disc Care & Kadi Vasthi',
                    rating: 5,
                    reviewText: 'I was suffering from severe sciatica and could barely walk. After 14 days of Kadi Vasthi and Panchakarma at Kattakada campus, my back pain is completely gone without surgery!',
                    isFeatured: true,
                    status: 'ACTIVE',
                },
            ]);
        }
        logger_1.logger.info('Auto-seed system data check completed successfully.');
    }
    catch (error) {
        logger_1.logger.error(`Auto-seed system data error: ${error.message}`);
    }
}
