import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  roleId: Schema.Types.ObjectId;
  assignedBranchIds: Schema.Types.ObjectId[];
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLoginAt?: Date;
  refreshToken?: string;
  isDeleted: boolean;
  deletedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, trim: true },
    roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    assignedBranchIds: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    avatar: { type: String },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
    lastLoginAt: { type: Date },
    refreshToken: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1, isDeleted: 1 });

export const User = model<IUser>('User', UserSchema);
