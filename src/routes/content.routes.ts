import { Router } from 'express';
import { ContentController } from '../controllers/content.controller';

const router = Router();

router.get('/packages', ContentController.getPackages);
router.get('/infrastructure', ContentController.getInfrastructure);
router.get('/blogs', ContentController.getBlogs);
router.get('/testimonials', ContentController.getTestimonials);
router.get('/faqs', ContentController.getFAQs);
router.post('/leads', ContentController.createLead);

export default router;
