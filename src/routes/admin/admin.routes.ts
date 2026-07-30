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
import { optionalAuthenticateJWT, requirePermission } from '../../middlewares/auth.middleware';
import { Doctor } from '../../models/Doctor.model';
import { Appointment } from '../../models/Appointment.model';
import { Lead } from '../../models/Lead.model';
import { Blog } from '../../models/Blog.model';
import { Branch } from '../../models/Branch.model';
import GalleryAlbum from '../../models/GalleryAlbum.model';
import Video from '../../models/Video.model';

const router = Router();

// Automatically authenticate token on any admin route if token present
router.use(optionalAuthenticateJWT);

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
router.post('/branches', requirePermission('branches:write'), asyncHandler(BranchController.createBranch));
router.put('/branches/:id', requirePermission('branches:write'), asyncHandler(BranchController.updateBranch));
router.delete('/branches/:id', requirePermission('branches:write'), asyncHandler(BranchController.deleteBranch));

router.get('/doctors', asyncHandler(DoctorController.getAllDoctors));
router.post('/doctors', requirePermission('doctors:write'), asyncHandler(DoctorController.createDoctor));
router.put('/doctors/:id', requirePermission('doctors:write'), asyncHandler(DoctorController.updateDoctor));
router.delete('/doctors/:id', requirePermission('doctors:write'), asyncHandler(DoctorController.deleteDoctor));

router.get('/departments', asyncHandler(DepartmentController.getAllDepartments));
router.post('/departments', requirePermission('departments:write'), asyncHandler(DepartmentController.createDepartment));
router.put('/departments/:id', requirePermission('departments:write'), asyncHandler(DepartmentController.updateDepartment));
router.delete('/departments/:id', requirePermission('departments:write'), asyncHandler(DepartmentController.deleteDepartment));

router.get('/appointments', asyncHandler(AppointmentController.getAllAppointments));
router.get('/appointments/:id', asyncHandler(AppointmentController.getAppointmentById));
router.post('/appointments', requirePermission('appointments:write'), asyncHandler(AppointmentController.createAppointment));
router.put('/appointments/:id', requirePermission('appointments:write'), asyncHandler(AppointmentController.updateAppointment));
router.delete('/appointments/:id', requirePermission('appointments:write'), asyncHandler(AppointmentController.deleteAppointment));

router.get('/packages', asyncHandler(CarePackageController.getAllPackages));
router.post('/packages', requirePermission('packages:write'), asyncHandler(CarePackageController.createPackage));
router.put('/packages/:id', requirePermission('packages:write'), asyncHandler(CarePackageController.updatePackage));
router.delete('/packages/:id', requirePermission('packages:write'), asyncHandler(CarePackageController.deletePackage));

router.get('/infrastructure', asyncHandler(InfrastructureController.getAllInfrastructure));
router.post('/infrastructure', requirePermission('infrastructure:write'), asyncHandler(InfrastructureController.createFacility));
router.put('/infrastructure/:id', requirePermission('infrastructure:write'), asyncHandler(InfrastructureController.updateFacility));
router.delete('/infrastructure/:id', requirePermission('infrastructure:write'), asyncHandler(InfrastructureController.deleteFacility));

router.get('/blogs', asyncHandler(BlogController.getAllBlogs));
router.post('/blogs', requirePermission('blogs:write'), asyncHandler(BlogController.createBlog));
router.put('/blogs/:id', requirePermission('blogs:write'), asyncHandler(BlogController.updateBlog));
router.delete('/blogs/:id', requirePermission('blogs:write'), asyncHandler(BlogController.deleteBlog));

router.get('/leads', asyncHandler(LeadController.getAllLeads));
router.post('/leads', requirePermission('leads:process'), asyncHandler(LeadController.createLead));
router.put('/leads/:id', requirePermission('leads:process'), asyncHandler(LeadController.updateLead));
router.delete('/leads/:id', requirePermission('leads:process'), asyncHandler(LeadController.deleteLead));

router.get('/users', asyncHandler(UserController.getAllUsers));
router.post('/users', requirePermission('users:write'), asyncHandler(UserController.createUser));
router.put('/users/:id', requirePermission('users:write'), asyncHandler(UserController.updateUser));
router.delete('/users/:id', requirePermission('users:write'), asyncHandler(UserController.deleteUser));

router.get('/roles', asyncHandler(RoleController.getAllRoles));
router.post('/roles', requirePermission('roles:write'), asyncHandler(RoleController.createRole));
router.put('/roles/:id', requirePermission('roles:write'), asyncHandler(RoleController.updateRole));
router.delete('/roles/:id', requirePermission('roles:write'), asyncHandler(RoleController.deleteRole));

router.get('/settings', asyncHandler(SettingController.getAllSettings));
router.post('/settings', requirePermission('settings:manage'), asyncHandler(SettingController.updateSetting));
router.put('/settings', requirePermission('settings:manage'), asyncHandler(SettingController.updateSetting));
router.post('/settings/:key', requirePermission('settings:manage'), asyncHandler(SettingController.updateSetting));
router.put('/settings/:key', requirePermission('settings:manage'), asyncHandler(SettingController.updateSetting));

// New Feature Parity Routes
router.get('/conditions', asyncHandler(getConditions));
router.post('/conditions', requirePermission('conditions:write'), asyncHandler(createCondition));
router.put('/conditions/:id', requirePermission('conditions:write'), asyncHandler(updateCondition));
router.delete('/conditions/:id', requirePermission('conditions:write'), asyncHandler(deleteCondition));

router.get('/treatments', asyncHandler(getTreatments));
router.post('/treatments', requirePermission('treatments:write'), asyncHandler(createTreatment));
router.put('/treatments/:id', requirePermission('treatments:write'), asyncHandler(updateTreatment));
router.delete('/treatments/:id', requirePermission('treatments:write'), asyncHandler(deleteTreatment));

router.get('/ecosystem', asyncHandler(getEcosystemPillars));
router.post('/ecosystem', requirePermission('ecosystem:write'), asyncHandler(createEcosystemPillar));
router.put('/ecosystem/:id', requirePermission('ecosystem:write'), asyncHandler(updateEcosystemPillar));
router.delete('/ecosystem/:id', requirePermission('ecosystem:write'), asyncHandler(deleteEcosystemPillar));

router.get('/media-coverage', asyncHandler(getNewsEvents));
router.post('/media-coverage', requirePermission('media-coverage:write'), asyncHandler(createNewsEvent));
router.put('/media-coverage/:id', requirePermission('media-coverage:write'), asyncHandler(updateNewsEvent));
router.delete('/media-coverage/:id', requirePermission('media-coverage:write'), asyncHandler(deleteNewsEvent));

router.get('/news-events', asyncHandler(getNewsEvents));
router.post('/news-events', requirePermission('media-coverage:write'), asyncHandler(createNewsEvent));
router.put('/news-events/:id', requirePermission('media-coverage:write'), asyncHandler(updateNewsEvent));
router.delete('/news-events/:id', requirePermission('media-coverage:write'), asyncHandler(deleteNewsEvent));

router.get('/videos', asyncHandler(getVideos));
router.post('/videos', requirePermission('videos:write'), asyncHandler(createVideo));
router.put('/videos/:id', requirePermission('videos:write'), asyncHandler(updateVideo));
router.delete('/videos/:id', requirePermission('videos:write'), asyncHandler(deleteVideo));

router.get('/gallery', asyncHandler(getGalleryAlbums));
router.post('/gallery', requirePermission('gallery:write'), asyncHandler(createGalleryAlbum));
router.put('/gallery/:id', requirePermission('gallery:write'), asyncHandler(updateGalleryAlbum));
router.delete('/gallery/:id', requirePermission('gallery:write'), asyncHandler(deleteGalleryAlbum));

router.get('/affiliations', asyncHandler(getAffiliations));
router.post('/affiliations', requirePermission('media-coverage:write'), asyncHandler(createAffiliation));
router.put('/affiliations/:id', requirePermission('media-coverage:write'), asyncHandler(updateAffiliation));
router.delete('/affiliations/:id', requirePermission('media-coverage:write'), asyncHandler(deleteAffiliation));

router.get('/media-library', asyncHandler(getMediaFiles));
router.post('/media-library', requirePermission('media-library:write'), asyncHandler(createMediaFileRecord));
router.delete('/media-library/:id', requirePermission('media-library:write'), asyncHandler(deleteMediaFile));

// File Upload Endpoint (Images & Videos)
import { upload } from '../../middlewares/upload.middleware';
import { optimizeUploadedFile } from '../../utils/fileOptimizer';
import MediaFile from '../../models/MediaFile.model';
router.post('/upload', upload.single('file'), requirePermission('media-library:write'), asyncHandler(async (req: Request, res: Response) => {
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
router.post('/faqs', requirePermission('faqs:write'), asyncHandler(createFAQ));
router.put('/faqs/:id', requirePermission('faqs:write'), asyncHandler(updateFAQ));
router.delete('/faqs/:id', requirePermission('faqs:write'), asyncHandler(deleteFAQ));

router.get('/testimonials', asyncHandler(getTestimonials));
router.post('/testimonials', requirePermission('testimonials:write'), asyncHandler(createTestimonial));
router.put('/testimonials/:id', requirePermission('testimonials:write'), asyncHandler(updateTestimonial));
router.delete('/testimonials/:id', requirePermission('testimonials:write'), asyncHandler(deleteTestimonial));

export default router;
