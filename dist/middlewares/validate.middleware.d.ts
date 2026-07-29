import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
/**
 * Express Middleware to validate request body using Zod schema
 */
export declare const validateBody: (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
