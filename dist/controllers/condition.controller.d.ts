import { Request, Response } from 'express';
export declare const getConditions: (req: Request, res: Response) => Promise<void>;
export declare const getConditionBySlug: (req: Request, res: Response) => Promise<void>;
export declare const createCondition: (req: Request, res: Response) => Promise<void>;
export declare const updateCondition: (req: Request, res: Response) => Promise<void>;
export declare const deleteCondition: (req: Request, res: Response) => Promise<void>;
