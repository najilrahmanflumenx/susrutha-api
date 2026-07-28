"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
const autoSeed_1 = require("./autoSeed");
const connectDB = async () => {
    try {
        const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/susrutha_db';
        const conn = await mongoose_1.default.connect(connStr);
        logger_1.logger.info(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
        await (0, autoSeed_1.autoSeedSystemData)();
    }
    catch (error) {
        logger_1.logger.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
