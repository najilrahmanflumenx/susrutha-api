import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  user?: mongoose.Types.ObjectId;
  userName?: string;
  userEmail?: string;
  action: string;
  module: string;
  entityId?: string;
  ipAddress: string;
  userAgent: string;
  details?: any;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, default: 'System' },
    userEmail: { type: String, default: '' },
    action: { type: String, required: true },
    module: { type: String, required: true },
    entityId: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    details: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
