"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.leadSchema = exports.bookingSchema = void 0;
const zod_1 = require("zod");
/**
 * Enterprise Zod Schema Definitions
 */
// Public Appointment Booking Schema
exports.bookingSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
    phone: zod_1.z.string().trim().regex(/^[0-9+()\s-]{10,20}$/, 'Invalid phone number format (must be 10-15 digits)'),
    email: zod_1.z.string().trim().email('Invalid RFC email address').optional().or(zod_1.z.literal('')),
    date: zod_1.z.string().optional().or(zod_1.z.literal('')),
    preferredTimeSlot: zod_1.z.string().optional().or(zod_1.z.literal('')),
    timeSlot: zod_1.z.string().optional().or(zod_1.z.literal('')),
    doctorId: zod_1.z.string().optional().or(zod_1.z.literal('')),
    branchId: zod_1.z.string().optional().or(zod_1.z.literal('')),
    symptoms: zod_1.z.string().max(1000, 'Symptoms note cannot exceed 1000 characters').optional().or(zod_1.z.literal('')),
});
// Public Contact / Lead Submission Schema
exports.leadSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
    phone: zod_1.z.string().trim().regex(/^[0-9+()\s-]{10,20}$/, 'Invalid phone number format'),
    email: zod_1.z.string().trim().email('Invalid RFC email address').optional().or(zod_1.z.literal('')),
    subject: zod_1.z.string().trim().max(200, 'Subject cannot exceed 200 characters').optional().or(zod_1.z.literal('')),
    message: zod_1.z.string().trim().max(2000, 'Message cannot exceed 2000 characters').optional().or(zod_1.z.literal('')),
    branchId: zod_1.z.string().optional().or(zod_1.z.literal('')),
});
// Admin User Login Schema
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email('Invalid email address format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
