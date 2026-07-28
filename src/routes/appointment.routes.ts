import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';

const router = Router();

router.get('/', AppointmentController.getAllAppointments);
router.post('/', AppointmentController.createAppointment);
router.patch('/:id/status', AppointmentController.updateAppointmentStatus);

export default router;
