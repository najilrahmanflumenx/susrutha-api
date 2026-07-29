import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { autoSeedSystemData } from './autoSeed';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1 || isConnected) {
    return;
  }

  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = 'mongodb://127.0.0.1:27017/susrutha_db';

  if (primaryUri) {
    try {
      const conn = await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
      isConnected = true;
      logger.info(`MongoDB Connected (Primary): ${conn.connection.host}/${conn.connection.name}`);
      await autoSeedSystemData();
      return;
    } catch (error: any) {
      logger.warn(`Primary MongoDB Connection Failed (${error.message}). Attempting local fallback...`);
    }
  }

  try {
    const conn = await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 5000 });
    isConnected = true;
    logger.info(`MongoDB Connected (Local Fallback): ${conn.connection.host}/${conn.connection.name}`);
    await autoSeedSystemData();
  } catch (error: any) {
    logger.error(`MongoDB Connection Error (Local Fallback): ${error.message}`);
    logger.warn('Continuing server execution without active MongoDB connection.');
  }
};
