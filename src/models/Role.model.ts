import { Schema, model, Document } from 'mongoose';

export interface IRole extends Document {
  name: string; // SUPER_ADMIN, DOCTOR_MANAGER, APPOINTMENT_MANAGER, CONTENT_MANAGER, RECEPTION, VIEWER
  displayName: string;
  description?: string;
  permissions: string[]; // e.g. ['doctors:read', 'doctors:write', 'appointments:read', ...]
  isSystem: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true, uppercase: true, trim: true },
    displayName: { type: String, required: true },
    description: { type: String },
    permissions: [{ type: String, required: true }],
    isSystem: { type: Boolean, default: false },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

export const Role = model<IRole>('Role', RoleSchema);
