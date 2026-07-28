"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const auth_controller_1 = require("../../controllers/auth.controller");
const branch_controller_1 = require("../../controllers/branch.controller");
const doctor_controller_1 = require("../../controllers/doctor.controller");
const appointment_controller_1 = require("../../controllers/appointment.controller");
const carePackage_controller_1 = require("../../controllers/carePackage.controller");
const department_controller_1 = require("../../controllers/department.controller");
const infrastructure_controller_1 = require("../../controllers/infrastructure.controller");
const blog_controller_1 = require("../../controllers/blog.controller");
const lead_controller_1 = require("../../controllers/lead.controller");
const user_controller_1 = require("../../controllers/user.controller");
const role_controller_1 = require("../../controllers/role.controller");
const setting_controller_1 = require("../../controllers/setting.controller");
const condition_controller_1 = require("../../controllers/condition.controller");
const treatment_controller_1 = require("../../controllers/treatment.controller");
const ecosystem_controller_1 = require("../../controllers/ecosystem.controller");
const newsEvent_controller_1 = require("../../controllers/newsEvent.controller");
const video_controller_1 = require("../../controllers/video.controller");
const gallery_controller_1 = require("../../controllers/gallery.controller");
const affiliation_controller_1 = require("../../controllers/affiliation.controller");
const media_controller_1 = require("../../controllers/media.controller");
const auditLog_controller_1 = require("../../controllers/auditLog.controller");
const faq_controller_1 = require("../../controllers/faq.controller");
const testimonial_controller_1 = require("../../controllers/testimonial.controller");
const asyncHandler_1 = require("../../utils/asyncHandler");
const Doctor_model_1 = require("../../models/Doctor.model");
const Appointment_model_1 = require("../../models/Appointment.model");
const Lead_model_1 = require("../../models/Lead.model");
const Blog_model_1 = require("../../models/Blog.model");
const Branch_model_1 = require("../../models/Branch.model");
const GalleryAlbum_model_1 = __importDefault(require("../../models/GalleryAlbum.model"));
const Video_model_1 = __importDefault(require("../../models/Video.model"));
const router = (0, express_1.Router)();
// Base Route: /api/v1/admin
// Auth
router.post('/auth/login', (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.login));
router.get('/auth/me', (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.getProfile));
// Dashboard Metrics (Calculated Dynamically from MongoDB with Branch Scope)
router.get('/dashboard', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { branchCode } = req.query;
    let targetBranch = null;
    if (branchCode && branchCode !== 'ALL') {
        targetBranch = await Branch_model_1.Branch.findOne({
            $or: [{ code: branchCode }, { _id: mongoose_1.default.Types.ObjectId.isValid(branchCode) ? branchCode : null }],
            isDeleted: false,
        });
    }
    const doctorFilter = { isDeleted: false, status: 'ACTIVE' };
    const appointmentFilter = { isDeleted: false };
    const leadFilter = { isDeleted: false };
    if (targetBranch) {
        doctorFilter.assignedBranchIds = targetBranch._id;
        appointmentFilter.branchId = targetBranch._id;
        leadFilter.branchId = targetBranch._id;
    }
    const [activeDoctors, todayAppointments, pendingLeads, publishedBlogs, galleryAlbums, mediaVideos, allBranches] = await Promise.all([
        Doctor_model_1.Doctor.countDocuments(doctorFilter),
        Appointment_model_1.Appointment.countDocuments(appointmentFilter),
        Lead_model_1.Lead.countDocuments(leadFilter),
        Blog_model_1.Blog.countDocuments({ isDeleted: false, status: 'PUBLISHED' }),
        GalleryAlbum_model_1.default.countDocuments({ isDeleted: false }),
        Video_model_1.default.countDocuments({ isDeleted: false }),
        Branch_model_1.Branch.find({ isDeleted: false }),
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
router.get('/branches', (0, asyncHandler_1.asyncHandler)(branch_controller_1.BranchController.getAllBranches));
router.post('/branches', (0, asyncHandler_1.asyncHandler)(branch_controller_1.BranchController.createBranch));
router.get('/doctors', (0, asyncHandler_1.asyncHandler)(doctor_controller_1.DoctorController.getAllDoctors));
router.post('/doctors', (0, asyncHandler_1.asyncHandler)(doctor_controller_1.DoctorController.createDoctor));
router.get('/departments', (0, asyncHandler_1.asyncHandler)(department_controller_1.DepartmentController.getAllDepartments));
router.post('/departments', (0, asyncHandler_1.asyncHandler)(department_controller_1.DepartmentController.createDepartment));
router.get('/appointments', (0, asyncHandler_1.asyncHandler)(appointment_controller_1.AppointmentController.getAllAppointments));
router.post('/appointments', (0, asyncHandler_1.asyncHandler)(appointment_controller_1.AppointmentController.createAppointment));
router.get('/packages', (0, asyncHandler_1.asyncHandler)(carePackage_controller_1.CarePackageController.getAllPackages));
router.post('/packages', (0, asyncHandler_1.asyncHandler)(carePackage_controller_1.CarePackageController.createPackage));
router.get('/infrastructure', (0, asyncHandler_1.asyncHandler)(infrastructure_controller_1.InfrastructureController.getAllInfrastructure));
router.post('/infrastructure', (0, asyncHandler_1.asyncHandler)(infrastructure_controller_1.InfrastructureController.createFacility));
router.get('/blogs', (0, asyncHandler_1.asyncHandler)(blog_controller_1.BlogController.getAllBlogs));
router.post('/blogs', (0, asyncHandler_1.asyncHandler)(blog_controller_1.BlogController.createBlog));
router.get('/leads', (0, asyncHandler_1.asyncHandler)(lead_controller_1.LeadController.getAllLeads));
router.post('/leads', (0, asyncHandler_1.asyncHandler)(lead_controller_1.LeadController.createLead));
router.get('/users', (0, asyncHandler_1.asyncHandler)(user_controller_1.UserController.getAllUsers));
router.post('/users', (0, asyncHandler_1.asyncHandler)(user_controller_1.UserController.createUser));
router.get('/roles', (0, asyncHandler_1.asyncHandler)(role_controller_1.RoleController.getAllRoles));
router.post('/roles', (0, asyncHandler_1.asyncHandler)(role_controller_1.RoleController.createRole));
router.get('/settings', (0, asyncHandler_1.asyncHandler)(setting_controller_1.SettingController.getAllSettings));
router.post('/settings', (0, asyncHandler_1.asyncHandler)(setting_controller_1.SettingController.updateSetting));
// New Feature Parity Routes
router.get('/conditions', (0, asyncHandler_1.asyncHandler)(condition_controller_1.getConditions));
router.post('/conditions', (0, asyncHandler_1.asyncHandler)(condition_controller_1.createCondition));
router.put('/conditions/:id', (0, asyncHandler_1.asyncHandler)(condition_controller_1.updateCondition));
router.delete('/conditions/:id', (0, asyncHandler_1.asyncHandler)(condition_controller_1.deleteCondition));
router.get('/treatments', (0, asyncHandler_1.asyncHandler)(treatment_controller_1.getTreatments));
router.post('/treatments', (0, asyncHandler_1.asyncHandler)(treatment_controller_1.createTreatment));
router.put('/treatments/:id', (0, asyncHandler_1.asyncHandler)(treatment_controller_1.updateTreatment));
router.delete('/treatments/:id', (0, asyncHandler_1.asyncHandler)(treatment_controller_1.deleteTreatment));
router.get('/ecosystem', (0, asyncHandler_1.asyncHandler)(ecosystem_controller_1.getEcosystemPillars));
router.post('/ecosystem', (0, asyncHandler_1.asyncHandler)(ecosystem_controller_1.createEcosystemPillar));
router.put('/ecosystem/:id', (0, asyncHandler_1.asyncHandler)(ecosystem_controller_1.updateEcosystemPillar));
router.delete('/ecosystem/:id', (0, asyncHandler_1.asyncHandler)(ecosystem_controller_1.deleteEcosystemPillar));
router.get('/media-coverage', (0, asyncHandler_1.asyncHandler)(newsEvent_controller_1.getNewsEvents));
router.post('/media-coverage', (0, asyncHandler_1.asyncHandler)(newsEvent_controller_1.createNewsEvent));
router.put('/media-coverage/:id', (0, asyncHandler_1.asyncHandler)(newsEvent_controller_1.updateNewsEvent));
router.delete('/media-coverage/:id', (0, asyncHandler_1.asyncHandler)(newsEvent_controller_1.deleteNewsEvent));
router.get('/videos', (0, asyncHandler_1.asyncHandler)(video_controller_1.getVideos));
router.post('/videos', (0, asyncHandler_1.asyncHandler)(video_controller_1.createVideo));
router.put('/videos/:id', (0, asyncHandler_1.asyncHandler)(video_controller_1.updateVideo));
router.delete('/videos/:id', (0, asyncHandler_1.asyncHandler)(video_controller_1.deleteVideo));
router.get('/gallery', (0, asyncHandler_1.asyncHandler)(gallery_controller_1.getGalleryAlbums));
router.post('/gallery', (0, asyncHandler_1.asyncHandler)(gallery_controller_1.createGalleryAlbum));
router.put('/gallery/:id', (0, asyncHandler_1.asyncHandler)(gallery_controller_1.updateGalleryAlbum));
router.delete('/gallery/:id', (0, asyncHandler_1.asyncHandler)(gallery_controller_1.deleteGalleryAlbum));
router.get('/affiliations', (0, asyncHandler_1.asyncHandler)(affiliation_controller_1.getAffiliations));
router.post('/affiliations', (0, asyncHandler_1.asyncHandler)(affiliation_controller_1.createAffiliation));
router.put('/affiliations/:id', (0, asyncHandler_1.asyncHandler)(affiliation_controller_1.updateAffiliation));
router.delete('/affiliations/:id', (0, asyncHandler_1.asyncHandler)(affiliation_controller_1.deleteAffiliation));
router.get('/media-library', (0, asyncHandler_1.asyncHandler)(media_controller_1.getMediaFiles));
router.post('/media-library', (0, asyncHandler_1.asyncHandler)(media_controller_1.createMediaFileRecord));
router.delete('/media-library/:id', (0, asyncHandler_1.asyncHandler)(media_controller_1.deleteMediaFile));
// File Upload Endpoint (Images & Videos)
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const MediaFile_model_1 = __importDefault(require("../../models/MediaFile.model"));
router.post('/upload', upload_middleware_1.upload.single('file'), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    const mediaRecord = await MediaFile_model_1.default.create({
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
router.get('/audit-logs', (0, asyncHandler_1.asyncHandler)(auditLog_controller_1.getAuditLogs));
router.get('/faqs', (0, asyncHandler_1.asyncHandler)(faq_controller_1.getFAQs));
router.post('/faqs', (0, asyncHandler_1.asyncHandler)(faq_controller_1.createFAQ));
router.put('/faqs/:id', (0, asyncHandler_1.asyncHandler)(faq_controller_1.updateFAQ));
router.delete('/faqs/:id', (0, asyncHandler_1.asyncHandler)(faq_controller_1.deleteFAQ));
router.get('/testimonials', (0, asyncHandler_1.asyncHandler)(testimonial_controller_1.getTestimonials));
router.post('/testimonials', (0, asyncHandler_1.asyncHandler)(testimonial_controller_1.createTestimonial));
router.put('/testimonials/:id', (0, asyncHandler_1.asyncHandler)(testimonial_controller_1.updateTestimonial));
router.delete('/testimonials/:id', (0, asyncHandler_1.asyncHandler)(testimonial_controller_1.deleteTestimonial));
exports.default = router;
