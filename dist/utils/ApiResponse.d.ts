export declare class ApiResponse<T = any> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    meta?: Record<string, any>;
    constructor(statusCode: number, message: string, data: T, meta?: Record<string, any>);
    static success<T = any>(data: T, message?: string, meta?: Record<string, any>): ApiResponse<T>;
}
