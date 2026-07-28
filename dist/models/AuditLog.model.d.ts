import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<any, {}, {}, {}, any, any>;
export default _default;
