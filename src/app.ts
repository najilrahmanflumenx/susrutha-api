import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import { logger } from './utils/logger';
import { ApiError } from './utils/ApiError';
import { setupSwagger } from './config/swagger';

// Import 3-Tier Routers
import publicRouter from './routes/public/public.routes';
import adminRouter from './routes/admin/admin.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Ensure MongoDB connection per request (Serverless safe)
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
  } catch (err: any) {
    logger.warn(`MongoDB Connection Warning: ${err.message}`);
  }
  next();
});

// Serve Uploaded Files Statically if directory exists
const uploadsPath = path.join(process.cwd(), 'uploads');
try {
  app.use('/uploads', express.static(uploadsPath));
} catch (e) {}

// OpenAPI / Swagger UI Setup
setupSwagger(app as any);

// Health Check Endpoint for Render / Load Balancers
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime(), timestamp: new Date() });
});

// Root Welcome Endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ACTIVE',
    hospital: 'SUSRUTHA Ayurvedhik Hospital CMS & API Engine',
    version: '1.0.0',
    publicDocs: `/api/v1/docs`,
    tiers: {
      public: `/api/v1/public`,
      admin: `/api/v1/admin`,
      internal: `/api/v1/internal`,
    },
  });
});

// ------------------------------------------------------------
// 3-TIER API ROUTING SURFACE
// ------------------------------------------------------------

// Tier 1: Public Website API (/api/v1/public)
app.use('/api/v1/public', publicRouter);

// Tier 2: Admin CMS API (/api/v1/admin)
app.use('/api/v1/admin', adminRouter);

// Tier 3: Internal System API (/api/v1/internal)
app.use('/api/v1/internal', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Internal System Engine operational', timestamp: new Date() });
});

// 404 Route Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Requested route '${req.originalUrl}' not found`));
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[${req.method}] ${req.url} - Error ${statusCode}: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

export default app;
