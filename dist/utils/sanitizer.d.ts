/**
 * Enterprise Input Sanitizer & Validator Utilities
 */
export declare class InputSanitizer {
    /**
     * Trim whitespace and strip dangerous HTML/script tags to prevent XSS
     */
    static sanitizeString(input?: string): string;
    /**
     * RFC-compliant Email format validator
     */
    static isValidEmail(email?: string): boolean;
    /**
     * International Phone Number format validator (10 to 15 digits)
     */
    static isValidPhone(phone?: string): boolean;
    /**
     * Validates if a date string is not in the past
     */
    static isFutureOrToday(dateStr?: string | Date): boolean;
}
