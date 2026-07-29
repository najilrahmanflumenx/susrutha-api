import { z } from 'zod';

/**
 * Enterprise Zod Schema Definitions
 */

// Public Appointment Booking Schema
export const bookingSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  phone: z.string().trim().regex(/^[0-9+()\s-]{10,20}$/, 'Invalid phone number format (must be 10-15 digits)'),
  email: z.string().trim().email('Invalid RFC email address').optional().or(z.literal('')),
  date: z.string().optional().or(z.literal('')),
  preferredTimeSlot: z.string().optional().or(z.literal('')),
  timeSlot: z.string().optional().or(z.literal('')),
  doctorId: z.string().optional().or(z.literal('')),
  branchId: z.string().optional().or(z.literal('')),
  symptoms: z.string().max(1000, 'Symptoms note cannot exceed 1000 characters').optional().or(z.literal('')),
});

// Public Contact / Lead Submission Schema
export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  phone: z.string().trim().regex(/^[0-9+()\s-]{10,20}$/, 'Invalid phone number format'),
  email: z.string().trim().email('Invalid RFC email address').optional().or(z.literal('')),
  subject: z.string().trim().max(200, 'Subject cannot exceed 200 characters').optional().or(z.literal('')),
  message: z.string().trim().max(2000, 'Message cannot exceed 2000 characters').optional().or(z.literal('')),
  branchId: z.string().optional().or(z.literal('')),
});

// Admin User Login Schema
export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
