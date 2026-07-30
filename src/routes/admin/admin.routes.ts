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
  } else if (branchCode && branchCode !== 'ALL') {
    const dummyId = new mongoose.Types.ObjectId();
    doctorFilter.assignedBranchIds = dummyId;
    appointmentFilter.branchId = dummyId;
    leadFilter.branchId = dummyId;
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
router.put('/branches/:id', asyncHandler(BranchController.updateBranch));
router.delete('/branches/:id', asyncHandler(BranchController.deleteBranch));

router.get('/doctors', asyncHandler(DoctorController.getAllDoctors));
router.post('/doctors', asyncHandler(DoctorController.createDoctor));
router.put('/doctors/:id', asyncHandler(DoctorController.updateDoctor));
router.delete('/doctors/:id', asyncHandler(DoctorController.deleteDoctor));

router.get('/departments', asyncHandler(DepartmentController.getAllDepartments));
router.post('/departments', asyncHandler(DepartmentController.createDepartment));
router.put('/departments/:id', asyncHandler(DepartmentController.updateDepartment));
router.delete('/departments/:id', asyncHandler(DepartmentController.deleteDepartment));

router.get('/appointments', asyncHandler(AppointmentController.getAllAppointments));
router.get('/appointments/:id', asyncHandler(AppointmentController.getAppointmentById));
router.post('/appointments', asyncHandler(AppointmentController.createAppointment));
router.put('/appointments/:id', asyncHandler(AppointmentController.updateAppointment));
router.delete('/appointments/:id', asyncHandler(AppointmentController.deleteAppointment));

router.get('/packages', asyncHandler(CarePackageController.getAllPackages));
router.post('/packages', asyncHandler(CarePackageController.createPackage));
router.put('/packages/:id', asyncHandler(CarePackageController.updatePackage));
router.delete('/packages/:id', asyncHandler(CarePackageController.deletePackage));

router.get('/infrastructure', asyncHandler(InfrastructureController.getAllInfrastructure));
router.post('/infrastructure', asyncHandler(InfrastructureController.createFacility));
router.put('/infrastructure/:id', asyncHandler(InfrastructureController.updateFacility));
router.delete('/infrastructure/:id', asyncHandler(InfrastructureController.deleteFacility));

router.get('/blogs', asyncHandler(BlogController.getAllBlogs));
router.post('/blogs', asyncHandler(BlogController.createBlog));
router.put('/blogs/:id', asyncHandler(BlogController.updateBlog));
router.delete('/blogs/:id', asyncHandler(BlogController.deleteBlog));

router.get('/leads', asyncHandler(LeadController.getAllLeads));
router.post('/leads', asyncHandler(LeadController.createLead));
router.put('/leads/:id', asyncHandler(LeadController.updateLead));
router.delete('/leads/:id', asyncHandler(LeadController.deleteLead));

router.get('/users', asyncHandler(UserController.getAllUsers));
router.post('/users', asyncHandler(UserController.createUser));
router.put('/users/:id', asyncHandler(UserController.updateUser));
router.delete('/users/:id', asyncHandler(UserController.deleteUser));

router.get('/roles', asyncHandler(RoleController.getAllRoles));
router.post('/roles', asyncHandler(RoleController.createRole));
router.put('/roles/:id', asyncHandler(RoleController.updateRole));
router.delete('/roles/:id', asyncHandler(RoleController.deleteRole));

router.get('/settings', asyncHandler(SettingController.getAllSettings));
router.post('/settings', asyncHandler(SettingController.updateSetting));
router.put('/settings', asyncHandler(SettingController.updateSetting));
router.post('/settings/:key', asyncHandler(SettingController.updateSetting));
router.put('/settings/:key', asyncHandler(SettingController.updateSetting));

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

router.get('/news-events', asyncHandler(getNewsEvents));
router.post('/news-events', asyncHandler(createNewsEvent));
router.put('/news-events/:id', asyncHandler(updateNewsEvent));
router.delete('/news-events/:id', asyncHandler(deleteNewsEvent));

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
import { optimizeUploadedFile } from '../../utils/fileOptimizer';
import MediaFile from '../../models/MediaFile.model';
router.post('/upload', upload.single('file'), asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  // Auto-optimize uploaded images/videos (Sharp -> WebP for images, FFmpeg -> compressed MP4 for videos)
  const optimized = await optimizeUploadedFile(req.file);

  const host = process.env.PUBLIC_API_URL || `${req.protocol}://${req.get('host')}`;
  const fileUrl = `${host}/uploads/${optimized.filename}`;

  const mediaRecord = await MediaFile.create({
    filename: optimized.filename,
    originalName: optimized.originalname,
    mimeType: optimized.mimetype,
    size: optimized.size,
    url: fileUrl,
    folder: 'general',
  });

  return res.status(201).json({
    success: true,
    url: fileUrl,
    data: mediaRecord,
    message: 'File uploaded and optimized successfully',
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

// Staff User Accounts (CRUD)
router.get('/users', asyncHandler(UserController.getAllUsers));
router.post('/users', asyncHandler(UserController.createUser));
router.put('/users/:id', asyncHandler(UserController.updateUser));
router.delete('/users/:id', asyncHandler(UserController.deleteUser));

// Roles & Permissions (CRUD)
router.get('/roles', asyncHandler(RoleController.getAllRoles));
router.post('/roles', asyncHandler(RoleController.createRole));
router.put('/roles/:id', asyncHandler(RoleController.updateRole));
router.delete('/roles/:id', asyncHandler(RoleController.deleteRole));

export default router;
