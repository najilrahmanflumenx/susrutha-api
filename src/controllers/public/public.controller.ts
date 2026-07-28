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
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';

export class PublicController {
  // GET /api/v1/public/home - Aggregated public homepage data
  static async getHome(req: Request, res: Response) {
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
        branches,
        doctors,
        departments,
        packages,
        testimonials,
        faqs,
        conditions,
        treatments,
      }, 'Public home data fetched successfully')
    );
  }

  // GET /api/v1/public/settings
  static async getSettings(req: Request, res: Response) {
    const settings = await Setting.find({});
    const settingsMap: Record<string, any> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return res.status(200).json(ApiResponse.success(settingsMap, 'Public settings fetched successfully'));
  }

  // GET /api/v1/public/branches
  static async getBranches(req: Request, res: Response) {
    const branches = await Branch.find({ status: 'ACTIVE' }).select('-__v -createdAt -updatedAt -isDeleted');
    return res.status(200).json(ApiResponse.success(branches, 'Public branches fetched successfully'));
  }

  // GET /api/v1/public/doctors
  static async getDoctors(req: Request, res: Response) {
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
      .select('name slug designation qualifications experienceYears photo bio specialties languagesSpoken availability consultationFee isDirector isFeatured');

    return res.status(200).json(ApiResponse.success(doctors, 'Public doctors fetched successfully'));
  }

  // GET /api/v1/public/doctors/:slug
  static async getDoctorBySlug(req: Request, res: Response) {
    const doctor = await Doctor.findOne({ slug: req.params.slug, status: 'ACTIVE' })
      .populate('departmentId', 'title slug overview')
      .populate('assignedBranchIds', 'name code address contact')
      .select('-__v -createdAt -updatedAt -isDeleted');

    if (!doctor) throw ApiError.notFound('Doctor not found or unavailable');
    return res.status(200).json(ApiResponse.success(doctor, 'Doctor profile fetched successfully'));
  }

  // GET /api/v1/public/departments
  static async getDepartments(req: Request, res: Response) {
    const departments = await Department.find({ status: 'ACTIVE' }).select('title slug code tagline overview icon photo isFeatured');
    return res.status(200).json(ApiResponse.success(departments, 'Public departments fetched successfully'));
  }

  // GET /api/v1/public/packages
  static async getPackages(req: Request, res: Response) {
    const packages = await CarePackage.find({ status: 'ACTIVE' }).select('title slug subtitle durationDays overview inclusions targetAilments price isFeatured image assignedBranchIds');
    return res.status(200).json(ApiResponse.success(packages, 'Public care packages fetched successfully'));
  }

  // GET /api/v1/public/packages/:slug
  static async getPackageBySlug(req: Request, res: Response) {
    const carePackage = await CarePackage.findOne({ slug: req.params.slug, status: 'ACTIVE' })
      .populate('assignedBranchIds', 'name code address')
      .select('-__v -createdAt -updatedAt -isDeleted');

    if (!carePackage) throw ApiError.notFound('Care package not found');
    return res.status(200).json(ApiResponse.success(carePackage, 'Care package fetched successfully'));
  }

  // GET /api/v1/public/blogs
  static async getBlogs(req: Request, res: Response) {
    const blogs = await Blog.find({ status: 'PUBLISHED' }).select('title slug excerpt coverImage authorName category readTimeMinutes publishedAt isFeatured');
    return res.status(200).json(ApiResponse.success(blogs, 'Public blogs fetched successfully'));
  }

  // GET /api/v1/public/blogs/:slug
  static async getBlogBySlug(req: Request, res: Response) {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'PUBLISHED' }).select('-__v -createdAt -updatedAt -isDeleted');
    if (!blog) throw ApiError.notFound('Article not found');
    return res.status(200).json(ApiResponse.success(blog, 'Article fetched successfully'));
  }

  // GET /api/v1/public/facilities
  static async getFacilities(req: Request, res: Response) {
    const facilities = await Infrastructure.find({ status: 'ACTIVE' }).populate('branchId', 'name code').select('-__v -createdAt -updatedAt -isDeleted');
    return res.status(200).json(ApiResponse.success(facilities, 'Facilities fetched successfully'));
  }

  // GET /api/v1/public/testimonials
  static async getTestimonials(req: Request, res: Response) {
    const testimonials = await Testimonial.find({ status: 'ACTIVE' }).select('-__v -createdAt -updatedAt -isDeleted');
    return res.status(200).json(ApiResponse.success(testimonials, 'Testimonials fetched successfully'));
  }

  // GET /api/v1/public/faqs
  static async getFaqs(req: Request, res: Response) {
    const faqs = await FAQ.find({ status: 'ACTIVE' }).select('-__v -createdAt -updatedAt -isDeleted');
    return res.status(200).json(ApiResponse.success(faqs, 'FAQs fetched successfully'));
  }

  // POST /api/v1/public/appointment - Anonymous Public Booking Request
  static async bookAppointment(req: Request, res: Response) {
    const { patientName, patientPhone, patientEmail, preferredBranchCode, preferredDoctorId, preferredDate, timeSlot, preferredTimeSlot, symptomsNote } = req.body;

    if (!patientName || !patientPhone || !preferredBranchCode) {
      throw ApiError.badRequest('Patient Name, Phone, and Preferred Branch Code are required');
    }

    const branch = await Branch.findOne({ code: preferredBranchCode.toUpperCase() });
    if (!branch) throw ApiError.badRequest('Invalid Branch Code');

    const apptNumber = `SUS-${Math.floor(100000 + Math.random() * 900000)}`;
    const slot = preferredTimeSlot || timeSlot || '09:00 AM';

    const appointment = await Appointment.create({
      appointmentNumber: apptNumber,
      patientName,
      patientPhone,
      patientEmail,
      branchId: branch._id,
      doctorId: preferredDoctorId && preferredDoctorId.length === 24 ? preferredDoctorId : undefined,
      preferredDate: preferredDate ? new Date(preferredDate) : new Date(),
      preferredTimeSlot: slot,
      symptomsNote: symptomsNote || '',
      status: 'PENDING',
    });

    return res.status(201).json(ApiResponse.success({
      appointmentNumber: appointment.appointmentNumber,
      patientName: appointment.patientName,
      status: appointment.status,
      message: 'Your appointment request has been registered. Our reception desk will contact you to confirm.',
    }, 'Appointment booked successfully'));
  }

  // POST /api/v1/public/contact - Public Inquiry Lead Submission
  static async submitLead(req: Request, res: Response) {
    let { name, phone, email, subject, message, preferredBranchCode } = req.body;
    if (!name || !phone || !message) {
      throw ApiError.badRequest('Name, Phone, and Message are required');
    }

    let branchId = null;
    if (preferredBranchCode) {
      const branch = await Branch.findOne({ code: preferredBranchCode.toUpperCase() });
      if (branch) branchId = branch._id;
    }

    // Resolve any 24-character Mongo IDs in message or subject to Care Package titles
    const mongoIdRegex = /\b[0-9a-fA-F]{24}\b/g;
    const matches = message.match(mongoIdRegex);
    if (matches && matches.length > 0) {
      for (const rawId of matches) {
        const pkg = await CarePackage.findById(rawId);
        if (pkg) {
          message = message.replace(rawId, pkg.title);
          if (subject) subject = subject.replace(rawId, pkg.title);
        }
      }
    }

    const lead = await Lead.create({
      name,
      phone,
      email,
      subject: subject || 'General Enquiry',
      message,
      branchId,
      status: 'NEW',
    });

    return res.status(201).json(ApiResponse.success({ id: lead._id, message: 'Thank you for reaching out. We will get back to you shortly.' }, 'Lead submitted successfully'));
  }

  // POST /api/v1/public/feedback - Dedicated Public Patient Feedback Endpoint
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
    const conditions = await Condition.find({ status: 'published', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted');
    return res.status(200).json(ApiResponse.success(conditions, 'Public conditions fetched successfully'));
  }

  // GET /api/v1/public/conditions/:slug
  static async getConditionBySlug(req: Request, res: Response) {
    const condition = await Condition.findOne({ slug: req.params.slug, status: 'published', isDeleted: false })
      .populate('assignedBranchIds', 'name code address')
      .select('-__v -createdAt -updatedAt -isDeleted');
    if (!condition) throw ApiError.notFound('Condition not found');
    return res.status(200).json(ApiResponse.success(condition, 'Condition fetched successfully'));
  }

  // GET /api/v1/public/treatments
  static async getTreatments(req: Request, res: Response) {
    const treatments = await Treatment.find({ status: 'published', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted');
    return res.status(200).json(ApiResponse.success(treatments, 'Public treatments fetched successfully'));
  }

  // GET /api/v1/public/treatments/:slug
  static async getTreatmentBySlug(req: Request, res: Response) {
    const treatment = await Treatment.findOne({ slug: req.params.slug, status: 'published', isDeleted: false })
      .populate('assignedBranchIds', 'name code address')
      .select('-__v -createdAt -updatedAt -isDeleted');
    if (!treatment) throw ApiError.notFound('Treatment not found');
    return res.status(200).json(ApiResponse.success(treatment, 'Treatment fetched successfully'));
  }

  // GET /api/v1/public/ecosystem
  static async getEcosystemPillars(req: Request, res: Response) {
    const Ecosystem = require('../../models/Ecosystem.model').default;
    const pillars = await Ecosystem.find({ status: 'published', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted');
    return res.status(200).json(ApiResponse.success(pillars, 'Public ecosystem pillars fetched successfully'));
  }

  // GET /api/v1/public/ecosystem/:slug
  static async getEcosystemPillarBySlug(req: Request, res: Response) {
    const Ecosystem = require('../../models/Ecosystem.model').default;
    const pillar = await Ecosystem.findOne({ slug: req.params.slug, status: 'published', isDeleted: false }).select('-__v -createdAt -updatedAt -isDeleted');
    if (!pillar) throw ApiError.notFound('Ecosystem pillar not found');
    return res.status(200).json(ApiResponse.success(pillar, 'Ecosystem pillar fetched successfully'));
  }

  // GET /api/v1/public/videos
  static async getVideos(req: Request, res: Response) {
    const Video = require('../../models/Video.model').default;
    const videos = await Video.find({ status: 'published', isDeleted: false }).sort({ sortOrder: 1 }).select('-__v -createdAt -updatedAt -isDeleted');
    return res.status(200).json(ApiResponse.success(videos, 'Public videos fetched successfully'));
  }

  // GET /api/v1/public/affiliations
  static async getAffiliations(req: Request, res: Response) {
    const Affiliation = require('../../models/Affiliation.model').default;
    const affiliations = await Affiliation.find({ status: 'published', isDeleted: false }).sort({ sortOrder: 1 }).select('-__v -createdAt -updatedAt -isDeleted');
    return res.status(200).json(ApiResponse.success(affiliations, 'Public affiliations fetched successfully'));
  }
}

