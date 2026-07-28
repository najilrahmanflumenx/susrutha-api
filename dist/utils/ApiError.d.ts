export declare class ApiError extends Error {
    statusCode: number;
    errors: any[];
    isOperational: boolean;
    constructor(statusCode: number, message: string, errors?: any[], isOperational?: boolean);
    static badRequest(message: string, errors?: any[]): ApiError;
    static unauthorized(message?: string): ApiError;
    static forbidden(message?: string): ApiError;
    static notFound(message?: string): ApiError;
    static internal(message?: string): ApiError;
}
