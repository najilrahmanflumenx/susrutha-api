import { Request, Response } from 'express';
export declare const getTreatments: (req: Request, res: Response) => Promise<void>;
export declare const getTreatmentBySlug: (req: Request, res: Response) => Promise<void>;
export declare const createTreatment: (req: Request, res: Response) => Promise<void>;
export declare const updateTreatment: (req: Request, res: Response) => Promise<void>;
export declare const deleteTreatment: (req: Request, res: Response) => Promise<void>;
