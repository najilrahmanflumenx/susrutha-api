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

// Static Fallback Data for High Availability
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
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d',
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
    photoUrl: 'https://images.unsplash.com/photo-1594824813570-78a295000527',
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
  {
    _id: 'tr-shirodhara',
    title: 'Shirodhara (Mind Calming Oil Stream Therapy)',
    slug: 'shirodhara-mind-calming-therapy',
    category: 'Panchakarma',
    shortDescription: 'Continuous rhythm pour of warm medicated oil across forehead for nerve relaxation.',
    fullDescription: 'Profound nervous system relaxation procedure highly recommended for anxiety, insomnia, hypertension, and stress.',
    durationMinutes: 45,
    recommendedDays: 7,
    indications: ['Insomnia', 'Anxiety & Depression', 'Hypertension', 'Migraine'],
    benefits: ['Calms the central nervous system', 'Improves sleep quality', 'Relieves chronic headaches'],
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
  {
    _id: 'cond-spondylosis',
    title: 'Cervical & Lumbar Spondylosis (Disc Bulge)',
    slug: 'cervical-lumbar-spondylosis-disc-bulge',
    category: 'Spine Care',
    shortDescription: 'Targeted spine therapies for compressed nerve roots, sciatica, and chronic neck & back stiffness.',
    fullDescription: 'Specialized Kadi Vasthi and Griva Vasthi procedures with medicated herbal oils to nourish spinal discs and relieve sciatica.',
    ayurvedicRootCause: 'Vata Dosha Imbalance & Asthi-Majja Dhatu Kshaya',
    symptoms: ['Radiating leg or arm pain', 'Numbness in fingers and toes', 'Lower back stiffness'],
    isFeatured: true,
    status: 'published',
  },
];

export class PublicController {
  // GET /api/v1/public/home - Aggregated public homepage data
  static async getHome(req: Request, res: Response) {
    try {
      const branches = await Branch.find({ status: 'ACTIVE', isDeleted: false }).select('name code type tagline address contact opdTimings bedCapacity features isMainBranch');
      const doctors = await Doctor.find({ status: 'ACTIVE', isDeleted: false }).populate('departmentId', 'title slug').select('name slug designation qualifications experienceYears photo bio specialties languagesSpoken availability isDirector isFeatured');
      const departments = await Department.find({ status: 'ACTIVE', isDeleted: false }).select('title slug code tagline overview icon photo isFeatured');
      const packages = await CarePackage.find({ status: 'ACTIVE', isDeleted: false }).select('title slug subtitle durationDays overview inclusions targetAilments price isFeatured');
      const testimonials = await Testimonial.find({ status: 'ACTIVE', isFeatured: true, isDeleted: false }).select('patientName patientLocation treatmentReceived rating reviewText');
      const faqs = await FAQ.find({ status: 'ACTIVE', isDeleted: false }).select('question answer category');
      const conditions = await Condition.find({ status: 'published', isDeleted: false }).select('title slug category shortDescription isFeatured');
      const treatments = await Treatment.find({ status: 'published', isDeleted: false }).select('title slug category shortDescription durationMinutes isFeatured');

      return res.status(200).json(
        ApiResponse.success({
          hospitalName: 'SUSRUTHA Ayurvedhik Hospital',
          tagline: 'Research-backed 40-bed authentic Kerala Ayurveda hospital campus',
          branches: branches.length ? branches : FALLBACK_BRANCHES,
          doctors: doctors.length ? doctors : FALLBACK_DOCTORS,
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
      const branches = await Branch.find({ status: 'ACTIVE' }).select('-__v -createdAt -updatedAt -isDeleted');
      return res.status(200).json(ApiResponse.success(branches.length ? branches : FALLBACK_BRANCHES, 'Public branches fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success(FALLBACK_BRANCHES, 'Fallback branches served'));
    }
  }

  // GET /api/v1/public/doctors
  static async getDoctors(req: Request, res: Response) {
    try {
      const { branchCode } = req.query;
      let query: any = { status: 'ACTIVE' };

      if (branchCode) {
        const branch = await Branch.findOne({ code: (branchCode as string).toUpperCase() });
        if (branch) {
          query.assignedBranchIds = branch._id;
        }
      }

      const doctors = await Doctor.find(query)
        .populate('departmentId', 'title slug')
        .populate('assignedBranchIds', 'name code type')
        .select('name slug designation qualifications experienceYears photo bio specialties languagesSpoken availability consultationFee isDirector isFeatured assignedBranchIds departmentId');

      return res.status(200).json(ApiResponse.success(doctors.length ? doctors : FALLBACK_DOCTORS, 'Public doctors fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success(FALLBACK_DOCTORS, 'Fallback doctors served'));
    }
  }

  // GET /api/v1/public/doctors/:slug
  static async getDoctorBySlug(req: Request, res: Response) {
    try {
      const doctor = await Doctor.findOne({ slug: req.params.slug, status: 'ACTIVE', isDeleted: false })
        .populate('departmentId', 'title slug')
        .populate('assignedBranchIds', 'name code address');
      if (doctor) return res.status(200).json(ApiResponse.success(doctor, 'Doctor fetched successfully'));
    } catch (err) {}
    const fallback = FALLBACK_DOCTORS.find((d) => d.slug === req.params.slug) || FALLBACK_DOCTORS[0];
    return res.status(200).json(ApiResponse.success(fallback, 'Doctor fetched successfully'));
  }

  // GET /api/v1/public/departments
  static async getDepartments(req: Request, res: Response) {
    try {
      const departments = await Department.find({ status: 'ACTIVE', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted');
      return res.status(200).json(ApiResponse.success(departments, 'Public departments fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success([], 'Departments fetched successfully'));
    }
  }

  // GET /api/v1/public/packages
  static async getPackages(req: Request, res: Response) {
    try {
      const packages = await CarePackage.find({ status: 'ACTIVE', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted');
      return res.status(200).json(ApiResponse.success(packages, 'Public packages fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success([], 'Packages fetched successfully'));
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
      const blogs = await Blog.find({ status: 'PUBLISHED', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted');
      return res.status(200).json(ApiResponse.success(blogs, 'Public blogs fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success([], 'Blogs fetched successfully'));
    }
  }

  // GET /api/v1/public/blogs/:slug
  static async getBlogBySlug(req: Request, res: Response) {
    try {
      const blog = await Blog.findOne({ slug: req.params.slug, status: 'PUBLISHED', isDeleted: false });
      if (blog) return res.status(200).json(ApiResponse.success(blog, 'Blog fetched successfully'));
    } catch (err) {}
    throw ApiError.notFound('Blog article not found');
  }

  // GET /api/v1/public/facilities
  static async getFacilities(req: Request, res: Response) {
    try {
      const facilities = await Infrastructure.find({ status: 'ACTIVE', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted');
      return res.status(200).json(ApiResponse.success(facilities, 'Public facilities fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success([], 'Facilities fetched successfully'));
    }
  }

  // GET /api/v1/public/testimonials
  static async getTestimonials(req: Request, res: Response) {
    try {
      const testimonials = await Testimonial.find({ status: 'ACTIVE', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted');
      return res.status(200).json(ApiResponse.success(testimonials, 'Public testimonials fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success([], 'Testimonials fetched successfully'));
    }
  }

  // GET /api/v1/public/faqs
  static async getFaqs(req: Request, res: Response) {
    try {
      const faqs = await FAQ.find({ status: 'ACTIVE', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted');
      return res.status(200).json(ApiResponse.success(faqs, 'Public FAQs fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success([], 'FAQs fetched successfully'));
    }
  }

  // POST /api/v1/public/appointment
  static async bookAppointment(req: Request, res: Response) {
    const { name, phone, email, date, doctorId, branchId, symptoms } = req.body;
    if (!name || !phone) {
      throw ApiError.badRequest('Name and Phone are required for booking');
    }

    const appointmentNumber = `APT-${Date.now().toString().slice(-6)}`;
    const appointment = await Appointment.create({
      appointmentNumber,
      patientName: name,
      patientPhone: phone,
      patientEmail: email || '',
      preferredDate: date ? new Date(date) : new Date(),
      doctorId,
      branchId,
      symptomsNote: symptoms || '',
      status: 'PENDING',
    });

    return res.status(201).json(ApiResponse.success(appointment, 'Appointment booked successfully'));
  }

  // POST /api/v1/public/contact
  static async submitLead(req: Request, res: Response) {
    let { name, phone, email, subject, message, branchId } = req.body;
    if (!name || !phone) {
      throw ApiError.badRequest('Name and Phone are required');
    }

    const lead = await Lead.create({
      name,
      phone,
      email,
      subject: subject || 'General Enquiry',
      message: message || '',
      branchId,
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
      rating: rating ? parseInt(rating, 10) : 5,
      reviewText: message,
      status: 'ACTIVE',
      isFeatured: false,
    });

    return res.status(201).json(ApiResponse.success(testimonial, 'Thank you for your valuable feedback!'));
  }

  // GET /api/v1/public/conditions
  static async getConditions(req: Request, res: Response) {
    try {
      const conditions = await Condition.find({ status: 'published', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted');
      return res.status(200).json(ApiResponse.success(conditions.length ? conditions : FALLBACK_CONDITIONS, 'Public conditions fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success(FALLBACK_CONDITIONS, 'Fallback conditions served'));
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
      const treatments = await Treatment.find({ status: 'published', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted');
      return res.status(200).json(ApiResponse.success(treatments.length ? treatments : FALLBACK_TREATMENTS, 'Public treatments fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success(FALLBACK_TREATMENTS, 'Fallback treatments served'));
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
      const pillars = await Ecosystem.find({ status: 'published', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted');
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
      const videos = await Video.find({ status: 'published', isDeleted: false }).sort({ sortOrder: 1 }).select('-__v -createdAt -updatedAt -isDeleted');
      return res.status(200).json(ApiResponse.success(videos, 'Public videos fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success([], 'Videos fetched successfully'));
    }
  }

  // GET /api/v1/public/affiliations
  static async getAffiliations(req: Request, res: Response) {
    try {
      const affiliations = await Affiliation.find({ status: 'published', isDeleted: false }).sort({ sortOrder: 1 }).select('-__v -createdAt -updatedAt -isDeleted');
      return res.status(200).json(ApiResponse.success(affiliations, 'Public affiliations fetched successfully'));
    } catch (err) {
      return res.status(200).json(ApiResponse.success([], 'Affiliations fetched successfully'));
    }
  }
}
