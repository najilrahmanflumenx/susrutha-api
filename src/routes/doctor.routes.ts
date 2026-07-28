import { Router } from 'express';
import { DoctorController } from '../controllers/doctor.controller';

const router = Router();

router.get('/', DoctorController.getAllDoctors);
router.get('/:slug', DoctorController.getDoctorBySlug);
router.post('/', DoctorController.createDoctor);
router.put('/:id', DoctorController.updateDoctor);
router.delete('/:id', DoctorController.deleteDoctor);

export default router;
