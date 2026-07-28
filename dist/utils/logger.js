"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
winston_1.default.addColors(colors);
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `[${info.timestamp}] [${info.level}]: ${info.message}`));
const transports = [
    new winston_1.default.transports.Console()
];
// File logging is only enabled in local non-serverless environments
if (!process.env.VERCEL) {
    try {
        const logsDir = path_1.default.join(process.cwd(), 'logs');
        if (!fs_1.default.existsSync(logsDir)) {
            fs_1.default.mkdirSync(logsDir, { recursive: true });
        }
        transports.push(new winston_1.default.transports.File({ filename: path_1.default.join(logsDir, 'error.log'), level: 'error' }), new winston_1.default.transports.File({ filename: path_1.default.join(logsDir, 'combined.log') }));
    }
    catch (err) {
        // Fall back cleanly to console logging on read-only environments
    }
}
exports.logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    levels,
    format,
    transports,
});
