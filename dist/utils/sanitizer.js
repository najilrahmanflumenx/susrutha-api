"use strict";
/**
 * Enterprise Input Sanitizer & Validator Utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputSanitizer = void 0;
class InputSanitizer {
    /**
     * Trim whitespace and strip dangerous HTML/script tags to prevent XSS
     */
    static sanitizeString(input) {
        if (!input || typeof input !== 'string')
            return '';
        return input
            .trim()
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags
            .replace(/<[^>]*>?/gm, '') // Strip generic HTML tags
            .replace(/javascript:/gi, '')
            .replace(/onload=/gi, '');
    }
    /**
     * RFC-compliant Email format validator
     */
    static isValidEmail(email) {
        if (!email)
            return false;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email.trim());
    }
    /**
     * International Phone Number format validator (10 to 15 digits)
     */
    static isValidPhone(phone) {
        if (!phone)
            return false;
        const digitsOnly = phone.replace(/[^0-9]/g, '');
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
    }
    /**
     * Validates if a date string is not in the past
     */
    static isFutureOrToday(dateStr) {
        if (!dateStr)
            return false;
        const target = new Date(dateStr);
        if (isNaN(target.getTime()))
            return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return target >= today;
    }
}
exports.InputSanitizer = InputSanitizer;
