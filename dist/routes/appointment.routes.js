"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointment_controller_1 = require("../controllers/appointment.controller");
const router = (0, express_1.Router)();
router.get('/', appointment_controller_1.AppointmentController.getAllAppointments);
router.post('/', appointment_controller_1.AppointmentController.createAppointment);
router.patch('/:id/status', appointment_controller_1.AppointmentController.updateAppointmentStatus);
exports.default = router;
