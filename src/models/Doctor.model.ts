import { Schema, model, Document } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  slug: string;
  designation: string; // e.g. Managing Director & Senior Physician, Senior Consultant
  qualifications: string; // e.g. BAMS, MD (Ayurveda)
  registrationNumber?: string;
  experienceYears: number;
  departmentId: Schema.Types.ObjectId;
  assignedBranchIds: Schema.Types.ObjectId[];
  bio: string;
  photo?: string;
  photoUrl?: string;
  consultationFee: number;
  availability: {
    branchId: Schema.Types.ObjectId;
    days: string[]; // e.g. ['Mon', 'Wed', 'Fri']
    timeSlots: string[]; // e.g. ['09:00 AM - 01:00 PM', '04:00 PM - 07:00 PM']
  }[];
  specialties: string[];
  languagesSpoken: string[];
  sortOrder: number;
  isDirector: boolean;
  isFeatured: boolean;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  isDeleted: boolean;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    designation: { type: String, required: true },
    qualifications: { type: String, required: true },
    registrationNumber: { type: String },
    experienceYears: { type: Number, default: 0 },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    assignedBranchIds: [{ type: Schema.Types.ObjectId, ref: 'Branch', required: true }],
    bio: { type: String, required: true },
    photo: { type: String },
    consultationFee: { type: Number, default: 0 },
    availability: [
      {
        branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
        days: [{ type: String }],
        timeSlots: [{ type: String }],
      },
    ],
    specialties: [{ type: String }],
    languagesSpoken: [{ type: String }],
    sortOrder: { type: Number, default: 0 },
    isDirector: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['ACTIVE', 'ON_LEAVE', 'INACTIVE'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

DoctorSchema.index({ assignedBranchIds: 1 });
DoctorSchema.index({ departmentId: 1 });

export const Doctor = model<IDoctor>('Doctor', DoctorSchema);
