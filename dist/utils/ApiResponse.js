"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    success;
    statusCode;
    message;
    data;
    meta;
    constructor(statusCode, message, data, meta) {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        if (meta)
            this.meta = meta;
    }
    static success(data, message = 'Success', meta) {
        return new ApiResponse(200, message, data, meta);
    }
}
exports.ApiResponse = ApiResponse;
