import { Router } from 'express';
import { PublicController } from '../../controllers/public/public.controller';
import { getConditions, getConditionBySlug } from '../../controllers/condition.controller';
import { getTreatments, getTreatmentBySlug } from '../../controllers/treatment.controller';
import { getEcosystemPillars } from '../../controllers/ecosystem.controller';
import { getNewsEvents } from '../../controllers/newsEvent.controller';
import { getVideos } from '../../controllers/video.controller';
import { getGalleryAlbums } from '../../controllers/gallery.controller';
import { getAffiliations } from '../../controllers/affiliation.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateBody } from '../../middlewares/validate.middleware';
import { bookingSchema, leadSchema } from '../../validators/schemas';

const router = Router();

// Base Route: /api/v1/public

router.get('/search', asyncHandler(PublicController.search));
router.get('/home', asyncHandler(PublicController.getHome));
router.get('/settings', asyncHandler(PublicController.getSettings));
router.get('/branches', asyncHandler(PublicController.getBranches));
router.get('/doctors', asyncHandler(PublicController.getDoctors));
router.get('/doctors/:slug', asyncHandler(PublicController.getDoctorBySlug));
router.get('/departments', asyncHandler(PublicController.getDepartments));
router.get('/packages', asyncHandler(PublicController.getPackages));
router.get('/packages/:slug', asyncHandler(PublicController.getPackageBySlug));
router.get('/care-packages', asyncHandler(PublicController.getPackages));
router.get('/care-packages/:slug', asyncHandler(PublicController.getPackageBySlug));
router.get('/blogs', asyncHandler(PublicController.getBlogs));
router.get('/blogs/:slug', asyncHandler(PublicController.getBlogBySlug));
router.get('/facilities', asyncHandler(PublicController.getFacilities));
router.get('/testimonials', asyncHandler(PublicController.getTestimonials));
router.get('/faqs', asyncHandler(PublicController.getFaqs));

// Public Website Parity Endpoints
router.get('/conditions', asyncHandler(getConditions));
router.get('/conditions/:slug', asyncHandler(getConditionBySlug));
router.get('/treatments', asyncHandler(getTreatments));
router.get('/treatments/:slug', asyncHandler(getTreatmentBySlug));
router.get('/ecosystem', asyncHandler(PublicController.getEcosystemPillars));
router.get('/ecosystem/:slug', asyncHandler(PublicController.getEcosystemPillarBySlug));
router.get('/media', asyncHandler(getNewsEvents));
router.get('/videos', asyncHandler(getVideos));
router.get('/gallery', asyncHandler(getGalleryAlbums));
router.get('/affiliations', asyncHandler(getAffiliations));

// Form Post Endpoints with Zod Middleware
router.post('/appointment', validateBody(bookingSchema), asyncHandler(PublicController.bookAppointment));
router.post('/contact', validateBody(leadSchema), asyncHandler(PublicController.submitLead));
router.post('/feedback', asyncHandler(PublicController.submitFeedback));

export default router;
