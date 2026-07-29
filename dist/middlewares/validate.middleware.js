"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
/**
 * Express Middleware to validate request body using Zod schema
 */
const validateBody = (schema) => {
    return async (req, res, next) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const formattedErrors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                const firstMessage = formattedErrors[0]?.message || 'Validation Error';
                return next(new ApiError_1.ApiError(400, firstMessage, formattedErrors));
            }
            next(error);
        }
    };
};
exports.validateBody = validateBody;
