"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ApiError_1 = require("../utils/ApiError");
const isVercel = Boolean(process.env.VERCEL);
const uploadDir = isVercel ? '/tmp/uploads' : path_1.default.join(process.cwd(), 'uploads');
if (!isVercel) {
    try {
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
    }
    catch (e) {
        // Ignore filesystem creation errors on read-only environments
    }
}
const storage = isVercel
    ? multer_1.default.memoryStorage()
    : multer_1.default.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const ext = path_1.default.extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
    });
const fileFilter = (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|svg|pdf|doc|docx/;
    const extName = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    if (extName && mimeType) {
        return cb(null, true);
    }
    cb(new ApiError_1.ApiError(400, 'Invalid file type. Allowed: JPEG, PNG, WEBP, SVG, PDF, DOC, DOCX'));
};
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter,
});
