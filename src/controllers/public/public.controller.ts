import { Request, Response } from 'express';
import { Branch } from '../../models/Branch.model';
import { Doctor } from '../../models/Doctor.model';
import { Department } from '../../models/Department.model';
import { CarePackage } from '../../models/CarePackage.model';
import { Blog } from '../../models/Blog.model';
import { Testimonial } from '../../models/Testimonial.model';
import { FAQ } from '../../models/FAQ.model';
import { Appointment } from '../../models/Appointment.model';
import { Lead } from '../../models/Lead.model';
import { Infrastructure } from '../../models/Infrastructure.model';
import { Setting } from '../../models/Setting.model';
import Condition from '../../models/Condition.model';
import Treatment from '../../models/Treatment.model';
import Ecosystem from '../../models/Ecosystem.model';
import NewsEvent from '../../models/NewsEvent.model';
import Video from '../../models/Video.model';
import GalleryAlbum from '../../models/GalleryAlbum.model';
import Affiliation from '../../models/Affiliation.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { InputSanitizer } from '../../utils/sanitizer';

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

export class PublicController {
  // GET /api/v1/public/home - Aggregated public homepage data with limits
  static async getHome(req: Request, res: Response) {
    try {
      const [branches, doctors, departments, packages, testimonials, faqs, conditions, treatments, settingsList] = await Promise.all([
        Branch.find({ status: 'ACTIVE', isDeleted: false }).select('name code type tagline address contact opdTimings bedCapacity features isMainBranch coverImage').limit(10),
        Doctor.find({ status: 'ACTIVE', isDeleted: false }).populate('departmentId', 'title slug').select('name slug designation qualifications experienceYears photo photoUrl bio specialties languagesSpoken availability isDirector isFeatured').limit(15),
        Department.find({ status: 'ACTIVE', isDeleted: false }).select('title slug code tagline overview icon image photo isFeatured').limit(12),
        CarePackage.find({ status: 'ACTIVE', isDeleted: false }).select('title slug subtitle durationDays overview inclusions targetAilments price isFeatured bannerImage').limit(10),
        Testimonial.find({ status: 'ACTIVE', isFeatured: true, isDeleted: false }).select('patientName patientLocation treatmentReceived rating reviewText patientPhoto videoUrl').limit(10),
        FAQ.find({ status: 'ACTIVE', isDeleted: false }).select('question answer category').limit(10),
        Condition.find({ status: 'published', isDeleted: false }).select('title slug category shortDescription coverImage isFeatured').limit(12),
        Treatment.find({ status: 'published', isDeleted: false }).select('title slug category shortDescription durationMinutes coverImage isFeatured').limit(12),
        Setting.find({}),
      ]);

      const settingsMap: Record<string, any> = {};
      settingsList.forEach((s) => {
        settingsMap[s.key] = s.value;
      });

      const mappedDoctors = doctors.map((doc: any) => {
        const obj = doc.toObject();
        if (!obj.photo && obj.photoUrl) obj.photo = obj.photoUrl;
        if (!obj.photoUrl && obj.photo) obj.photoUrl = obj.photo;
        return obj;
      });

      return res.status(200).json(
        ApiResponse.success({
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
        }, 'Public home data fetched successfully')
      );
    } catch (err) {
      return res.status(200).json(
        ApiResponse.success({
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
        }, 'Public home fallback data served')
      );
    }
  }

  // GET /api/v1/public/settings
  static async getSettings(req: Request, res: Response) {
    try {
      const settings = await Setting.find({});
      const settingsMap: Record<string, any> = {};
      settings.forEach((s) => {
        settingsMap[s.key] = s.value;
      });
      return res.status(200).json(ApiResponse.success(settingsMap, 'Public settings fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success({}, 'Default settings served'));
    }
  }

  // GET /api/v1/public/branches
  static async getBranches(req: Request, res: Response) {
    try {
      const { type, limit: reqLimit, page: reqPage } = req.query;
      const limit = reqLimit ? parseInt(reqLimit as string, 10) : 10;
      const page = reqPage ? parseInt(reqPage as string, 10) : 1;
      const skip = (page - 1) * limit;

      let query: any = { status: 'ACTIVE' };
      if (type && type !== 'ALL') {
        query.type = type;
      }

      const [branches, total] = await Promise.all([
        Branch.find(query).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit),
        Branch.countDocuments(query),
      ]);

      const data = branches;
      const totalCount = total || data.length;
      return res.status(200).json(
        ApiResponse.success(data, 'Public branches fetched successfully', {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit) || 1,
        })
      );
    } catch (err) {
      return res.status(200).json(
        ApiResponse.success([], 'Public branches fetched successfully', {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        })
      );
    }
  }

  // GET /api/v1/public/doctors
  static async getDoctors(req: Request, res: Response) {
    try {
      const { branchCode, category, search, q, limit: reqLimit, page: reqPage } = req.query;
      let query: any = { status: 'ACTIVE', isDeleted: false };

      if (branchCode) {
        const branch = await Branch.findOne({ code: (branchCode as string).toUpperCase() });
        if (branch) {
          query.assignedBranchIds = branch._id;
        }
      }

      if (category && category !== 'ALL') {
        const dept = await Department.findOne({
          $or: [{ slug: category }, { title: new RegExp(category as string, 'i') }],
        });
        if (dept) {
          query.departmentId = dept._id;
        } else {
          query.specialties = new RegExp(category as string, 'i');
        }
      }

      const searchTerm = (search || q) as string;
      if (searchTerm && searchTerm.trim()) {
        const regex = new RegExp(searchTerm.trim(), 'i');
        query.$or = [{ name: regex }, { designation: regex }, { specialties: regex }, { qualifications: regex }];
      }

      const isAll = req.query.all === 'true' || reqLimit === '0' || reqLimit === 'all';
      const limit = isAll ? 1000 : reqLimit ? parseInt(reqLimit as string, 10) : 50;
      const page = reqPage ? parseInt(reqPage as string, 10) : 1;
      const skip = (page - 1) * limit;

      const [doctors, total] = await Promise.all([
        Doctor.find(query)
          .populate('departmentId', 'title slug')
          .populate('assignedBranchIds', 'name code type')
          .select('name slug designation qualifications experienceYears photo photoUrl bio specialties languagesSpoken availability consultationFee isDirector isFeatured assignedBranchIds departmentId')
          .sort({ sortOrder: 1, createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Doctor.countDocuments(query),
      ]);

      const mapped = doctors.map((doc: any) => {
        const obj = doc.toObject();
        if (!obj.photo && obj.photoUrl) obj.photo = obj.photoUrl;
        if (!obj.photoUrl && obj.photo) obj.photoUrl = obj.photo;
        return obj;
      });

      const data = mapped;
      const totalCount = total || data.length;
      return res.status(200).json(
        ApiResponse.success(data, 'Public doctors fetched successfully', {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit) || 1,
        })
      );
    } catch (err) {
      return res.status(200).json(
        ApiResponse.success([], 'Public doctors fetched successfully', {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        })
      );
    }
  }

  // GET /api/v1/public/doctors/:slug
  static async getDoctorBySlug(req: Request, res: Response) {
    try {
      const doctor = await Doctor.findOne({ slug: req.params.slug, status: 'ACTIVE', isDeleted: false })
        .populate('departmentId', 'title slug')
        .populate('assignedBranchIds', 'name code address');
      if (doctor) {
        const obj = doctor.toObject();
        if (!obj.photo && obj.photoUrl) obj.photo = obj.photoUrl;
        if (!obj.photoUrl && obj.photo) obj.photoUrl = obj.photo;
        return res.status(200).json(ApiResponse.success(obj, 'Doctor fetched successfully'));
      }
    } catch (err) {}
    const fallback = FALLBACK_DOCTORS.find((d) => d.slug === req.params.slug) || FALLBACK_DOCTORS[0];
    return res.status(200).json(ApiResponse.success(fallback, 'Doctor fetched successfully'));
  }

  // GET /api/v1/public/departments
  static async getDepartments(req: Request, res: Response) {
    try {
      const { search, q, limit: reqLimit, page: reqPage } = req.query;
      const searchTerm = ((search || q || '') as string).trim();
      let query: any = { status: 'ACTIVE', isDeleted: false };

      if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i');
        query.$or = [{ title: regex }, { name: regex }, { tagline: regex }, { overview: regex }, { description: regex }];
      }

      const limit = reqLimit ? parseInt(reqLimit as string, 10) : 50;
      const page = reqPage ? parseInt(reqPage as string, 10) : 1;
      const skip = (page - 1) * limit;

      const departments = await Department.find(query).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit);
      return res.status(200).json(ApiResponse.success(departments, 'Public departments fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success([], 'Departments fetched successfully'));
    }
  }

  // GET /api/v1/public/packages
  // GET /api/v1/public/packages
  static async getPackages(req: Request, res: Response) {
    try {
      const { category, days, durationDays, search, q, limit: reqLimit, page: reqPage } = req.query;
      let query: any = { status: 'ACTIVE', isDeleted: false };

      const targetDays = days || durationDays || category;
      if (targetDays && targetDays !== 'ALL') {
        const numDays = parseInt((targetDays as string).replace(/\D/g, ''), 10);
        if (!isNaN(numDays)) {
          query.durationDays = numDays;
        }
      }

      const searchTerm = (search || q) as string;
      if (searchTerm && searchTerm.trim()) {
        const regex = new RegExp(searchTerm.trim(), 'i');
        query.$or = [{ title: regex }, { subtitle: regex }, { overview: regex }];
      }

      const limit = reqLimit ? parseInt(reqLimit as string, 10) : 50;
      const page = reqPage ? parseInt(reqPage as string, 10) : 1;
      const skip = (page - 1) * limit;

      const [packages, total] = await Promise.all([
        CarePackage.find(query).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit),
        CarePackage.countDocuments(query),
      ]);

      const data = packages;
      const totalCount = total || data.length;
      return res.status(200).json(
        ApiResponse.success(data, 'Public packages fetched successfully', {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit) || 1,
        })
      );
    } catch (err) {
      return res.status(200).json(
        ApiResponse.success([], 'Packages fetched successfully', {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        })
      );
    }
  }

  // GET /api/v1/public/packages/:slug
  static async getPackageBySlug(req: Request, res: Response) {
    try {
      const pkg = await CarePackage.findOne({ slug: req.params.slug, status: 'ACTIVE', isDeleted: false });
      if (pkg) return res.status(200).json(ApiResponse.success(pkg, 'Package fetched successfully'));
    } catch (err) {}
    throw ApiError.notFound('Package not found');
  }

  // GET /api/v1/public/blogs
  static async getBlogs(req: Request, res: Response) {
    try {
      const { limit: reqLimit, page: reqPage } = req.query;
      const limit = reqLimit ? parseInt(reqLimit as string, 10) : 50;
      const page = reqPage ? parseInt(reqPage as string, 10) : 1;
      const skip = (page - 1) * limit;

      const blogs = await Blog.find({ status: 'PUBLISHED', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit);
      return res.status(200).json(ApiResponse.success(blogs, 'Public blogs fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success([], 'Blogs fetched successfully'));
    }
  }

  // GET /api/v1/public/blogs/:slug
  static async getBlogBySlug(req: Request, res: Response) {
    try {
      const blog = await Blog.findOne({ slug: req.params.slug, status: 'PUBLISHED', isDeleted: false });
      if (blog) return res.status(200).json(ApiResponse.success(blog, 'Blog article fetched successfully'));
    } catch (err) {}
    throw ApiError.notFound('Blog article not found');
  }

  // GET /api/v1/public/facilities
  static async getFacilities(req: Request, res: Response) {
    try {
      const { limit: reqLimit, page: reqPage } = req.query;
      const limit = reqLimit ? parseInt(reqLimit as string, 10) : 50;
      const page = reqPage ? parseInt(reqPage as string, 10) : 1;
      const skip = (page - 1) * limit;

      const facilities = await Infrastructure.find({ status: 'ACTIVE', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit);
      return res.status(200).json(ApiResponse.success(facilities, 'Public facilities fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success([], 'Facilities fetched successfully'));
    }
  }

  // GET /api/v1/public/testimonials
  static async getTestimonials(req: Request, res: Response) {
    try {
      const { limit: reqLimit, page: reqPage } = req.query;
      const limit = reqLimit ? parseInt(reqLimit as string, 10) : 9;
      const page = reqPage ? parseInt(reqPage as string, 10) : 1;
      const skip = (page - 1) * limit;

      const [testimonials, total] = await Promise.all([
        Testimonial.find({ status: 'ACTIVE', isDeleted: false })
          .select('-__v -createdAt -updatedAt -isDeleted')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Testimonial.countDocuments({ status: 'ACTIVE', isDeleted: false }),
      ]);

      return res.status(200).json(
        ApiResponse.success(testimonials, 'Public testimonials fetched successfully', {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        })
      );
    } catch (err) {
      return res.status(200).json(ApiResponse.success([], 'Testimonials fetched successfully'));
    }
  }

  // GET /api/v1/public/faqs
  static async getFaqs(req: Request, res: Response) {
    try {
      const { limit: reqLimit, page: reqPage, category, q } = req.query;
      const limit = reqLimit ? parseInt(reqLimit as string, 10) : 50;
      const page = reqPage ? parseInt(reqPage as string, 10) : 1;
      const skip = (page - 1) * limit;

      const query: any = { status: 'ACTIVE', isDeleted: false };
      if (category && category !== 'ALL') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (q) {
        query.$or = [
          { question: { $regex: q as string, $options: 'i' } },
          { answer: { $regex: q as string, $options: 'i' } },
        ];
      }

      const [faqs, total] = await Promise.all([
        FAQ.find(query)
          .select('-__v -createdAt -updatedAt -isDeleted')
          .sort({ sortOrder: 1, createdAt: -1 })
          .skip(skip)
          .limit(limit),
        FAQ.countDocuments(query),
      ]);

      return res.status(200).json(
        ApiResponse.success(faqs, 'Public FAQs fetched successfully', {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        })
      );
    } catch (err) {
      return res.status(200).json(ApiResponse.success([], 'FAQs fetched successfully'));
    }
  }

  // POST /api/v1/public/appointment
  static async bookAppointment(req: Request, res: Response) {
    const { name, phone, email, date, doctorId, branchId, symptoms, timeSlot, preferredTimeSlot } = req.body;
    if (!name || !phone) {
      throw ApiError.badRequest('Name and Phone are required for booking');
    }

    let finalBranchId = branchId;
    if (!finalBranchId && doctorId) {
      try {
        const doc = await Doctor.findById(doctorId);
        if (doc && doc.assignedBranchIds && doc.assignedBranchIds.length > 0) {
          finalBranchId = doc.assignedBranchIds[0];
        }
      } catch (e) {}
    }
    if (!finalBranchId) {
      try {
        const defaultBranch = (await Branch.findOne({ isMainBranch: true })) || (await Branch.findOne({ status: 'ACTIVE' }));
        if (defaultBranch) {
          finalBranchId = defaultBranch._id;
        }
      } catch (e) {}
    }

    const slot = preferredTimeSlot || timeSlot || '10:00 AM';
    const appointmentNumber = `APT-${Date.now().toString().slice(-6)}`;

    const appointment = await Appointment.create({
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

    return res.status(201).json(ApiResponse.success(appointment, 'Appointment booked successfully'));
  }

  // POST /api/v1/public/contact
  static async submitLead(req: Request, res: Response) {
    const { name, phone, email, subject, message, branchId, leadType, packageId, treatmentId, doctorId, rating, preferredDate, preferredTimeSlot, symptomsNote } = req.body;
    if (!name || !phone) {
      throw ApiError.badRequest('Name and Phone are required');
    }

    const computedLeadType = leadType || (packageId ? 'PACKAGE_BOOKING' : treatmentId ? 'SINGLE_TREATMENT' : rating ? 'FEEDBACK_RATING' : 'GENERAL_INQUIRY');

    const lead = await Lead.create({
      name,
      phone,
      email,
      subject: subject || (computedLeadType === 'PACKAGE_BOOKING' ? 'Package Booking Request' : computedLeadType === 'SINGLE_TREATMENT' ? 'Treatment Reservation Request' : 'General Inquiry'),
      message: message || symptomsNote || '',
      leadType: computedLeadType,
      packageId: packageId || undefined,
      treatmentId: treatmentId || undefined,
      doctorId: doctorId || undefined,
      rating: rating || undefined,
      preferredDate: preferredDate || undefined,
      preferredTimeSlot: preferredTimeSlot || undefined,
      symptomsNote: symptomsNote || undefined,
      branchId: branchId || undefined,
      status: 'NEW',
    });

    return res.status(201).json(ApiResponse.success({ id: lead._id, message: 'Thank you for reaching out. We will get back to you shortly.' }, 'Lead submitted successfully'));
  }

  // POST /api/v1/public/feedback
  static async submitFeedback(req: Request, res: Response) {
    const { name, phone, rating, message } = req.body;
    if (!name || !message) {
      throw ApiError.badRequest('Name and Message are required');
    }

    const testimonial = await Testimonial.create({
      patientName: name,
      patientLocation: 'Website Feedback',
      reviewText: message,
      rating: rating ? parseInt(rating as string, 10) || 5 : 5,
      status: 'ACTIVE',
      isFeatured: false,
    });

    // Also record as a Feedback Rating Lead in admin CMS
    await Lead.create({
      name,
      phone: phone || 'N/A',
      subject: `Feedback Rating (${rating || 5} Stars)`,
      message,
      leadType: 'FEEDBACK_RATING',
      rating: rating ? parseInt(rating as string, 10) || 5 : 5,
      source: 'FEEDBACK_FORM',
      status: 'NEW',
    });

    return res.status(201).json(ApiResponse.success(testimonial, 'Thank you for your valuable rating and feedback!'));
  }

  // GET /api/v1/public/conditions
  static async getConditions(req: Request, res: Response) {
    try {
      const { limit: reqLimit, page: reqPage } = req.query;
      const limit = reqLimit ? parseInt(reqLimit as string, 10) : 10;
      const page = reqPage ? parseInt(reqPage as string, 10) : 1;
      const skip = (page - 1) * limit;

      const [conditions, total] = await Promise.all([
        Condition.find({ status: 'published', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit),
        Condition.countDocuments({ status: 'published', isDeleted: false }),
      ]);

      const data = conditions;
      const totalCount = total || data.length;
      return res.status(200).json(
        ApiResponse.success(data, 'Public conditions fetched successfully', {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit) || 1,
        })
      );
    } catch (err) {
      return res.status(200).json(
        ApiResponse.success([], 'Public conditions fetched successfully', {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        })
      );
    }
  }

  // GET /api/v1/public/conditions/:slug
  static async getConditionBySlug(req: Request, res: Response) {
    try {
      const condition = await Condition.findOne({ slug: req.params.slug, status: 'published', isDeleted: false })
        .populate('assignedBranchIds', 'name code address')
        .select('-__v -createdAt -updatedAt -isDeleted');
      if (condition) return res.status(200).json(ApiResponse.success(condition, 'Condition fetched successfully'));
    } catch (err) {}
    const fallback = FALLBACK_CONDITIONS.find((c) => c.slug === req.params.slug) || FALLBACK_CONDITIONS[0];
    return res.status(200).json(ApiResponse.success(fallback, 'Condition fetched successfully'));
  }

  // GET /api/v1/public/treatments
  static async getTreatments(req: Request, res: Response) {
    try {
      const { category, search, q, limit: reqLimit, page: reqPage } = req.query;
      let query: any = { status: 'published', isDeleted: false };

      if (category && category !== 'ALL') {
        query.category = new RegExp(category as string, 'i');
      }

      const searchTerm = (search || q) as string;
      if (searchTerm && searchTerm.trim()) {
        const regex = new RegExp(searchTerm.trim(), 'i');
        query.$or = [{ title: regex }, { name: regex }, { category: regex }, { shortDescription: regex }];
      }

      const limit = reqLimit ? parseInt(reqLimit as string, 10) : 10;
      const page = reqPage ? parseInt(reqPage as string, 10) : 1;
      const skip = (page - 1) * limit;

      const [treatments, total] = await Promise.all([
        Treatment.find(query).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit),
        Treatment.countDocuments(query),
      ]);

      const data = treatments;
      const totalCount = total || data.length;
      return res.status(200).json(
        ApiResponse.success(data, 'Public treatments fetched successfully', {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit) || 1,
        })
      );
    } catch (err) {
      return res.status(200).json(
        ApiResponse.success([], 'Public treatments fetched successfully', {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        })
      );
    }
  }

  // GET /api/v1/public/treatments/:slug
  static async getTreatmentBySlug(req: Request, res: Response) {
    try {
      const treatment = await Treatment.findOne({ slug: req.params.slug, status: 'published', isDeleted: false })
        .populate('assignedBranchIds', 'name code address')
        .select('-__v -createdAt -updatedAt -isDeleted');
      if (treatment) return res.status(200).json(ApiResponse.success(treatment, 'Treatment fetched successfully'));
    } catch (err) {}
    const fallback = FALLBACK_TREATMENTS.find((t) => t.slug === req.params.slug) || FALLBACK_TREATMENTS[0];
    return res.status(200).json(ApiResponse.success(fallback, 'Treatment fetched successfully'));
  }

  // GET /api/v1/public/ecosystem
  static async getEcosystemPillars(req: Request, res: Response) {
    try {
      const { limit: reqLimit, page: reqPage } = req.query;
      const limit = reqLimit ? parseInt(reqLimit as string, 10) : 50;
      const page = reqPage ? parseInt(reqPage as string, 10) : 1;
      const skip = (page - 1) * limit;

      const pillars = await Ecosystem.find({ status: 'published', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit);
      return res.status(200).json(ApiResponse.success(pillars, 'Public ecosystem pillars fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success([], 'Ecosystem pillars fetched successfully'));
    }
  }

  // GET /api/v1/public/ecosystem/:slug
  static async getEcosystemPillarBySlug(req: Request, res: Response) {
    try {
      const pillar = await Ecosystem.findOne({ slug: req.params.slug, status: 'published', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted');
      if (pillar) return res.status(200).json(ApiResponse.success(pillar, 'Ecosystem pillar fetched successfully'));
    } catch (err) {}
    throw ApiError.notFound('Ecosystem pillar not found');
  }

  // GET /api/v1/public/videos
  static async getVideos(req: Request, res: Response) {
    try {
      const { limit: reqLimit, page: reqPage } = req.query;
      const limit = reqLimit ? parseInt(reqLimit as string, 10) : 50;
      const page = reqPage ? parseInt(reqPage as string, 10) : 1;
      const skip = (page - 1) * limit;

      const videos = await Video.find({ status: 'published', isDeleted: false }).sort({ sortOrder: 1 }).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit);
      return res.status(200).json(ApiResponse.success(videos, 'Public videos fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success([], 'Videos fetched successfully'));
    }
  }

  // GET /api/v1/public/affiliations
  static async getAffiliations(req: Request, res: Response) {
    try {
      const { limit: reqLimit, page: reqPage } = req.query;
      const limit = reqLimit ? parseInt(reqLimit as string, 10) : 50;
      const page = reqPage ? parseInt(reqPage as string, 10) : 1;
      const skip = (page - 1) * limit;

      const affiliations = await Affiliation.find({ status: 'published', isDeleted: false }).sort({ sortOrder: 1 }).select('-__v -createdAt -updatedAt -isDeleted').skip(skip).limit(limit);
      return res.status(200).json(ApiResponse.success(affiliations, 'Public affiliations fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success([], 'Affiliations fetched successfully'));
    }
  }

  // GET /api/v1/public/search?q=search_term
  static async search(req: Request, res: Response) {
    try {
      const q = ((req.query.q || req.query.search || '') as string).trim();
      if (!q) {
        return res.status(200).json(ApiResponse.success([], 'No search term provided'));
      }

      const regex = new RegExp(q, 'i');
      const limit = 5;

      const [treatments, doctors, packages, conditions, departments] = await Promise.all([
        Treatment.find({ isDeleted: false, $or: [{ name: regex }, { title: regex }, { category: regex }, { shortDescription: regex }] })
          .select('name title slug category shortDescription coverImage image')
          .limit(limit),
        Doctor.find({ status: 'ACTIVE', isDeleted: false, $or: [{ name: regex }, { designation: regex }, { specialties: regex }] })
          .select('name slug designation specialties photo photoUrl')
          .limit(limit),
        CarePackage.find({ status: 'ACTIVE', isDeleted: false, $or: [{ title: regex }, { subtitle: regex }, { overview: regex }] })
          .select('title slug subtitle bannerImage price durationDays')
          .limit(limit),
        Condition.find({ isDeleted: false, $or: [{ title: regex }, { category: regex }, { shortDescription: regex }] })
          .select('title slug category shortDescription coverImage')
          .limit(limit),
        Department.find({ status: 'ACTIVE', isDeleted: false, $or: [{ title: regex }, { name: regex }, { tagline: regex }, { overview: regex }] })
          .select('title name slug tagline icon coverImage image')
          .limit(limit),
      ]);

      const results: any[] = [];

      treatments.forEach((item: any) => {
        results.push({
          id: item._id,
          title: item.title || item.name,
          type: 'TREATMENT',
          subtitle: item.shortDescription || item.category,
          url: `/treatments/${item.slug || item._id}`,
          image: item.image || item.coverImage,
        });
      });

      doctors.forEach((item: any) => {
        results.push({
          id: item._id,
          title: item.name,
          type: 'DOCTOR',
          subtitle: item.designation || (Array.isArray(item.specialties) ? item.specialties.join(', ') : item.specialties),
          url: `/doctors/${item.slug || item._id}`,
          image: item.photoUrl || item.photo,
        });
      });

      packages.forEach((item: any) => {
        results.push({
          id: item._id,
          title: item.title,
          type: 'RETREAT',
          subtitle: item.subtitle || (item.durationDays ? `${item.durationDays} Days Package` : ''),
          url: `/packages/${item.slug || item._id}`,
          image: item.bannerImage,
        });
      });

      conditions.forEach((item: any) => {
        results.push({
          id: item._id,
          title: item.title,
          type: 'CONDITION',
          subtitle: item.shortDescription || item.category,
          url: `/conditions/${item.slug || item._id}`,
          image: item.coverImage,
        });
      });

      departments.forEach((item: any) => {
        results.push({
          id: item._id,
          title: item.title || item.name,
          type: 'DEPARTMENT',
          subtitle: item.tagline || item.overview,
          url: `/departments/${item.slug || item._id}`,
          image: item.icon || item.coverImage || item.image,
        });
      });

      return res.status(200).json(ApiResponse.success(results, 'Global search completed'));
    } catch (err: any) {
      return res.status(200).json(ApiResponse.success([], 'Search failed'));
    }
  }
}
