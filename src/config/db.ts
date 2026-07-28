import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { autoSeedSystemData } from './autoSeed';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/susrutha_db';
    const conn = await mongoose.connect(connStr);
    logger.info(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    await autoSeedSystemData();
  } catch (error: any) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
