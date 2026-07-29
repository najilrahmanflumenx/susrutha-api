import { z } from 'zod';
/**
 * Enterprise Zod Schema Definitions
 */
export declare const bookingSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    date: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    preferredTimeSlot: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    timeSlot: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    doctorId: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    branchId: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    symptoms: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    phone: string;
    email?: string | undefined;
    date?: string | undefined;
    branchId?: string | undefined;
    doctorId?: string | undefined;
    preferredTimeSlot?: string | undefined;
    symptoms?: string | undefined;
    timeSlot?: string | undefined;
}, {
    name: string;
    phone: string;
    email?: string | undefined;
    date?: string | undefined;
    branchId?: string | undefined;
    doctorId?: string | undefined;
    preferredTimeSlot?: string | undefined;
    symptoms?: string | undefined;
    timeSlot?: string | undefined;
}>;
export declare const leadSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    subject: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    message: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    branchId: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    phone: string;
    email?: string | undefined;
    message?: string | undefined;
    branchId?: string | undefined;
    subject?: string | undefined;
}, {
    name: string;
    phone: string;
    email?: string | undefined;
    message?: string | undefined;
    branchId?: string | undefined;
    subject?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
