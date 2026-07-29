"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_model_1 = require("../models/User.model");
const Role_model_1 = require("../models/Role.model");
const Branch_model_1 = require("../models/Branch.model");
const Doctor_model_1 = require("../models/Doctor.model");
const Department_model_1 = require("../models/Department.model");
const Appointment_model_1 = require("../models/Appointment.model");
const CarePackage_model_1 = require("../models/CarePackage.model");
const Infrastructure_model_1 = require("../models/Infrastructure.model");
const Blog_model_1 = require("../models/Blog.model");
const Lead_model_1 = require("../models/Lead.model");
const Setting_model_1 = require("../models/Setting.model");
const Condition_model_1 = __importDefault(require("../models/Condition.model"));
const Treatment_model_1 = __importDefault(require("../models/Treatment.model"));
const Ecosystem_model_1 = __importDefault(require("../models/Ecosystem.model"));
const NewsEvent_model_1 = __importDefault(require("../models/NewsEvent.model"));
const Video_model_1 = __importDefault(require("../models/Video.model"));
const GalleryAlbum_model_1 = __importDefault(require("../models/GalleryAlbum.model"));
const Affiliation_model_1 = __importDefault(require("../models/Affiliation.model"));
const MediaFile_model_1 = __importDefault(require("../models/MediaFile.model"));
const AuditLog_model_1 = __importDefault(require("../models/AuditLog.model"));
const FAQ_model_1 = require("../models/FAQ.model");
const Testimonial_model_1 = require("../models/Testimonial.model");
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/susrutha_db';
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
    ],
    hospital: [
        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    ],
    therapy: [
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512290900673-70024fe74923?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
    ],
    nature: [
        'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    ]
};
const getImg = (arr, index) => arr[index % arr.length];
async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB database...');
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB successfully.');
        console.log('Purging all existing collections...');
        await User_model_1.User.deleteMany({});
        await Role_model_1.Role.deleteMany({});
        await Branch_model_1.Branch.deleteMany({});
        await Doctor_model_1.Doctor.deleteMany({});
        await Department_model_1.Department.deleteMany({});
        await Appointment_model_1.Appointment.deleteMany({});
        await CarePackage_model_1.CarePackage.deleteMany({});
        await Infrastructure_model_1.Infrastructure.deleteMany({});
        await Blog_model_1.Blog.deleteMany({});
        await Lead_model_1.Lead.deleteMany({});
        await Setting_model_1.Setting.deleteMany({});
        await Condition_model_1.default.deleteMany({});
        await Treatment_model_1.default.deleteMany({});
        await Ecosystem_model_1.default.deleteMany({});
        await NewsEvent_model_1.default.deleteMany({});
        await Video_model_1.default.deleteMany({});
        await GalleryAlbum_model_1.default.deleteMany({});
        await Affiliation_model_1.default.deleteMany({});
        await MediaFile_model_1.default.deleteMany({});
        await AuditLog_model_1.default.deleteMany({});
        await FAQ_model_1.FAQ.deleteMany({});
        await Testimonial_model_1.Testimonial.deleteMany({});
        console.log('1. Seeding 32 Hospital Branches & Clinics...');
        const cities = [
            'Thiruvananthapuram', 'Kattakada', 'Kowdiar', 'Kollam', 'Alappuzha',
            'Kottayam', 'Kochi', 'Thrissur', 'Palakkad', 'Kozhikode',
            'Wayanad', 'Kannur', 'Kasarkod', 'Pathanamthitta', 'Idukki',
            'Varkala', 'Neyyattinkara', 'Kazhakkoottam', 'Attingal', 'Nedumangad',
            'Changanassery', 'Muvattupuzha', 'Perumbavoor', 'Angamaly', 'Guruvayur',
            'Tirur', 'Manjeri', 'Thalassery', 'Vadakara', 'Kanhangad', 'Punalur', 'Cherthala'
        ];
        const createdBranches = [];
        for (let i = 0; i < 32; i++) {
            const city = cities[i];
            const code = city.substring(0, 3).toUpperCase() + (i > 0 ? (i + 1) : '');
            const isInpatient = i % 3 === 0;
            const branch = await Branch_model_1.Branch.create({
                name: `Susrutha Ayurveda ${city} ${isInpatient ? 'Inpatient Hospital' : 'Specialty Clinic'}`,
                code: i === 0 ? 'KTK' : i === 1 ? 'KWR' : code,
                type: isInpatient ? 'INPATIENT_HOSPITAL' : 'CITY_CLINIC',
                tagline: isInpatient ? `${40 + i * 2}-Bed Inpatient Panchakarma Hospital Campus` : `Executive OPD & Daycare Panchakarma Specialty Center`,
                address: {
                    street: `${city} Main Hospital Road, Sector ${i + 1}`,
                    city: city,
                    state: 'Kerala',
                    pincode: `${695000 + i * 17}`,
                    coordinates: { lat: 8.5 + i * 0.05, lng: 76.9 + i * 0.05 },
                },
                contact: {
                    phone: [`+91 96566 ${56736 + i}`, `+91 471 ${2290256 + i}`],
                    email: `${city.toLowerCase()}@susruthaayurveda.com`,
                    emergencyPhone: `+91 96566 ${56736 + i}`,
                },
                opdTimings: '09:00 AM - 07:00 PM (Mon - Sun)',
                bedCapacity: isInpatient ? 40 + i * 2 : 0,
                features: [
                    'Ayurvedic OPD Consultations',
                    'Panchakarma Detox Suites',
                    'GMP Herbal Pharmacy',
                    '24x7 Resident Doctor Care'
                ],
                coverImage: getImg(IMAGES.hospital, i),
                isMainBranch: i === 0,
                status: 'ACTIVE',
            });
            createdBranches.push(branch);
        }
        console.log('2. Seeding 32 Clinical Specialty Departments...');
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
            'Sleep Medicine & Insomnia Care', 'Ayurvedic Botanical Science'
        ];
        const createdDepts = [];
        for (let i = 0; i < 32; i++) {
            const title = deptTitles[i];
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const code = `D${i + 101}`;
            const dept = await Department_model_1.Department.create({
                title,
                slug,
                code,
                tagline: `Specialized Ayurvedic Care for ${title}`,
                overview: `Comprehensive Kerala Ayurvedic protocols and therapies for ${title} under senior physicians.`,
                image: getImg(IMAGES.nature, i),
                status: 'ACTIVE',
            });
            createdDepts.push(dept);
        }
        console.log('3. Seeding 35 Expert Doctors...');
        const firstNames = ['Krishnakumar', 'Sreeja', 'Anoop', 'Lakshmi', 'Ramesh', 'Divya', 'Hari', 'Gayathri', 'Madhavan', 'Preetha', 'Anand', 'Saritha', 'Vishnu', 'Revathy', 'Jayakrishnan', 'Anupama', 'Gopakumar', 'Deepa', 'Santhosh', 'Sunitha', 'Rajeev', 'Vineetha', 'Arjun', 'Ambili', 'Gokul', 'Reshma', 'Sidharth', 'Parvathy', 'Kiran', 'Aswathy', 'Unnikrishnan', 'Devika', 'Manikandan', 'Bhavana', 'Subhash'];
        const lastNames = ['K.', 'Krishna', 'Varma', 'Nair', 'Nambiar', 'Chandran', 'Pillai', 'Devi', 'Kutty', 'Suresh', 'Padmanabhan', 'Namboothiri', 'Mohan', 'Unnithan', 'Menon', 'Rajan', 'Kumar', 'Panicker', 'Das', 'Thampi', 'Menon', 'Babu', 'Gopal', 'Kartha'];
        const createdDoctors = [];
        for (let i = 0; i < 35; i++) {
            const fname = firstNames[i % firstNames.length];
            const lname = lastNames[i % lastNames.length];
            const name = `Dr. ${fname} ${lname}`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const dept = createdDepts[i % createdDepts.length];
            const photoUrl = getImg(IMAGES.doctors, i);
            const doctor = await Doctor_model_1.Doctor.create({
                name,
                slug,
                designation: i % 4 === 0 ? 'Chief Medical Officer' : i % 3 === 0 ? 'Senior Consultant Physician' : 'Consultant Ayurvedic Doctor',
                qualifications: i % 2 === 0 ? 'BAMS, MD (Ayurveda)' : 'BAMS, MS (Ayurveda)',
                experienceYears: 6 + (i % 25),
                registrationNumber: `TCMC/AYU/${12000 + i * 117}`,
                departmentId: dept._id,
                assignedBranchIds: [createdBranches[i % createdBranches.length]._id, createdBranches[(i + 1) % createdBranches.length]._id],
                bio: `${name} is a highly accomplished Ayurvedic specialist with ${6 + (i % 25)} years of clinical expertise in ${dept.title}.`,
                consultationFee: 400 + (i % 5) * 100,
                specialties: [dept.title, 'Panchakarma Detox', 'Chronic Disease Management'],
                languagesSpoken: ['Malayalam', 'English', i % 2 === 0 ? 'Hindi' : 'Tamil'],
                photoUrl,
                isDirector: i < 3,
                isFeatured: i < 12,
                sortOrder: i + 1,
                status: 'ACTIVE',
            });
            createdDoctors.push(doctor);
        }
        console.log('4. Seeding 35 Health Conditions...');
        const condTitles = [
            'Rheumatoid & Osteoarthritis', 'Cervical & Lumbar Spondylosis', 'Stroke & Hemiplegia Rehabilitation',
            'Psoriasis & Chronic Eczema', 'PCOS & Hormonal Infertility', 'Anal Fistula & Hemorrhoids',
            'Parkinsonism & Movement Disorders', 'Fatty Liver & Digestive IBS', 'Chronic Sinusitis & Rhinitis',
            'Insomnia & Severe Anxiety', 'Type-2 Diabetes & Neupathy', 'Hypertension & Vascular Care',
            'Sciatica & Nerve Compression', 'Gouty Arthritis & Uric Acid', 'Asthma & Chronic Bronchitis',
            'Alopecia & Severe Hair Fall', 'Post-COVID Fatigue & Weakness', 'Thyroid Dysfunction & Goitre',
            'Obesity & Metabolic Syndrome', 'Migraine & Vascular Headaches', 'Ulcerative Colitis & Gastritis',
            'Kidney Stones & Dysuria', 'Varicose Veins & Venous Ulcers', 'Bell Palsy & Facial Paralysis',
            'Fibromyalgia & Chronic Muscle Pain', 'Ankylosing Spondylitis', 'Uterine Fibroids & Menorrhagia',
            'Allergic Dermatitis & Hives', 'Calcaneal Spur & Heel Pain', 'Frozen Shoulder & Bursitis',
            'Vertigo & Meniere Disease', 'Kidney Failure (Early Stage Support)', 'Autoimmune Lupus Care',
            'Chronic Fatigue Syndrome', 'Erectile Dysfunction & Low Vitality'
        ];
        for (let i = 0; i < 35; i++) {
            const title = condTitles[i];
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            await Condition_model_1.default.create({
                title,
                slug,
                category: i % 4 === 0 ? 'Joint & Spine' : i % 3 === 0 ? 'Neurological' : i % 2 === 0 ? 'Skin & Immunity' : 'Metabolic & Chronic',
                shortDescription: `Ayurvedic non-surgical protocol and holistic recovery for ${title}.`,
                fullDescription: `Comprehensive inpatient and outpatient Kerala Ayurvedic care for ${title} utilizing classical purification and herbal medications.`,
                ayurvedicRootCause: `Dosha Imbalance (Vata-Pitta-Kapha) affecting target Dhatus`,
                symptoms: ['Pain & Discomfort', 'Functional Limitation', 'Chronic Fatigue'],
                coverImage: getImg(IMAGES.therapy, i),
                assignedBranchIds: [createdBranches[0]._id, createdBranches[1]._id],
                isFeatured: i < 15,
                status: 'published',
            });
        }
        console.log('5. Seeding 35 Classical Treatments...');
        const treatNames = [
            'Abhyangam (Warm Oil Massage)', 'Shirodhara (Oil Stream Therapy)', 'Elakizhi (Herbal Leaf Poultice)',
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
        for (let i = 0; i < 35; i++) {
            const title = treatNames[i];
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            await Treatment_model_1.default.create({
                title,
                slug,
                category: 'Panchakarma',
                shortDescription: `Classical Ayurvedic ${title} procedure.`,
                fullDescription: `Traditional ${title} performed using organic herbs and medicated oils under Vaidya supervision.`,
                durationMinutes: 45 + (i % 4) * 15,
                recommendedDays: 7 + (i % 3) * 7,
                indications: ['Dosha Imbalance', 'Chronic Pain', 'Stress & Stiffness'],
                benefits: ['Restores flexibility', 'Improves circulation', 'Deeply detoxifies tissues'],
                coverImage: getImg(IMAGES.therapy, i),
                assignedBranchIds: [createdBranches[0]._id, createdBranches[1]._id],
                isFeatured: i < 15,
                status: 'published',
            });
        }
        console.log('6. Seeding 32 Care Packages...');
        for (let i = 0; i < 32; i++) {
            const title = `Specialty Care Package ${i + 1} — ${deptTitles[i % deptTitles.length]}`;
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const price = 20000 + i * 1500;
            await CarePackage_model_1.CarePackage.create({
                title,
                slug,
                subtitle: `${7 + (i % 3) * 7}-Day Inpatient Recovery & Detox Program`,
                durationDays: 7 + (i % 3) * 7,
                assignedBranchIds: [createdBranches[0]._id],
                overview: `Complete ${7 + (i % 3) * 7}-day inpatient holistic healthcare package for ${deptTitles[i % deptTitles.length]}.`,
                inclusions: ['Physician Consultations', 'Daily Panchakarma Therapies', 'Organic Diet Meals', 'Room Stay'],
                exclusions: ['Diagnostic Scans', 'Airport Transfers'],
                targetAilments: ['Detoxification', 'Rejuvenation', 'Pain Relief'],
                price,
                discountedPrice: Math.round(price * 0.88),
                bannerImage: getImg(IMAGES.hospital, i),
                isFeatured: i < 12,
                status: 'ACTIVE',
            });
        }
        console.log('7. Seeding 32 Infrastructure & Facilities...');
        const facCats = ['ROOMS', 'PANCHAKARMA_SUITES', 'OPERATING_THEATRE', 'YOGA_HALL'];
        for (let i = 0; i < 32; i++) {
            const title = `Facility Wing ${i + 1} — ${facCats[i % facCats.length]} #${i + 101}`;
            await Infrastructure_model_1.Infrastructure.create({
                title,
                category: facCats[i % facCats.length],
                branchId: createdBranches[i % createdBranches.length]._id,
                description: `Modern hospital facility equipped with traditional Wooden Droni therapy beds and attached amenities.`,
                capacity: 10 + i * 2,
                image: getImg(IMAGES.hospital, i),
                status: 'ACTIVE',
            });
        }
        console.log('8. Seeding 32 Health Blogs & Articles...');
        for (let i = 0; i < 32; i++) {
            const title = `Ayurvedic Insights #${i + 1}: Managing ${condTitles[i % condTitles.length]} Naturally`;
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            await Blog_model_1.Blog.create({
                title,
                slug,
                category: deptTitles[i % deptTitles.length],
                author: createdDoctors[i % createdDoctors.length].name,
                readTime: `${5 + (i % 5)} min read`,
                excerpt: `Discover classical Kerala Ayurvedic dietary and lifestyle guidelines for ${condTitles[i % condTitles.length]}.`,
                content: `Comprehensive clinical perspective on treating ${condTitles[i % condTitles.length]} through authentic Panchakarma and herbal decoctions...`,
                coverImage: getImg(IMAGES.nature, i),
                branchCode: 'KTK',
                status: 'PUBLISHED',
            });
        }
        console.log('9. Seeding 32 Patient Testimonials...');
        const patientLocations = ['Trivandrum', 'Kochi', 'Kozhikode', 'Dubai, UAE', 'London, UK', 'New York, USA', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi'];
        for (let i = 0; i < 32; i++) {
            const doc = createdDoctors[i % createdDoctors.length];
            await Testimonial_model_1.Testimonial.create({
                patientName: `Patient ${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
                patientLocation: patientLocations[i % patientLocations.length],
                treatmentReceived: treatNames[i % treatNames.length],
                rating: 5,
                reviewText: `I underwent 14 days of treatment under ${doc.name} at Susrutha. My chronic pain is completely cured and mobility restored! Exceptional hospital staff and care.`,
                patientPhoto: getImg(IMAGES.doctors, i),
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                isFeatured: i < 15,
                status: 'ACTIVE',
            });
        }
        console.log('10. Seeding 32 Ecosystem Pillars...');
        const pTypes = ['herbal_garden', 'pharmacy_unit', 'research_center', 'academy'];
        for (let i = 0; i < 32; i++) {
            const title = `Ecosystem Pillar #${i + 1} — ${pTypes[i % pTypes.length].replace('_', ' ').toUpperCase()}`;
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            await Ecosystem_model_1.default.create({
                title,
                slug,
                pillarType: pTypes[i % pTypes.length],
                tagline: `World-Class Institution for ${pTypes[i % pTypes.length].replace('_', ' ')}`,
                description: `Dedicated division focusing on research, organic cultivation, manufacturing, and clinical excellence.`,
                coverImage: getImg(IMAGES.nature, i),
                status: 'published',
            });
        }
        console.log('11. Seeding 32 Videos & Stories...');
        const vCats = ['patient_story', 'doctor_talk', 'facility_tour', 'treatment_demo'];
        for (let i = 0; i < 32; i++) {
            const title = `Video Feature #${i + 1}: ${vCats[i % vCats.length].replace('_', ' ').toUpperCase()} — ${deptTitles[i % deptTitles.length]}`;
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            await Video_model_1.default.create({
                title,
                slug,
                category: vCats[i % vCats.length],
                youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                videoHost: 'youtube',
                description: `Watch this detailed video presentation covering ${deptTitles[i % deptTitles.length]}.`,
                isFeatured: i < 12,
                sortOrder: i + 1,
                status: 'published',
            });
        }
        console.log('12. Seeding 32 Gallery Albums...');
        const gCats = ['infrastructure', 'ayur_village', 'kowdiar_op', 'herbal_garden', 'events', 'treatments'];
        for (let i = 0; i < 32; i++) {
            const title = `Photo Album #${i + 1}: ${gCats[i % gCats.length].replace('_', ' ').toUpperCase()}`;
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            await GalleryAlbum_model_1.default.create({
                title,
                slug,
                category: gCats[i % gCats.length],
                coverImage: getImg(IMAGES.hospital, i),
                description: `High-resolution image gallery depicting ${gCats[i % gCats.length]}.`,
                mediaItems: [
                    { url: getImg(IMAGES.hospital, i), caption: 'Primary View', mediaType: 'image', sortOrder: 1 },
                    { url: getImg(IMAGES.therapy, i), caption: 'Therapy View', mediaType: 'image', sortOrder: 2 },
                ],
                isFeatured: i < 12,
                status: 'published',
            });
        }
        console.log('13. Seeding 32 Accreditations & Affiliations...');
        const aCats = ['accreditation', 'certification', 'research_partner', 'university'];
        for (let i = 0; i < 32; i++) {
            await Affiliation_model_1.default.create({
                title: `Official Accreditation / Certification #${i + 1}`,
                category: aCats[i % aCats.length],
                logoUrl: getImg(IMAGES.nature, i),
                issuingBody: `Government Healthcare Board #${i + 1}`,
                validityYear: '2026',
                description: `Official accreditation recognizing clinical standards and safety protocols.`,
                status: 'published',
            });
        }
        console.log('14. Seeding 32 Press Releases & News Events...');
        const pTypes2 = ['press_release', 'newspaper_clipping', 'tv_feature', 'event', 'award'];
        for (let i = 0; i < 32; i++) {
            const title = `Hospital Press Release #${i + 1}: New Clinical Advancement in Ayurveda`;
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            await NewsEvent_model_1.default.create({
                title,
                slug,
                type: pTypes2[i % pTypes2.length],
                publisherName: i % 2 === 0 ? 'Malayala Manorama' : 'The Hindu',
                articleUrl: 'https://thehindu.com',
                summary: `Susrutha Ayurveda announces expansion of clinical research and patient care facilities.`,
                content: `Detailed media report regarding clinical milestones...`,
                coverImage: getImg(IMAGES.hospital, i),
                isFeatured: i < 12,
                status: 'published',
            });
        }
        console.log('15. Seeding 35 FAQs...');
        for (let i = 0; i < 35; i++) {
            await FAQ_model_1.FAQ.create({
                question: `Frequently Asked Question #${i + 1} regarding ${deptTitles[i % deptTitles.length]}?`,
                answer: `Comprehensive answer detailing Ayurvedic consultation, treatment duration, diet, and insurance coverage.`,
                category: i % 2 === 0 ? 'PANCHAKARMA' : 'INSURANCE',
                sortOrder: i + 1,
                status: 'ACTIVE',
            });
        }
        console.log('16. Seeding 35 Patient Appointments...');
        for (let i = 0; i < 35; i++) {
            const doc = createdDoctors[i % createdDoctors.length];
            const branch = createdBranches[i % createdBranches.length];
            await Appointment_model_1.Appointment.create({
                appointmentNumber: `APT-2026-${100 + i}`,
                patientName: `Patient ${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
                patientPhone: `+91 94471 ${10000 + i * 111}`,
                patientEmail: `patient${i + 1}@gmail.com`,
                branchId: branch._id,
                doctorId: doc._id,
                consultationType: i % 2 === 0 ? 'OPD_INPERSON' : 'IPD_ADMISSION',
                preferredDate: new Date('2026-07-30'),
                preferredTimeSlot: '10:30 AM',
                symptomsNote: `Consultation request for chronic pain and Panchakarma treatment.`,
                status: i % 3 === 0 ? 'CONFIRMED' : 'PENDING',
            });
        }
        console.log('17. Seeding 35 Patient Leads & Inquiries...');
        for (let i = 0; i < 35; i++) {
            const branch = createdBranches[i % createdBranches.length];
            await Lead_model_1.Lead.create({
                name: `Inquirer ${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
                phone: `+91 96566 ${10000 + i * 222}`,
                email: `enquiry${i + 1}@gmail.com`,
                subject: `Enquiry regarding ${deptTitles[i % deptTitles.length]} package admission`,
                message: `I am looking for inpatient availability for my family member at ${branch.name}.`,
                branchId: branch._id,
                source: 'WEBSITE_CONTACT',
                status: i % 2 === 0 ? 'NEW' : 'CONTACTED',
            });
        }
        console.log('18. Seeding Global Site Settings...');
        await Setting_model_1.Setting.create([
            {
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
            },
            {
                key: 'ANNOUNCEMENT_BAR',
                value: {
                    text: 'Authentic Kerala Panchakarma Admissions Open — 30+ Branches Across Kerala',
                    link: '/packages',
                    isEnabled: true,
                },
                description: 'Top header announcement banner text and link',
                isSystem: true,
            },
        ]);
        console.log('19. Seeding Super Admin User & Role...');
        const superAdminRole = await Role_model_1.Role.create({
            name: 'SUPER_ADMIN',
            displayName: 'Super Administrator',
            description: 'Unrestricted full access across all hospital branches, CMS content, and system settings.',
            permissions: ['*'],
            isSystem: true,
        });
        const passwordHash = await bcryptjs_1.default.hash('SusruthaAdmin2026!', 10);
        await User_model_1.User.create({
            name: 'Susrutha Super Admin',
            email: 'admin@susruthaayurveda.com',
            phone: '+91 96566 56736',
            passwordHash,
            roleId: superAdminRole._id,
            branchScope: 'GLOBAL',
            assignedBranchIds: [createdBranches[0]._id, createdBranches[1]._id],
            status: 'ACTIVE',
        });
        console.log('=====================================================');
        console.log('DATABASE SEEDING COMPLETE WITH 30+ ITEMS FOR EVERY SINGLE MODEL!');
        console.log('• 35 Doctors with Photos, Reg Numbers, Fees, & Specialties');
        console.log('• 32 Hospital Branches & Specialty Clinics');
        console.log('• 32 Clinical Specialty Departments');
        console.log('• 35 Health Conditions with Images & Symptoms');
        console.log('• 35 Classical Treatments with Images & Indications');
        console.log('• 32 Care Packages with Banner Images & Pricing');
        console.log('• 32 Infrastructure & Facilities with Images');
        console.log('• 32 Health Blogs & Articles with Cover Images');
        console.log('• 32 Patient Testimonials with Avatars & Reviews');
        console.log('• 32 Ecosystem Pillars with Cover Images');
        console.log('• 32 Video Features & Patient Stories');
        console.log('• 32 Gallery Albums with Photos');
        console.log('• 32 Accreditations & Affiliations with Logos');
        console.log('• 32 Press Releases & News Events with Cover Images');
        console.log('• 35 FAQs, 35 Appointments, & 35 Leads');
        console.log('=====================================================');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
