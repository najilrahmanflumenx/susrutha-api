"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicController = void 0;
const Branch_model_1 = require("../../models/Branch.model");
const Doctor_model_1 = require("../../models/Doctor.model");
const Department_model_1 = require("../../models/Department.model");
const CarePackage_model_1 = require("../../models/CarePackage.model");
const Blog_model_1 = require("../../models/Blog.model");
const Testimonial_model_1 = require("../../models/Testimonial.model");
const FAQ_model_1 = require("../../models/FAQ.model");
const Appointment_model_1 = require("../../models/Appointment.model");
const Lead_model_1 = require("../../models/Lead.model");
const Infrastructure_model_1 = require("../../models/Infrastructure.model");
const Setting_model_1 = require("../../models/Setting.model");
const Condition_model_1 = __importDefault(require("../../models/Condition.model"));
const Treatment_model_1 = __importDefault(require("../../models/Treatment.model"));
const Ecosystem_model_1 = __importDefault(require("../../models/Ecosystem.model"));
const Video_model_1 = __importDefault(require("../../models/Video.model"));
const Affiliation_model_1 = __importDefault(require("../../models/Affiliation.model"));
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const FALLBACK_BRANCHES = [
    {
        _id: 'ktk-main-branch',
        name: 'Kattakada Inpatient Hospital & Research Center',
        code: 'KTK',
        type: 'INPATIENT_HOSPITAL',
        tagline: '40-Bed Inpatient Panchakarma Hospital Campus & Research Institute',
        address: { street: 'Kattakada-Killi Main Road', city: 'Thiruvananthapuram', state: 'Kerala', pincode: '695572', coordinates: { lat: 8.5085, lng: 77.0805 } },
        contact: { phone: ['+91 96566 56736', '+91 471 229 0256'], email: 'kattakada@susruthaayurveda.com', emergencyPhone: '+91 96566 56736' },
        opdTimings: '09:00 AM - 07:00 PM (Mon - Sun)',
        bedCapacity: 40,
        features: ['40 Inpatient Beds', 'Private Panchakarma Cottages', 'Herbal Species Botanical Garden', 'Organic Pure Vegetarian Kitchen'],
        isMainBranch: true,
        status: 'ACTIVE',
    },
    {
        _id: 'kwr-city-branch',
        name: 'Kowdiar City Outpatient Clinic',
        code: 'KWR',
        type: 'CITY_CLINIC',
        tagline: 'Premium City Outpatient Consultation & Specialty Care Center',
        address: { street: 'Kowdiar Palace Road', city: 'Thiruvananthapuram', state: 'Kerala', pincode: '695003', coordinates: { lat: 8.5241, lng: 76.9637 } },
        contact: { phone: ['+91 96566 56736'], email: 'kowdiar@susruthaayurveda.com', emergencyPhone: '+91 96566 56736' },
        opdTimings: '09:00 AM - 07:00 PM (Mon - Sat)',
        bedCapacity: 0,
        features: ['Executive OPD Consultation', 'Daycare Panchakarma & Kizhi Therapy', 'In-house GMP Medicine Pharmacy'],
        isMainBranch: false,
        status: 'ACTIVE',
    },
];
const FALLBACK_DOCTORS = [
    {
        _id: 'doc-krishnakumar',
        name: 'Dr. Krishnakumar K.',
        slug: 'dr-krishnakumar-k',
        designation: 'Chief Medical Officer & Senior Physician',
        qualifications: 'BAMS, MD (Ayurveda)',
        experienceYears: 24,
        photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
        bio: 'Renowned Ayurvedic physician with over 24 years of clinical experience in classical Panchakarma, severe degenerative spine disorders, and chronic arthritis.',
        consultationFee: 500,
        specialties: ['Panchakarma Detoxification', 'Spine Disc Herniation', 'Rheumatoid Arthritis'],
        languagesSpoken: ['Malayalam', 'English', 'Hindi'],
        isDirector: true,
        isFeatured: true,
        status: 'ACTIVE',
    },
    {
        _id: 'doc-sreeja',
        name: 'Dr. Sreeja Krishna S.',
        slug: 'dr-sreeja-krishna-s',
        designation: 'Senior Consultant Physician',
        qualifications: 'BAMS, MS (Ayurveda)',
        experienceYears: 18,
        photoUrl: 'https://images.unsplash.com/photo-1594824813570-78a295000527?w=600&auto=format&fit=crop&q=80',
        photo: 'https://images.unsplash.com/photo-1594824813570-78a295000527?w=600&auto=format&fit=crop&q=80',
        bio: 'Expert in Gynaecology, Infertility, PCOS management, Chronic Psoriasis, and Lifestyle Metabolic Disorders.',
        consultationFee: 400,
        specialties: ['PCOS & Women Health', 'Psoriasis & Skin Care', 'Metabolic Disorders'],
        languagesSpoken: ['Malayalam', 'English'],
        isDirector: false,
        isFeatured: true,
        status: 'ACTIVE',
    },
];
const FALLBACK_TREATMENTS = [
    {
        _id: 'tr-abhyangam',
        title: 'Abhyangam (Warm Medicated Oil Massage)',
        slug: 'abhyangam-warm-oil-massage',
        category: 'Panchakarma',
        shortDescription: 'Full-body synchronized herbal oil massage to nourish tissues and improve lymphatic drainage.',
        fullDescription: 'Classic Kerala Ayurvedic body massage using dosha-specific medicated oils applied by two trained therapists simultaneously.',
        durationMinutes: 60,
        recommendedDays: 7,
        indications: ['Vata disorders', 'Muscle stiffness', 'General fatigue', 'Insomnia'],
        benefits: ['Improves blood circulation', 'Relieves muscular tension', 'Deeply tones body tissues'],
        isFeatured: true,
        status: 'published',
    },
];
const FALLBACK_CONDITIONS = [
    {
        _id: 'cond-osteoarthritis',
        title: 'Rheumatoid & Osteoarthritis',
        slug: 'rheumatoid-osteoarthritis',
        category: 'Joint & Spine',
        shortDescription: 'Ayurvedic non-surgical management of joint pain, swelling, and cartilage degeneration.',
        fullDescription: 'Comprehensive treatment protocols including Abhyanga, Podikizhi, and Janu Vasthi for lasting joint flexibility and pain relief.',
        ayurvedicRootCause: 'Vata-Kapha & Amavata Dosha Accumulation',
        symptoms: ['Joint swelling and warmth', 'Morning stiffness lasting over 30 mins', 'Reduced range of motion'],
        isFeatured: true,
        status: 'published',
    },
];
class PublicController {
    // GET /api/v1/public/home - Aggregated public homepage data with limits
    static async getHome(req, res) {
        try {
            const [branches, doctors, departments, packages, testimonials, faqs, conditions, treatments, settingsList] = await Promise.all([
                Branch_model_1.Branch.find({ status: 'ACTIVE', isDeleted: false }).select('name code type tagline address contact opdTimings bedCapacity features isMainBranch coverImage').limit(10),
                Doctor_model_1.Doctor.find({ status: 'ACTIVE', isDeleted: false }).populate('departmentId', 'title slug').select('name slug designation qualifications experienceYears photo photoUrl bio specialties languagesSpoken availability isDirector isFeatured').limit(15),
                Department_model_1.Department.find({ status: 'ACTIVE', isDeleted: false }).select('title slug code tagline overview icon image photo isFeatured').limit(12),
                CarePackage_model_1.CarePackage.find({ status: 'ACTIVE', isDeleted: false }).select('title slug subtitle durationDays overview inclusions targetAilments price isFeatured bannerImage').limit(10),
                Testimonial_model_1.Testimonial.find({ status: 'ACTIVE', isFeatured: true, isDeleted: false }).select('patientName patientLocation treatmentReceived rating reviewText patientPhoto videoUrl').limit(10),
                FAQ_model_1.FAQ.find({ status: 'ACTIVE', isDeleted: false }).select('question answer category').limit(10),
                Condition_model_1.default.find({ status: 'published', isDeleted: false }).select('title slug category shortDescription coverImage isFeatured').limit(12),
                Treatment_model_1.default.find({ status: 'published', isDeleted: false }).select('title slug category shortDescription durationMinutes coverImage isFeatured').limit(12),
                Setting_model_1.Setting.find({}),
            ]);
            const settingsMap = {};
            settingsList.forEach((s) => {
                settingsMap[s.key] = s.value;
            });
            const mappedDoctors = doctors.map((doc) => {
                const obj = doc.toObject();
                if (!obj.photo && obj.photoUrl)
                    obj.photo = obj.photoUrl;
                if (!obj.photoUrl && obj.photo)
                    obj.photoUrl = obj.photo;
                return obj;
            });
            return res.status(200).json(ApiResponse_1.ApiResponse.success({
                hospitalName: settingsMap['GENERAL']?.hospitalName || 'SUSRUTHA Ayurvedhik Hospital',
                tagline: settingsMap['GENERAL']?.tagline || 'Research-backed 40-bed authentic Kerala Ayurveda hospital campus',
                settings: settingsMap,
                branches: branches.length ? branches : FALLBACK_BRANCHES,
                doctors: mappedDoctors.length ? mappedDoctors : FALLBACK_DOCTORS,
                departments,
                packages,
                testimonials,
                faqs,
                conditions: conditions.length ? conditions : FALLBACK_CONDITIONS,
                treatments: treatments.length ? treatments : FALLBACK_TREATMENTS,
            }, 'Public home data fetched successfully'));
        }
        catch (err) {
            return res.status(200).json(ApiResponse_1.ApiResponse.success({
                hospitalName: 'SUSRUTHA Ayurvedhik Hospital',
                tagline: 'Research-backed 40-bed authentic Kerala Ayurveda hospital campus',
                settings: {},
                branches: FALLBACK_BRANCHES,
                doctors: FALLBACK_DOCTORS,
                departments: [],
                packages: [],
                testimonials: [],
                faqs: [],
                conditions: FALLBACK_CONDITIONS,
                treatments: FALLBACK_TREATMENTS,
            }, 'Public home fallback data served'));
        }
    }
    // GET /api/v1/public/settings
    static async getSettings(req, res) {
        try {
            const settings = await Setting_model_1.Setting.find({});
            const settingsMap = {};
            settings.forEach((s) => {
                settingsMap[s.key] = s.value;
            });
            return res.status(200).json(ApiResponse_1.ApiResponse.success(settingsMap, 'Public settings fetched successfully'));
        }
        catch (err) {
            return res.status(200).json(ApiResponse_1.ApiResponse.success({}, 'Default settings served'));
        }
    }
    // GET /api/v1/public/branches
    static async getBranches(req, res) {
        try {
            const { type, limit: reqLimit, page: reqPage } = req.query;
            const limit = reqLimit ? parseInt(reqLimit, 10) : 10;
            const page = reqPage ? parseInt(reqPage, 10) : 1;
            const skip = (page - 1) * limit;
            let query = { status: 'ACTIVE' };
            if (type && type !== 'ALL') {
                query.type = type;
            }
            const [branches, total] = await Promise.all([
                Branch_model_1.Branch.find(query).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit),
                Branch_model_1.Branch.countDocuments(query),
            ]);
            const data = branches;
            const totalCount = total || data.length;
            return res.status(200).json(ApiResponse_1.ApiResponse.success(data, 'Public branches fetched successfully', {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit) || 1,
            }));
        }
        catch (err) {
            return res.status(200).json(ApiResponse_1.ApiResponse.success([], 'Public branches fetched successfully', {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 1,
            }));
        }
    }
    // GET /api/v1/public/doctors
    static async getDoctors(req, res) {
        try {
            const { branchCode, category, search, q, limit: reqLimit, page: reqPage } = req.query;
            let query = { status: 'ACTIVE', isDeleted: false };
            if (branchCode) {
                const branch = await Branch_model_1.Branch.findOne({ code: branchCode.toUpperCase() });
                if (branch) {
                    query.assignedBranchIds = branch._id;
                }
            }
            if (category && category !== 'ALL') {
                const dept = await Department_model_1.Department.findOne({
                    $or: [{ slug: category }, { title: new RegExp(category, 'i') }],
                });
                if (dept) {
                    query.departmentId = dept._id;
                }
                else {
                    query.specialties = new RegExp(category, 'i');
                }
            }
            const searchTerm = (search || q);
            if (searchTerm && searchTerm.trim()) {
                const regex = new RegExp(searchTerm.trim(), 'i');
                query.$or = [{ name: regex }, { designation: regex }, { specialties: regex }, { qualifications: regex }];
            }
            const isAll = req.query.all === 'true' || reqLimit === '0' || reqLimit === 'all';
            const limit = isAll ? 1000 : reqLimit ? parseInt(reqLimit, 10) : 50;
            const page = reqPage ? parseInt(reqPage, 10) : 1;
            const skip = (page - 1) * limit;
            const [doctors, total] = await Promise.all([
                Doctor_model_1.Doctor.find(query)
                    .populate('departmentId', 'title slug')
                    .populate('assignedBranchIds', 'name code type')
                    .select('name slug designation qualifications experienceYears photo photoUrl bio specialties languagesSpoken availability consultationFee isDirector isFeatured assignedBranchIds departmentId')
                    .sort({ sortOrder: 1, createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Doctor_model_1.Doctor.countDocuments(query),
            ]);
            const mapped = doctors.map((doc) => {
                const obj = doc.toObject();
                if (!obj.photo && obj.photoUrl)
                    obj.photo = obj.photoUrl;
                if (!obj.photoUrl && obj.photo)
                    obj.photoUrl = obj.photo;
                return obj;
            });
            const data = mapped;
            const totalCount = total || data.length;
            return res.status(200).json(ApiResponse_1.ApiResponse.success(data, 'Public doctors fetched successfully', {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit) || 1,
            }));
        }
        catch (err) {
            return res.status(200).json(ApiResponse_1.ApiResponse.success([], 'Public doctors fetched successfully', {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 1,
            }));
        }
    }
    // GET /api/v1/public/doctors/:slug
    static async getDoctorBySlug(req, res) {
        try {
            const doctor = await Doctor_model_1.Doctor.findOne({ slug: req.params.slug, status: 'ACTIVE', isDeleted: false })
                .populate('departmentId', 'title slug')
                .populate('assignedBranchIds', 'name code address');
            if (doctor) {
                const obj = doctor.toObject();
                if (!obj.photo && obj.photoUrl)
                    obj.photo = obj.photoUrl;
                if (!obj.photoUrl && obj.photo)
                    obj.photoUrl = obj.photo;
                return res.status(200).json(ApiResponse_1.ApiResponse.success(obj, 'Doctor fetched successfully'));
            }
        }
        catch (err) { }
        const fallback = FALLBACK_DOCTORS.find((d) => d.slug === req.params.slug) || FALLBACK_DOCTORS[0];
        return res.status(200).json(ApiResponse_1.ApiResponse.success(fallback, 'Doctor fetched successfully'));
    }
    // GET /api/v1/public/departments
    static async getDepartments(req, res) {
        try {
            const { limit: reqLimit, page: reqPage } = req.query;
            const limit = reqLimit ? parseInt(reqLimit, 10) : 50;
            const page = reqPage ? parseInt(reqPage, 10) : 1;
            const skip = (page - 1) * limit;
            const departments = await Department_model_1.Department.find({ status: 'ACTIVE', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit);
            return res.status(200).json(ApiResponse_1.ApiResponse.success(departments, 'Public departments fetched successfully'));
        }
        catch (err) {
            return res.status(200).json(ApiResponse_1.ApiResponse.success([], 'Departments fetched successfully'));
        }
    }
    // GET /api/v1/public/packages
    static async getPackages(req, res) {
        try {
            const { limit: reqLimit, page: reqPage } = req.query;
            const limit = reqLimit ? parseInt(reqLimit, 10) : 50;
            const page = reqPage ? parseInt(reqPage, 10) : 1;
            const skip = (page - 1) * limit;
            const packages = await CarePackage_model_1.CarePackage.find({ status: 'ACTIVE', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit);
            return res.status(200).json(ApiResponse_1.ApiResponse.success(packages, 'Public packages fetched successfully'));
        }
        catch (err) {
            return res.status(200).json(ApiResponse_1.ApiResponse.success([], 'Packages fetched successfully'));
        }
    }
    // GET /api/v1/public/packages/:slug
    static async getPackageBySlug(req, res) {
        try {
            const pkg = await CarePackage_model_1.CarePackage.findOne({ slug: req.params.slug, status: 'ACTIVE', isDeleted: false });
            if (pkg)
                return res.status(200).json(ApiResponse_1.ApiResponse.success(pkg, 'Package fetched successfully'));
        }
        catch (err) { }
        throw ApiError_1.ApiError.notFound('Package not found');
    }
    // GET /api/v1/public/blogs
    static async getBlogs(req, res) {
        try {
            const { limit: reqLimit, page: reqPage } = req.query;
            const limit = reqLimit ? parseInt(reqLimit, 10) : 50;
            const page = reqPage ? parseInt(reqPage, 10) : 1;
            const skip = (page - 1) * limit;
            const blogs = await Blog_model_1.Blog.find({ status: 'PUBLISHED', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit);
            return res.status(200).json(ApiResponse_1.ApiResponse.success(blogs, 'Public blogs fetched successfully'));
        }
        catch (err) {
            return res.status(200).json(ApiResponse_1.ApiResponse.success([], 'Blogs fetched successfully'));
        }
    }
    // GET /api/v1/public/blogs/:slug
    static async getBlogBySlug(req, res) {
        try {
            const blog = await Blog_model_1.Blog.findOne({ slug: req.params.slug, status: 'PUBLISHED', isDeleted: false });
            if (blog)
                return res.status(200).json(ApiResponse_1.ApiResponse.success(blog, 'Blog article fetched successfully'));
        }
        catch (err) { }
        throw ApiError_1.ApiError.notFound('Blog article not found');
    }
    // GET /api/v1/public/facilities
    static async getFacilities(req, res) {
        try {
            const { limit: reqLimit, page: reqPage } = req.query;
            const limit = reqLimit ? parseInt(reqLimit, 10) : 50;
            const page = reqPage ? parseInt(reqPage, 10) : 1;
            const skip = (page - 1) * limit;
            const facilities = await Infrastructure_model_1.Infrastructure.find({ status: 'ACTIVE', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit);
            return res.status(200).json(ApiResponse_1.ApiResponse.success(facilities, 'Public facilities fetched successfully'));
        }
        catch (err) {
            return res.status(200).json(ApiResponse_1.ApiResponse.success([], 'Facilities fetched successfully'));
        }
    }
    // GET /api/v1/public/testimonials
    static async getTestimonials(req, res) {
        try {
            const { limit: reqLimit, page: reqPage } = req.query;
            const limit = reqLimit ? parseInt(reqLimit, 10) : 50;
            const page = reqPage ? parseInt(reqPage, 10) : 1;
            const skip = (page - 1) * limit;
            const testimonials = await Testimonial_model_1.Testimonial.find({ status: 'ACTIVE', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit);
            return res.status(200).json(ApiResponse_1.ApiResponse.success(testimonials, 'Public testimonials fetched successfully'));
        }
        catch (err) {
            return res.status(200).json(ApiResponse_1.ApiResponse.success([], 'Testimonials fetched successfully'));
        }
    }
    // GET /api/v1/public/faqs
    static async getFaqs(req, res) {
        try {
            const { limit: reqLimit, page: reqPage } = req.query;
            const limit = reqLimit ? parseInt(reqLimit, 10) : 50;
            const page = reqPage ? parseInt(reqPage, 10) : 1;
            const skip = (page - 1) * limit;
            const faqs = await FAQ_model_1.FAQ.find({ status: 'ACTIVE', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit);
            return res.status(200).json(ApiResponse_1.ApiResponse.success(faqs, 'Public FAQs fetched successfully'));
        }
        catch (err) {
            return res.status(200).json(ApiResponse_1.ApiResponse.success([], 'FAQs fetched successfully'));
        }
    }
    // POST /api/v1/public/appointment
    static async bookAppointment(req, res) {
        const { name, phone, email, date, doctorId, branchId, symptoms, timeSlot, preferredTimeSlot } = req.body;
        if (!name || !phone) {
            throw ApiError_1.ApiError.badRequest('Name and Phone are required for booking');
        }
        let finalBranchId = branchId;
        if (!finalBranchId && doctorId) {
            try {
                const doc = await Doctor_model_1.Doctor.findById(doctorId);
                if (doc && doc.assignedBranchIds && doc.assignedBranchIds.length > 0) {
                    finalBranchId = doc.assignedBranchIds[0];
                }
            }
            catch (e) { }
        }
        if (!finalBranchId) {
            try {
                const defaultBranch = (await Branch_model_1.Branch.findOne({ isMainBranch: true })) || (await Branch_model_1.Branch.findOne({ status: 'ACTIVE' }));
                if (defaultBranch) {
                    finalBranchId = defaultBranch._id;
                }
            }
            catch (e) { }
        }
        const slot = preferredTimeSlot || timeSlot || '10:00 AM';
        const appointmentNumber = `APT-${Date.now().toString().slice(-6)}`;
        const appointment = await Appointment_model_1.Appointment.create({
            appointmentNumber,
            patientName: name,
            patientPhone: phone,
            patientEmail: email || '',
            preferredDate: date ? new Date(date) : new Date(),
            preferredTimeSlot: slot,
            doctorId: doctorId || undefined,
            branchId: finalBranchId || undefined,
            symptomsNote: symptoms || '',
            status: 'PENDING',
        });
        return res.status(201).json(ApiResponse_1.ApiResponse.success(appointment, 'Appointment booked successfully'));
    }
    // POST /api/v1/public/contact
    static async submitLead(req, res) {
        const { name, phone, email, subject, message, branchId } = req.body;
        if (!name || !phone) {
            throw ApiError_1.ApiError.badRequest('Name and Phone are required');
        }
        const lead = await Lead_model_1.Lead.create({
            name,
            phone,
            email,
            subject: subject || 'General Enquiry',
            message: message || '',
            branchId,
            status: 'NEW',
        });
        return res.status(201).json(ApiResponse_1.ApiResponse.success({ id: lead._id, message: 'Thank you for reaching out. We will get back to you shortly.' }, 'Lead submitted successfully'));
    }
    // POST /api/v1/public/feedback
    static async submitFeedback(req, res) {
        const { name, phone, rating, message } = req.body;
        if (!name || !message) {
            throw ApiError_1.ApiError.badRequest('Name and Message are required');
        }
        const testimonial = await Testimonial_model_1.Testimonial.create({
            patientName: name,
            patientLocation: 'Website Feedback',
            rating: rating ? parseInt(rating, 10) : 5,
            reviewText: message,
            status: 'ACTIVE',
            isFeatured: false,
        });
        return res.status(201).json(ApiResponse_1.ApiResponse.success(testimonial, 'Thank you for your valuable feedback!'));
    }
    // GET /api/v1/public/conditions
    static async getConditions(req, res) {
        try {
            const { limit: reqLimit, page: reqPage } = req.query;
            const limit = reqLimit ? parseInt(reqLimit, 10) : 10;
            const page = reqPage ? parseInt(reqPage, 10) : 1;
            const skip = (page - 1) * limit;
            const [conditions, total] = await Promise.all([
                Condition_model_1.default.find({ status: 'published', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit),
                Condition_model_1.default.countDocuments({ status: 'published', isDeleted: false }),
            ]);
            const data = conditions;
            const totalCount = total || data.length;
            return res.status(200).json(ApiResponse_1.ApiResponse.success(data, 'Public conditions fetched successfully', {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit) || 1,
            }));
        }
        catch (err) {
            return res.status(200).json(ApiResponse_1.ApiResponse.success([], 'Public conditions fetched successfully', {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 1,
            }));
        }
    }
    // GET /api/v1/public/conditions/:slug
    static async getConditionBySlug(req, res) {
        try {
            const condition = await Condition_model_1.default.findOne({ slug: req.params.slug, status: 'published', isDeleted: false })
                .populate('assignedBranchIds', 'name code address')
                .select('-__v -createdAt -updatedAt -isDeleted');
            if (condition)
                return res.status(200).json(ApiResponse_1.ApiResponse.success(condition, 'Condition fetched successfully'));
        }
        catch (err) { }
        const fallback = FALLBACK_CONDITIONS.find((c) => c.slug === req.params.slug) || FALLBACK_CONDITIONS[0];
        return res.status(200).json(ApiResponse_1.ApiResponse.success(fallback, 'Condition fetched successfully'));
    }
    // GET /api/v1/public/treatments
    static async getTreatments(req, res) {
        try {
            const { category, search, q, limit: reqLimit, page: reqPage } = req.query;
            let query = { status: 'published', isDeleted: false };
            if (category && category !== 'ALL') {
                query.category = new RegExp(category, 'i');
            }
            const searchTerm = (search || q);
            if (searchTerm && searchTerm.trim()) {
                const regex = new RegExp(searchTerm.trim(), 'i');
                query.$or = [{ title: regex }, { name: regex }, { category: regex }, { shortDescription: regex }];
            }
            const limit = reqLimit ? parseInt(reqLimit, 10) : 10;
            const page = reqPage ? parseInt(reqPage, 10) : 1;
            const skip = (page - 1) * limit;
            const [treatments, total] = await Promise.all([
                Treatment_model_1.default.find(query).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit),
                Treatment_model_1.default.countDocuments(query),
            ]);
            const data = treatments;
            const totalCount = total || data.length;
            return res.status(200).json(ApiResponse_1.ApiResponse.success(data, 'Public treatments fetched successfully', {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit) || 1,
            }));
        }
        catch (err) {
            return res.status(200).json(ApiResponse_1.ApiResponse.success([], 'Public treatments fetched successfully', {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 1,
            }));
        }
    }
    // GET /api/v1/public/treatments/:slug
    static async getTreatmentBySlug(req, res) {
        try {
            const treatment = await Treatment_model_1.default.findOne({ slug: req.params.slug, status: 'published', isDeleted: false })
                .populate('assignedBranchIds', 'name code address')
                .select('-__v -createdAt -updatedAt -isDeleted');
            if (treatment)
                return res.status(200).json(ApiResponse_1.ApiResponse.success(treatment, 'Treatment fetched successfully'));
        }
        catch (err) { }
        const fallback = FALLBACK_TREATMENTS.find((t) => t.slug === req.params.slug) || FALLBACK_TREATMENTS[0];
        return res.status(200).json(ApiResponse_1.ApiResponse.success(fallback, 'Treatment fetched successfully'));
    }
    // GET /api/v1/public/ecosystem
    static async getEcosystemPillars(req, res) {
        try {
            const { limit: reqLimit, page: reqPage } = req.query;
            const limit = reqLimit ? parseInt(reqLimit, 10) : 50;
            const page = reqPage ? parseInt(reqPage, 10) : 1;
            const skip = (page - 1) * limit;
            const pillars = await Ecosystem_model_1.default.find({ status: 'published', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit);
            return res.status(200).json(ApiResponse_1.ApiResponse.success(pillars, 'Public ecosystem pillars fetched successfully'));
        }
        catch (err) {
            return res.status(200).json(ApiResponse_1.ApiResponse.success([], 'Ecosystem pillars fetched successfully'));
        }
    }
    // GET /api/v1/public/ecosystem/:slug
    static async getEcosystemPillarBySlug(req, res) {
        try {
            const pillar = await Ecosystem_model_1.default.findOne({ slug: req.params.slug, status: 'published', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted');
            if (pillar)
                return res.status(200).json(ApiResponse_1.ApiResponse.success(pillar, 'Ecosystem pillar fetched successfully'));
        }
        catch (err) { }
        throw ApiError_1.ApiError.notFound('Ecosystem pillar not found');
    }
    // GET /api/v1/public/videos
    static async getVideos(req, res) {
        try {
            const { limit: reqLimit, page: reqPage } = req.query;
            const limit = reqLimit ? parseInt(reqLimit, 10) : 50;
            const page = reqPage ? parseInt(reqPage, 10) : 1;
            const skip = (page - 1) * limit;
            const videos = await Video_model_1.default.find({ status: 'published', isDeleted: false }).sort({ sortOrder: 1 }).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit);
            return res.status(200).json(ApiResponse_1.ApiResponse.success(videos, 'Public videos fetched successfully'));
        }
        catch (err) {
            return res.status(200).json(ApiResponse_1.ApiResponse.success([], 'Videos fetched successfully'));
        }
    }
    // GET /api/v1/public/affiliations
    static async getAffiliations(req, res) {
        try {
            const { limit: reqLimit, page: reqPage } = req.query;
            const limit = reqLimit ? parseInt(reqLimit, 10) : 50;
            const page = reqPage ? parseInt(reqPage, 10) : 1;
            const skip = (page - 1) * limit;
            const affiliations = await Affiliation_model_1.default.find({ status: 'published', isDeleted: false }).sort({ sortOrder: 1 }).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit);
            return res.status(200).json(ApiResponse_1.ApiResponse.success(affiliations, 'Public affiliations fetched successfully'));
        }
        catch (err) {
            return res.status(200).json(ApiResponse_1.ApiResponse.success([], 'Affiliations fetched successfully'));
        }
    }
}
exports.PublicController = PublicController;
