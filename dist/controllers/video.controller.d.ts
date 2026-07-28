import { Request, Response } from 'express';
export declare const getVideos: (req: Request, res: Response) => Promise<void>;
export declare const createVideo: (req: Request, res: Response) => Promise<void>;
export declare const updateVideo: (req: Request, res: Response) => Promise<void>;
export declare const deleteVideo: (req: Request, res: Response) => Promise<void>;
