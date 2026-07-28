"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./config/db");
const logger_1 = require("./utils/logger");
const ApiError_1 = require("./utils/ApiError");
const swagger_1 = require("./config/swagger");
// Import 3-Tier Routers
const public_routes_1 = __importDefault(require("./routes/public/public.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin/admin.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Global Middleware
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('combined', { stream: { write: (message) => logger_1.logger.info(message.trim()) } }));
// Ensure MongoDB connection per request (Serverless safe)
app.use(async (req, res, next) => {
    try {
        await (0, db_1.connectDB)();
    }
    catch (err) {
        logger_1.logger.warn(`MongoDB Connection Warning: ${err.message}`);
    }
    next();
});
// Serve Uploaded Files Statically if directory exists
const uploadsPath = path_1.default.join(process.cwd(), 'uploads');
try {
    app.use('/uploads', express_1.default.static(uploadsPath));
}
catch (e) { }
// OpenAPI / Swagger UI Setup
(0, swagger_1.setupSwagger)(app);
// Health Check Endpoint for Render / Load Balancers
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime(), timestamp: new Date() });
});
// Root Welcome Endpoint
app.get('/', (req, res) => {
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
app.use('/api/v1/public', public_routes_1.default);
// Tier 2: Admin CMS API (/api/v1/admin)
app.use('/api/v1/admin', admin_routes_1.default);
// Tier 3: Internal System API (/api/v1/internal)
app.use('/api/v1/internal', (req, res) => {
    res.json({ status: 'OK', message: 'Internal System Engine operational', timestamp: new Date() });
});
// 404 Route Handler
app.use((req, res, next) => {
    next(ApiError_1.ApiError.notFound(`Requested route '${req.originalUrl}' not found`));
});
// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    logger_1.logger.error(`[${req.method}] ${req.url} - Error ${statusCode}: ${message}`);
    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});
exports.default = app;
