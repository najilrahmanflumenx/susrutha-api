"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
const autoSeed_1 = require("./autoSeed");
let isConnected = false;
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState === 1 || isConnected) {
        return;
    }
    const primaryUri = process.env.MONGODB_URI;
    const fallbackUri = 'mongodb://127.0.0.1:27017/susrutha_db';
    if (primaryUri) {
        try {
            const conn = await mongoose_1.default.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
            isConnected = true;
            logger_1.logger.info(`MongoDB Connected (Primary): ${conn.connection.host}/${conn.connection.name}`);
            await (0, autoSeed_1.autoSeedSystemData)();
            return;
        }
        catch (error) {
            logger_1.logger.warn(`Primary MongoDB Connection Failed (${error.message}). Attempting local fallback...`);
        }
    }
    try {
        const conn = await mongoose_1.default.connect(fallbackUri, { serverSelectionTimeoutMS: 5000 });
        isConnected = true;
        logger_1.logger.info(`MongoDB Connected (Local Fallback): ${conn.connection.host}/${conn.connection.name}`);
        await (0, autoSeed_1.autoSeedSystemData)();
    }
    catch (error) {
        logger_1.logger.error(`MongoDB Connection Error (Local Fallback): ${error.message}`);
        logger_1.logger.warn('Continuing server execution without active MongoDB connection.');
    }
};
exports.connectDB = connectDB;
