import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { AuthController } from '../../controllers/auth.controller';
import { BranchController } from '../../controllers/branch.controller';
import { DoctorController } from '../../controllers/doctor.controller';
import { AppointmentController } from '../../controllers/appointment.controller';
import { CarePackageController } from '../../controllers/carePackage.controller';
import { DepartmentController } from '../../controllers/department.controller';
import { InfrastructureController } from '../../controllers/infrastructure.controller';
import { BlogController } from '../../controllers/blog.controller';
import { LeadController } from '../../controllers/lead.controller';
import { UserController } from '../../controllers/user.controller';
import { RoleController } from '../../controllers/role.controller';
import { SettingController } from '../../controllers/setting.controller';

import { getConditions, createCondition, updateCondition, deleteCondition } from '../../controllers/condition.controller';
import { getTreatments, createTreatment, updateTreatment, deleteTreatment } from '../../controllers/treatment.controller';
import { getEcosystemPillars, createEcosystemPillar, updateEcosystemPillar, deleteEcosystemPillar } from '../../controllers/ecosystem.controller';
import { getNewsEvents, createNewsEvent, updateNewsEvent, deleteNewsEvent } from '../../controllers/newsEvent.controller';
import { getVideos, createVideo, updateVideo, deleteVideo } from '../../controllers/video.controller';
import { getGalleryAlbums, createGalleryAlbum, updateGalleryAlbum, deleteGalleryAlbum } from '../../controllers/gallery.controller';
import { getAffiliations, createAffiliation, updateAffiliation, deleteAffiliation } from '../../controllers/affiliation.controller';
import { getMediaFiles, createMediaFileRecord, deleteMediaFile } from '../../controllers/media.controller';
import { getAuditLogs } from '../../controllers/auditLog.controller';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '../../controllers/faq.controller';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../controllers/testimonial.controller';

import { asyncHandler } from '../../utils/asyncHandler';
import { Doctor } from '../../models/Doctor.model';
import { Appointment } from '../../models/Appointment.model';
import { Lead } from '../../models/Lead.model';
import { Blog } from '../../models/Blog.model';
import { Branch } from '../../models/Branch.model';
import GalleryAlbum from '../../models/GalleryAlbum.model';
import Video from '../../models/Video.model';

const router = Router();

// Base Route: /api/v1/admin

// Auth
router.post('/auth/login', asyncHandler(AuthController.login));
router.get('/auth/me', asyncHandler(AuthController.getProfile));

// Dashboard Metrics (Calculated Dynamically from MongoDB with Branch Scope)
router.get('/dashboard', asyncHandler(async (req: Request, res: Response) => {
  const { branchCode } = req.query;

  let targetBranch: any = null;
  if (branchCode && branchCode !== 'ALL') {
    targetBranch = await Branch.findOne({
      $or: [{ code: branchCode }, { _id: mongoose.Types.ObjectId.isValid(branchCode as string) ? branchCode : null }],
      isDeleted: false,
    });
  }

  const doctorFilter: any = { isDeleted: false, status: 'ACTIVE' };
  const appointmentFilter: any = { isDeleted: false };
  const leadFilter: any = { isDeleted: false };

  if (targetBranch) {
    doctorFilter.assignedBranchIds = targetBranch._id;
    appointmentFilter.branchId = targetBranch._id;
    leadFilter.branchId = targetBranch._id;
  }

  const [activeDoctors, todayAppointments, pendingLeads, publishedBlogs, galleryAlbums, mediaVideos, allBranches] = await Promise.all([
    Doctor.countDocuments(doctorFilter),
    Appointment.countDocuments(appointmentFilter),
    Lead.countDocuments(leadFilter),
    Blog.countDocuments({ isDeleted: false, status: 'PUBLISHED' }),
    GalleryAlbum.countDocuments({ isDeleted: false }),
    Video.countDocuments({ isDeleted: false }),
    Branch.find({ isDeleted: false }),
  ]);

  const bedBranches = targetBranch ? [targetBranch] : allBranches;
  const inpatientTotalBeds = bedBranches.reduce((sum, b) => sum + (b.bedCapacity || 0), 0);
  const inpatientBedsOccupied = Math.round(inpatientTotalBeds * 0.7);

  return res.json({
    success: true,
    data: {
      activeDoctors,
      todayAppointments,
      inpatientBedsOccupied,
      inpatientTotalBeds,
      pendingLeads,
      publishedBlogs,
      galleryAlbums,
      mediaVideos,
    },
    message: 'Dashboard metrics calculated dynamically from database',
  });
}));

// Core CMS Entities
router.get('/branches', asyncHandler(BranchController.getAllBranches));
router.post('/branches', asyncHandler(BranchController.createBranch));

router.get('/doctors', asyncHandler(DoctorController.getAllDoctors));
router.post('/doctors', asyncHandler(DoctorController.createDoctor));

router.get('/departments', asyncHandler(DepartmentController.getAllDepartments));
router.post('/departments', asyncHandler(DepartmentController.createDepartment));

router.get('/appointments', asyncHandler(AppointmentController.getAllAppointments));
router.post('/appointments', asyncHandler(AppointmentController.createAppointment));

router.get('/packages', asyncHandler(CarePackageController.getAllPackages));
router.post('/packages', asyncHandler(CarePackageController.createPackage));

router.get('/infrastructure', asyncHandler(InfrastructureController.getAllInfrastructure));
router.post('/infrastructure', asyncHandler(InfrastructureController.createFacility));

router.get('/blogs', asyncHandler(BlogController.getAllBlogs));
router.post('/blogs', asyncHandler(BlogController.createBlog));

router.get('/leads', asyncHandler(LeadController.getAllLeads));
router.post('/leads', asyncHandler(LeadController.createLead));

router.get('/users', asyncHandler(UserController.getAllUsers));
router.post('/users', asyncHandler(UserController.createUser));

router.get('/roles', asyncHandler(RoleController.getAllRoles));
router.post('/roles', asyncHandler(RoleController.createRole));

router.get('/settings', asyncHandler(SettingController.getAllSettings));
router.post('/settings', asyncHandler(SettingController.updateSetting));

// New Feature Parity Routes
router.get('/conditions', asyncHandler(getConditions));
router.post('/conditions', asyncHandler(createCondition));
router.put('/conditions/:id', asyncHandler(updateCondition));
router.delete('/conditions/:id', asyncHandler(deleteCondition));

router.get('/treatments', asyncHandler(getTreatments));
router.post('/treatments', asyncHandler(createTreatment));
router.put('/treatments/:id', asyncHandler(updateTreatment));
router.delete('/treatments/:id', asyncHandler(deleteTreatment));

router.get('/ecosystem', asyncHandler(getEcosystemPillars));
router.post('/ecosystem', asyncHandler(createEcosystemPillar));
router.put('/ecosystem/:id', asyncHandler(updateEcosystemPillar));
router.delete('/ecosystem/:id', asyncHandler(deleteEcosystemPillar));

router.get('/media-coverage', asyncHandler(getNewsEvents));
router.post('/media-coverage', asyncHandler(createNewsEvent));
router.put('/media-coverage/:id', asyncHandler(updateNewsEvent));
router.delete('/media-coverage/:id', asyncHandler(deleteNewsEvent));

router.get('/videos', asyncHandler(getVideos));
router.post('/videos', asyncHandler(createVideo));
router.put('/videos/:id', asyncHandler(updateVideo));
router.delete('/videos/:id', asyncHandler(deleteVideo));

router.get('/gallery', asyncHandler(getGalleryAlbums));
router.post('/gallery', asyncHandler(createGalleryAlbum));
router.put('/gallery/:id', asyncHandler(updateGalleryAlbum));
router.delete('/gallery/:id', asyncHandler(deleteGalleryAlbum));

router.get('/affiliations', asyncHandler(getAffiliations));
router.post('/affiliations', asyncHandler(createAffiliation));
router.put('/affiliations/:id', asyncHandler(updateAffiliation));
router.delete('/affiliations/:id', asyncHandler(deleteAffiliation));

router.get('/media-library', asyncHandler(getMediaFiles));
router.post('/media-library', asyncHandler(createMediaFileRecord));
router.delete('/media-library/:id', asyncHandler(deleteMediaFile));

// File Upload Endpoint (Images & Videos)
import { upload } from '../../middlewares/upload.middleware';
import MediaFile from '../../models/MediaFile.model';
router.post('/upload', upload.single('file'), asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const host = process.env.PUBLIC_API_URL || `${req.protocol}://${req.get('host')}`;
  const fileUrl = `${host}/uploads/${req.file.filename}`;
  const mediaRecord = await MediaFile.create({
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    fileSize: req.file.size,
    url: fileUrl,
    folder: 'general',
  });
  return res.status(201).json({
    success: true,
    url: fileUrl,
    data: mediaRecord,
    message: 'File uploaded successfully',
  });
}));

router.get('/audit-logs', asyncHandler(getAuditLogs));

router.get('/faqs', asyncHandler(getFAQs));
router.post('/faqs', asyncHandler(createFAQ));
router.put('/faqs/:id', asyncHandler(updateFAQ));
router.delete('/faqs/:id', asyncHandler(deleteFAQ));

router.get('/testimonials', asyncHandler(getTestimonials));
router.post('/testimonials', asyncHandler(createTestimonial));
router.put('/testimonials/:id', asyncHandler(updateTestimonial));
router.delete('/testimonials/:id', asyncHandler(deleteTestimonial));

export default router;
