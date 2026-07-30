import AuditLog from '../models/AuditLog.model';
import { logger } from './logger';

export interface AuditLogOptions {
  userId?: string;
  userName?: string;
  userEmail?: string;
  action: string;
  module: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
}

export async function logAudit(options: AuditLogOptions): Promise<void> {
  try {
    await AuditLog.create({
      user: options.userId ? options.userId : undefined,
      userName: options.userName || 'Super Admin',
      userEmail: options.userEmail || 'admin@susruthaayurveda.com',
      action: options.action,
      module: options.module,
      entityId: options.entityId || '',
      ipAddress: options.ipAddress || '127.0.0.1',
      userAgent: options.userAgent || 'Hospital Admin CMS',
      details: options.details || {},
      timestamp: new Date(),
    });
  } catch (error: any) {
    logger.error(`Failed to record audit log: ${error.message}`);
  }
}
